import type {
  CommandReceipt,
  HnkCommand,
  ZeroRejectionCode,
} from '@hnk-verse/contracts';
import {
  handleZeroCommand,
  reduceZeroEvent,
  type ZeroWorldState,
} from '@hnk-verse/domain';
import {
  ConcurrencyConflictError,
  IdempotencyConflictError,
  restoreFromSnapshot,
  type PersistencePorts,
  type Snapshot,
} from '@hnk-verse/persistence';

export type ZeroCommandExecution = {
  accepted: boolean;
  deduplicated: boolean;
  rejectionCode?: ZeroRejectionCode;
  eventIds: string[];
  state: ZeroWorldState;
  receipt?: CommandReceipt;
  needsReload?: boolean;
  data?: Record<string, unknown>;
};

function stableValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(stableValue);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, nested]) => [key, stableValue(nested)]),
    );
  }
  return value;
}

export function stableRequestHash(command: HnkCommand<unknown>): string {
  const logicalRequest = {
    commandType: command.commandType,
    actorId: command.actorId,
    verseId: command.verseId,
    worldId: command.worldId,
    targetId: command.targetId ?? null,
    payload: stableValue(command.payload),
  };

  const input = JSON.stringify(logicalRequest);
  let hash = 2166136261;

  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return `fnv1a32:${(hash >>> 0).toString(16).padStart(8, '0')}`;
}

export class ZeroCommandRuntime {
  private readonly ports: PersistencePorts<ZeroWorldState>;
  private readonly emptyState: ZeroWorldState;
  private currentState: ZeroWorldState;
  private sequenceNo: number;

  private constructor(
    ports: PersistencePorts<ZeroWorldState>,
    emptyState: ZeroWorldState,
    currentState: ZeroWorldState,
    sequenceNo: number,
  ) {
    this.ports = ports;
    this.emptyState = emptyState;
    this.currentState = currentState;
    this.sequenceNo = sequenceNo;
  }

  static async create(
    ports: PersistencePorts<ZeroWorldState>,
    emptyState: ZeroWorldState,
  ): Promise<ZeroCommandRuntime> {
    const restored = await restoreFromSnapshot(
      emptyState.worldId,
      ports,
      structuredClone(emptyState),
      reduceZeroEvent,
    );

    return new ZeroCommandRuntime(
      ports,
      structuredClone(emptyState),
      restored.state,
      restored.finalSequenceNo,
    );
  }

  get state(): ZeroWorldState {
    return structuredClone(this.currentState);
  }

  get currentSequenceNo(): number {
    return this.sequenceNo;
  }

  async execute(command: HnkCommand<unknown>): Promise<ZeroCommandExecution> {
    const requestHash = stableRequestHash(command);
    const existing = await this.ports.receipts.find(
      command.worldId,
      command.actorId,
      command.idempotencyKey,
    );

    if (existing) {
      if (existing.requestHash !== requestHash) {
        return {
          accepted: false,
          deduplicated: true,
          rejectionCode: 'IDEMPOTENCY_CONFLICT',
          eventIds: [],
          state: this.state,
        };
      }

      return {
        accepted: existing.resultStatus === 'accepted',
        deduplicated: true,
        rejectionCode: existing.rejectionCode,
        eventIds: [...existing.resultEventIds],
        state: this.state,
        receipt: existing,
      };
    }

    const decision = handleZeroCommand(this.currentState, command);
    const receipt: CommandReceipt = {
      commandId: command.commandId,
      idempotencyKey: command.idempotencyKey,
      actorId: command.actorId,
      worldId: command.worldId,
      commandType: command.commandType,
      requestHash,
      resultStatus: decision.accepted ? 'accepted' : 'rejected',
      resultEventIds: decision.events.map((event) => event.eventId),
      rejectionCode: decision.accepted ? undefined : decision.rejectionCode,
      createdAt: command.issuedAtReal,
    };

    try {
      const appended = await this.ports.events.append({
        worldId: command.worldId,
        expectedSequenceNo: this.sequenceNo,
        events: decision.events,
        receipt,
      });

      if (decision.accepted) {
        for (const domainEvent of decision.events) {
          this.currentState = reduceZeroEvent(this.currentState, domainEvent);
        }
      }

      this.sequenceNo = appended.acceptedSequenceNo;

      return {
        accepted: decision.accepted,
        deduplicated: false,
        rejectionCode: decision.accepted ? undefined : decision.rejectionCode,
        eventIds: [...receipt.resultEventIds],
        state: this.state,
        receipt,
        data: decision.data,
      };
    } catch (error) {
      if (error instanceof ConcurrencyConflictError) {
        return {
          accepted: false,
          deduplicated: false,
          rejectionCode: 'CONCURRENCY_CONFLICT',
          eventIds: [],
          state: this.state,
          needsReload: true,
        };
      }

      if (error instanceof IdempotencyConflictError) {
        return {
          accepted: false,
          deduplicated: true,
          rejectionCode: 'IDEMPOTENCY_CONFLICT',
          eventIds: [],
          state: this.state,
        };
      }

      throw error;
    }
  }

  async reload(): Promise<void> {
    const restored = await restoreFromSnapshot(
      this.emptyState.worldId,
      this.ports,
      structuredClone(this.emptyState),
      reduceZeroEvent,
    );

    this.currentState = restored.state;
    this.sequenceNo = restored.finalSequenceNo;
  }

  async saveSnapshot(snapshotId: string, createdAt: string): Promise<Snapshot<ZeroWorldState>> {
    const snapshot: Snapshot<ZeroWorldState> = {
      snapshotId,
      worldId: this.currentState.worldId,
      streamSequenceNo: this.sequenceNo,
      schemaVersion: 1,
      stateHash: stableStateHash(this.currentState),
      state: this.state,
      createdAt,
    };

    await this.ports.snapshots.save(snapshot);
    return snapshot;
  }
}

export function stableStateHash(state: ZeroWorldState): string {
  const input = JSON.stringify(stableValue(state));
  let hash = 2166136261;

  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return `fnv1a32:${(hash >>> 0).toString(16).padStart(8, '0')}`;
}
