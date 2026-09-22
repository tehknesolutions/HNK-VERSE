import type {
  CommandReceipt,
  HnkEvent,
} from '@hnk-verse/contracts';
import {
  ConcurrencyConflictError,
  IdempotencyConflictError,
  MissingWorldStreamError,
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

export type SqlQueryResult<Row> = {
  rows: Row[];
};

export interface PostgresTransaction {
  query<Row = Record<string, unknown>>(
    sql: string,
    params?: readonly unknown[],
  ): Promise<SqlQueryResult<Row>>;
}

export interface PostgresExecutor extends PostgresTransaction {
  transaction<T>(
    fn: (transaction: PostgresTransaction) => Promise<T>,
  ): Promise<T>;
}

type StreamRow = {
  last_sequence: string | number;
};

type ReceiptRow = {
  world_id: string;
  actor_id: string;
  idempotency_key: string;
  command_id: string;
  command_type: string;
  request_hash: string;
  result_status: 'accepted' | 'rejected';
  result_event_ids: string[];
  rejection_code: string | null;
  created_at: string | Date;
};

type EventRow = {
  sequence_no: string | number;
  event_id: string;
  event_type: string;
  schema_version: number;
  verse_id: string;
  world_id: string;
  actor_id: string | null;
  target_id: string | null;
  session_id: string | null;
  real_timestamp: string | Date;
  world_timestamp: string;
  causation_id: string | null;
  correlation_id: string;
  payload: unknown;
  provenance: Record<string, unknown> | null;
};

type SnapshotRow = {
  snapshot_id: string;
  world_id: string;
  stream_sequence_no: string | number;
  schema_version: number;
  state_hash: string;
  state_payload: unknown;
  created_at: string | Date;
};

function asIso(value: string | Date): string {
  return typeof value === 'string' ? value : value.toISOString();
}

function asNumber(value: string | number): number {
  return typeof value === 'number' ? value : Number(value);
}

function mapReceipt(row: ReceiptRow): CommandReceipt {
  return {
    commandId: row.command_id,
    idempotencyKey: row.idempotency_key,
    actorId: row.actor_id,
    worldId: row.world_id,
    commandType: row.command_type,
    requestHash: row.request_hash,
    resultStatus: row.result_status,
    resultEventIds: [...row.result_event_ids],
    rejectionCode:
      row.rejection_code == null
        ? undefined
        : (row.rejection_code as CommandReceipt['rejectionCode']),
    createdAt: asIso(row.created_at),
  };
}

function mapEvent(row: EventRow): StoredEvent {
  const event: HnkEvent<unknown> = {
    eventId: row.event_id,
    eventType: row.event_type,
    schemaVersion: row.schema_version,
    verseId: row.verse_id,
    worldId: row.world_id,
    actorId: row.actor_id ?? undefined,
    targetId: row.target_id ?? undefined,
    sessionId: row.session_id ?? undefined,
    realTimestamp: asIso(row.real_timestamp),
    worldTimestamp: row.world_timestamp,
    causationId: row.causation_id ?? undefined,
    correlationId: row.correlation_id,
    payload: row.payload,
    provenance: row.provenance ?? undefined,
  };

  return {
    sequenceNo: asNumber(row.sequence_no),
    event,
  };
}

export class PostgresPersistence<TState>
  implements EventStore, SnapshotStore<TState>, CommandReceiptStore
{
  constructor(private readonly database: PostgresExecutor) {}

  async append(input: AppendEventInput): Promise<AppendEventResult> {
    return this.database.transaction(async (tx) => {
      const streamResult = await tx.query<StreamRow>(
        `select last_sequence
           from hnk_verse_private.world_streams
          where world_id = $1
          for update`,
        [input.worldId],
      );

      const stream = streamResult.rows[0];
      if (!stream) {
        throw new MissingWorldStreamError(input.worldId);
      }

      const receiptResult = await tx.query<ReceiptRow>(
        `select world_id, actor_id, idempotency_key, command_id, command_type,
                request_hash, result_status, result_event_ids, rejection_code,
                created_at
           from hnk_verse_private.command_receipts
          where world_id = $1
            and actor_id = $2
            and idempotency_key = $3`,
        [
          input.worldId,
          input.receipt.actorId,
          input.receipt.idempotencyKey,
        ],
      );

      const existing = receiptResult.rows[0];
      const actualSequence = asNumber(stream.last_sequence);

      if (existing) {
        if (existing.request_hash !== input.receipt.requestHash) {
          throw new IdempotencyConflictError(input.receipt.idempotencyKey);
        }

        return {
          acceptedSequenceNo: actualSequence,
          eventIds: [...existing.result_event_ids],
          receipt: mapReceipt(existing),
        };
      }

      if (actualSequence !== input.expectedSequenceNo) {
        throw new ConcurrencyConflictError(
          input.worldId,
          input.expectedSequenceNo,
          actualSequence,
        );
      }

      let sequence = actualSequence;

      for (const domainEvent of input.events) {
        sequence += 1;

        await tx.query(
          `insert into hnk_verse_private.world_events (
              world_id,
              sequence_no,
              event_id,
              event_type,
              schema_version,
              verse_id,
              actor_id,
              target_id,
              session_id,
              real_timestamp,
              world_timestamp,
              correlation_id,
              causation_id,
              payload,
              provenance
            ) values (
              $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14::jsonb,$15::jsonb
            )`,
          [
            input.worldId,
            sequence,
            domainEvent.eventId,
            domainEvent.eventType,
            domainEvent.schemaVersion,
            domainEvent.verseId,
            domainEvent.actorId ?? null,
            domainEvent.targetId ?? null,
            domainEvent.sessionId ?? null,
            domainEvent.realTimestamp,
            domainEvent.worldTimestamp,
            domainEvent.correlationId,
            domainEvent.causationId ?? null,
            JSON.stringify(domainEvent.payload),
            domainEvent.provenance == null
              ? null
              : JSON.stringify(domainEvent.provenance),
          ],
        );
      }

      await tx.query(
        `update hnk_verse_private.world_streams
            set last_sequence = $2,
                updated_at = now()
          where world_id = $1`,
        [input.worldId, sequence],
      );

      await tx.query(
        `insert into hnk_verse_private.command_receipts (
            world_id,
            actor_id,
            idempotency_key,
            command_id,
            command_type,
            request_hash,
            result_status,
            result_event_ids,
            rejection_code,
            created_at
          ) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
        [
          input.worldId,
          input.receipt.actorId,
          input.receipt.idempotencyKey,
          input.receipt.commandId,
          input.receipt.commandType,
          input.receipt.requestHash,
          input.receipt.resultStatus,
          input.receipt.resultEventIds,
          input.receipt.rejectionCode ?? null,
          input.receipt.createdAt,
        ],
      );

      return {
        acceptedSequenceNo: sequence,
        eventIds: [...input.receipt.resultEventIds],
        receipt: structuredClone(input.receipt),
      };
    });
  }

  async readAfter(worldId: string, sequenceNo: number): Promise<StoredEvent[]> {
    const result = await this.database.query<EventRow>(
      `select sequence_no, event_id, event_type, schema_version, verse_id,
              world_id, actor_id, target_id, session_id, real_timestamp,
              world_timestamp, causation_id, correlation_id, payload, provenance
         from hnk_verse_private.world_events
        where world_id = $1
          and sequence_no > $2
        order by sequence_no asc`,
      [worldId, sequenceNo],
    );

    return result.rows.map(mapEvent);
  }

  async latestSequence(worldId: string): Promise<number> {
    const result = await this.database.query<StreamRow>(
      `select last_sequence
         from hnk_verse_private.world_streams
        where world_id = $1`,
      [worldId],
    );

    return result.rows[0] ? asNumber(result.rows[0].last_sequence) : 0;
  }

  async find(
    worldId: string,
    actorId: string,
    idempotencyKey: string,
  ): Promise<CommandReceipt | null> {
    const result = await this.database.query<ReceiptRow>(
      `select world_id, actor_id, idempotency_key, command_id, command_type,
              request_hash, result_status, result_event_ids, rejection_code,
              created_at
         from hnk_verse_private.command_receipts
        where world_id = $1
          and actor_id = $2
          and idempotency_key = $3`,
      [worldId, actorId, idempotencyKey],
    );

    return result.rows[0] ? mapReceipt(result.rows[0]) : null;
  }

  async loadLatest(worldId: string): Promise<Snapshot<TState> | null> {
    const result = await this.database.query<SnapshotRow>(
      `select snapshot_id, world_id, stream_sequence_no, schema_version,
              state_hash, state_payload, created_at
         from hnk_verse_private.world_snapshots
        where world_id = $1
        order by stream_sequence_no desc
        limit 1`,
      [worldId],
    );

    const row = result.rows[0];
    if (!row) return null;

    return {
      snapshotId: row.snapshot_id,
      worldId: row.world_id,
      streamSequenceNo: asNumber(row.stream_sequence_no),
      schemaVersion: row.schema_version,
      stateHash: row.state_hash,
      state: row.state_payload as TState,
      createdAt: asIso(row.created_at),
    };
  }

  async save(snapshot: Snapshot<TState>): Promise<void> {
    await this.database.query(
      `insert into hnk_verse_private.world_snapshots (
          snapshot_id,
          world_id,
          stream_sequence_no,
          schema_version,
          state_hash,
          state_payload,
          created_at
        ) values ($1,$2,$3,$4,$5,$6::jsonb,$7)
        on conflict (snapshot_id) do update set
          stream_sequence_no = excluded.stream_sequence_no,
          schema_version = excluded.schema_version,
          state_hash = excluded.state_hash,
          state_payload = excluded.state_payload,
          created_at = excluded.created_at`,
      [
        snapshot.snapshotId,
        snapshot.worldId,
        snapshot.streamSequenceNo,
        snapshot.schemaVersion,
        snapshot.stateHash,
        JSON.stringify(snapshot.state),
        snapshot.createdAt,
      ],
    );
  }
}
