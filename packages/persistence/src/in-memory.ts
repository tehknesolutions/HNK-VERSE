import type { CommandReceipt, HnkEvent } from '@hnk-verse/contracts';
import type {
  AppendEventInput,
  AppendEventResult,
  CommandReceiptStore,
  EventStore,
  Snapshot,
  SnapshotStore,
  StoredEvent,
} from './ports.ts';

export class ConcurrencyConflictError extends Error {
  readonly code = 'CONCURRENCY_CONFLICT' as const;

  constructor(
    readonly worldId: string,
    readonly expectedSequenceNo: number,
    readonly actualSequenceNo: number,
  ) {
    super(
      `World ${worldId} sequence conflict: expected ${expectedSequenceNo}, actual ${actualSequenceNo}`,
    );
  }
}

export class IdempotencyConflictError extends Error {
  readonly code = 'IDEMPOTENCY_CONFLICT' as const;

  constructor(readonly idempotencyKey: string) {
    super(`Conflicting payload for idempotency key ${idempotencyKey}`);
  }
}

function receiptKey(
  worldId: string,
  actorId: string,
  idempotencyKey: string,
): string {
  return `${worldId}::${actorId}::${idempotencyKey}`;
}

export class InMemoryPersistence<TState>
  implements EventStore, SnapshotStore<TState>, CommandReceiptStore
{
  private readonly eventsByWorld = new Map<string, StoredEvent[]>();
  private readonly receipts = new Map<string, CommandReceipt>();
  private readonly snapshots = new Map<string, Snapshot<TState>>();

  async append(input: AppendEventInput): Promise<AppendEventResult> {
    const key = receiptKey(
      input.worldId,
      input.receipt.actorId,
      input.receipt.idempotencyKey,
    );
    const existing = this.receipts.get(key);

    if (existing) {
      if (existing.requestHash !== input.receipt.requestHash) {
        throw new IdempotencyConflictError(input.receipt.idempotencyKey);
      }

      return {
        acceptedSequenceNo: await this.latestSequence(input.worldId),
        eventIds: [...existing.resultEventIds],
        receipt: structuredClone(existing),
      };
    }

    const stream = this.eventsByWorld.get(input.worldId) ?? [];
    const actualSequenceNo = stream.at(-1)?.sequenceNo ?? 0;

    if (actualSequenceNo !== input.expectedSequenceNo) {
      throw new ConcurrencyConflictError(
        input.worldId,
        input.expectedSequenceNo,
        actualSequenceNo,
      );
    }

    const stored: StoredEvent[] = input.events.map((event, index) => ({
      sequenceNo: actualSequenceNo + index + 1,
      event: structuredClone(event),
    }));

    this.eventsByWorld.set(input.worldId, [...stream, ...stored]);
    this.receipts.set(key, structuredClone(input.receipt));

    return {
      acceptedSequenceNo: stored.at(-1)?.sequenceNo ?? actualSequenceNo,
      eventIds: input.events.map((event) => event.eventId),
      receipt: structuredClone(input.receipt),
    };
  }

  async readAfter(worldId: string, sequenceNo: number): Promise<StoredEvent[]> {
    return (this.eventsByWorld.get(worldId) ?? [])
      .filter((stored) => stored.sequenceNo > sequenceNo)
      .map((stored) => structuredClone(stored));
  }

  async latestSequence(worldId: string): Promise<number> {
    return this.eventsByWorld.get(worldId)?.at(-1)?.sequenceNo ?? 0;
  }

  async find(
    worldId: string,
    actorId: string,
    idempotencyKey: string,
  ): Promise<CommandReceipt | null> {
    const value = this.receipts.get(
      receiptKey(worldId, actorId, idempotencyKey),
    );
    return value ? structuredClone(value) : null;
  }

  async loadLatest(worldId: string): Promise<Snapshot<TState> | null> {
    const snapshot = this.snapshots.get(worldId);
    return snapshot ? structuredClone(snapshot) : null;
  }

  async save(snapshot: Snapshot<TState>): Promise<void> {
    this.snapshots.set(snapshot.worldId, structuredClone(snapshot));
  }

  async allEvents(worldId: string): Promise<HnkEvent<unknown>[]> {
    return (this.eventsByWorld.get(worldId) ?? []).map((stored) =>
      structuredClone(stored.event),
    );
  }

  async receiptCount(): Promise<number> {
    return this.receipts.size;
  }

  clearRuntimeCaches(): void {
    // Intentionally a no-op: this adapter itself represents durable storage
    // for deterministic tests. Runtime state is held by the command service.
  }
}
