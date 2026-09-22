import type { CommandReceipt } from '@hnk-verse/contracts';
import {
  ConcurrencyConflictError,
  IdempotencyConflictError,
} from './errors.ts';
import type {
  AppendEventInput,
  AppendEventResult,
  CommandReceiptStore,
  EventStore,
  Snapshot,
  SnapshotStore,
  StoredEvent,
} from './ports.ts';

type LocalWorldDocument<TState> = {
  schemaVersion: 1;
  events: StoredEvent[];
  receipts: Record<string, CommandReceipt>;
  snapshot: Snapshot<TState> | null;
};

function receiptKey(actorId: string, idempotencyKey: string): string {
  return `${actorId}::${idempotencyKey}`;
}

export class BrowserLocalPersistence<TState>
  implements EventStore, SnapshotStore<TState>, CommandReceiptStore
{
  private readonly prefix: string;

  constructor(prefix = 'hnk-verse:zero:v1') {
    this.prefix = prefix;
  }

  private storageKey(worldId: string): string {
    return `${this.prefix}:${worldId}`;
  }

  private read(worldId: string): LocalWorldDocument<TState> {
    const raw = globalThis.localStorage?.getItem(this.storageKey(worldId));
    if (!raw) {
      return {
        schemaVersion: 1,
        events: [],
        receipts: {},
        snapshot: null,
      };
    }

    return JSON.parse(raw) as LocalWorldDocument<TState>;
  }

  private write(worldId: string, document: LocalWorldDocument<TState>): void {
    globalThis.localStorage?.setItem(
      this.storageKey(worldId),
      JSON.stringify(document),
    );
  }

  async append(input: AppendEventInput): Promise<AppendEventResult> {
    const document = this.read(input.worldId);
    const key = receiptKey(
      input.receipt.actorId,
      input.receipt.idempotencyKey,
    );
    const existing = document.receipts[key];
    const actualSequence = document.events.at(-1)?.sequenceNo ?? 0;

    if (existing) {
      if (existing.requestHash !== input.receipt.requestHash) {
        throw new IdempotencyConflictError(input.receipt.idempotencyKey);
      }

      return {
        acceptedSequenceNo: actualSequence,
        eventIds: [...existing.resultEventIds],
        receipt: structuredClone(existing),
      };
    }

    if (actualSequence !== input.expectedSequenceNo) {
      throw new ConcurrencyConflictError(
        input.worldId,
        input.expectedSequenceNo,
        actualSequence,
      );
    }

    const stored = input.events.map((event, index) => ({
      sequenceNo: actualSequence + index + 1,
      event: structuredClone(event),
    }));

    document.events.push(...stored);
    document.receipts[key] = structuredClone(input.receipt);
    this.write(input.worldId, document);

    return {
      acceptedSequenceNo: stored.at(-1)?.sequenceNo ?? actualSequence,
      eventIds: input.events.map((event) => event.eventId),
      receipt: structuredClone(input.receipt),
    };
  }

  async readAfter(worldId: string, sequenceNo: number): Promise<StoredEvent[]> {
    return this.read(worldId).events
      .filter((stored) => stored.sequenceNo > sequenceNo)
      .map((stored) => structuredClone(stored));
  }

  async latestSequence(worldId: string): Promise<number> {
    return this.read(worldId).events.at(-1)?.sequenceNo ?? 0;
  }

  async find(
    worldId: string,
    actorId: string,
    idempotencyKey: string,
  ): Promise<CommandReceipt | null> {
    const value = this.read(worldId).receipts[
      receiptKey(actorId, idempotencyKey)
    ];
    return value ? structuredClone(value) : null;
  }

  async loadLatest(worldId: string): Promise<Snapshot<TState> | null> {
    const snapshot = this.read(worldId).snapshot;
    return snapshot ? structuredClone(snapshot) : null;
  }

  async save(snapshot: Snapshot<TState>): Promise<void> {
    const document = this.read(snapshot.worldId);
    document.snapshot = structuredClone(snapshot);
    this.write(snapshot.worldId, document);
  }

  clear(worldId: string): void {
    globalThis.localStorage?.removeItem(this.storageKey(worldId));
  }
}
