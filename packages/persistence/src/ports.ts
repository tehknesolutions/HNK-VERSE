import type {
  CommandReceipt,
  HnkEvent,
} from '@hnk-verse/contracts';

export type StoredEvent = {
  sequenceNo: number;
  event: HnkEvent<unknown>;
};

export type Snapshot<TState = unknown> = {
  snapshotId: string;
  worldId: string;
  streamSequenceNo: number;
  schemaVersion: number;
  stateHash: string;
  state: TState;
  createdAt: string;
};

export type AppendEventInput = {
  worldId: string;
  expectedSequenceNo: number;
  events: HnkEvent<unknown>[];
  receipt: CommandReceipt;
};

export type AppendEventResult = {
  acceptedSequenceNo: number;
  eventIds: string[];
  receipt: CommandReceipt;
};

export interface EventStore {
  append(input: AppendEventInput): Promise<AppendEventResult>;
  readAfter(worldId: string, sequenceNo: number): Promise<StoredEvent[]>;
  latestSequence(worldId: string): Promise<number>;
}

export interface SnapshotStore<TState = unknown> {
  loadLatest(worldId: string): Promise<Snapshot<TState> | null>;
  save(snapshot: Snapshot<TState>): Promise<void>;
}

export interface CommandReceiptStore {
  find(
    worldId: string,
    actorId: string,
    idempotencyKey: string,
  ): Promise<CommandReceipt | null>;
}

export type PersistencePorts<TState = unknown> = {
  events: EventStore;
  snapshots: SnapshotStore<TState>;
  receipts: CommandReceiptStore;
};

export type RestoreResult<TState> = {
  state: TState;
  snapshotSequenceNo: number;
  replayedEventCount: number;
  finalSequenceNo: number;
};

export async function restoreFromSnapshot<TState>(
  worldId: string,
  ports: PersistencePorts<TState>,
  emptyState: TState,
  reduce: (state: TState, event: HnkEvent<unknown>) => TState,
): Promise<RestoreResult<TState>> {
  const snapshot = await ports.snapshots.loadLatest(worldId);
  let state = snapshot?.state ?? emptyState;
  const fromSequence = snapshot?.streamSequenceNo ?? 0;
  const storedEvents = await ports.events.readAfter(worldId, fromSequence);

  for (const stored of storedEvents) {
    state = reduce(state, stored.event);
  }

  return {
    state,
    snapshotSequenceNo: fromSequence,
    replayedEventCount: storedEvents.length,
    finalSequenceNo:
      storedEvents.at(-1)?.sequenceNo ??
      snapshot?.streamSequenceNo ??
      0,
  };
}
