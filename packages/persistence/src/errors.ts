export class ConcurrencyConflictError extends Error {
  readonly code = 'CONCURRENCY_CONFLICT' as const;
  readonly worldId: string;
  readonly expectedSequenceNo: number;
  readonly actualSequenceNo: number;

  constructor(
    worldId: string,
    expectedSequenceNo: number,
    actualSequenceNo: number,
  ) {
    super(
      `World ${worldId} sequence conflict: expected ${expectedSequenceNo}, actual ${actualSequenceNo}`,
    );
    this.worldId = worldId;
    this.expectedSequenceNo = expectedSequenceNo;
    this.actualSequenceNo = actualSequenceNo;
  }
}

export class IdempotencyConflictError extends Error {
  readonly code = 'IDEMPOTENCY_CONFLICT' as const;
  readonly idempotencyKey: string;

  constructor(idempotencyKey: string) {
    super(`Conflicting payload for idempotency key ${idempotencyKey}`);
    this.idempotencyKey = idempotencyKey;
  }
}

export class MissingWorldStreamError extends Error {
  readonly code = 'MISSING_WORLD_STREAM' as const;
  readonly worldId: string;

  constructor(worldId: string) {
    super(`World stream ${worldId} does not exist.`);
    this.worldId = worldId;
  }
}
