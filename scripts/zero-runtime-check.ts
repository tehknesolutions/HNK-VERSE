import {
  ZERO_IDS,
  type HnkCommand,
  type ZeroCommandType,
} from '@hnk-verse/contracts';
import {
  replayZeroEvents,
  type ZeroWorldState,
} from '@hnk-verse/domain';
import {
  ZERO_FIXTURE_V1_INITIAL_STATE,
  assertZeroFixtureGoldenState,
} from '@hnk-verse/fixtures';
import { InMemoryPersistence } from '@hnk-verse/persistence';
import {
  ZeroCommandRuntime,
  stableStateHash,
} from '@hnk-verse/simulation';
import {
  ZERO_WORLD_POSITIONS,
  insideZeroLand,
  isStaticSolidCell,
  manhattanDistance,
  type ZeroLogicalPoint,
} from '@hnk-verse/world';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function equal<T>(actual: T, expected: T, message: string): void {
  if (!Object.is(actual, expected)) {
    throw new Error(
      `${message}: expected ${String(expected)}, got ${String(actual)}`,
    );
  }
}

function command(
  id: string,
  commandType: ZeroCommandType,
  payload: Record<string, unknown> = {},
  options: {
    idempotencyKey?: string;
    targetId?: string;
    actorId?: string;
    worldTime?: string;
  } = {},
): HnkCommand<Record<string, unknown>> {
  return {
    commandId: id,
    commandType,
    schemaVersion: 1,
    actorId: options.actorId ?? ZERO_IDS.avatar,
    verseId: ZERO_IDS.verse,
    worldId: ZERO_IDS.world,
    sessionId: 'SESSION-RUNTIME-CHECK-001',
    targetId: options.targetId,
    issuedAtReal: '2026-01-01T00:00:00Z',
    issuedAtWorld: options.worldTime ?? 'WORLD-DAY-001T08:00:00',
    correlationId: `CORR:${id}`,
    idempotencyKey: options.idempotencyKey ?? `IDEMP:${id}`,
    payload,
  };
}

function ports(store: InMemoryPersistence<ZeroWorldState>) {
  return {
    events: store,
    snapshots: store,
    receipts: store,
  };
}

let autoMoveSerial = 0;

function payloadRecord(cmd: HnkCommand<unknown>): Record<string, unknown> {
  return (cmd.payload ?? {}) as Record<string, unknown>;
}

function interactionTargetForCommand(
  cmd: HnkCommand<unknown>,
): ZeroLogicalPoint | null {
  const payload = payloadRecord(cmd);

  switch (cmd.commandType) {
    case 'ObserveLexeme':
      return ZERO_WORLD_POSITIONS.valiSurface;
    case 'RequestLexemeTeaching':
    case 'DiscoverKnowledge':
    case 'InteractWithAgent':
    case 'OfferTransfer':
    case 'TransferOwnership':
      return ZERO_WORLD_POSITIONS.metatron;
    case 'GatherResource':
      return ZERO_WORLD_POSITIONS.woodNode;
    case 'AttemptPractice':
    case 'CraftEntity':
      return ZERO_WORLD_POSITIONS.workbench;
    case 'Rest':
      return ZERO_WORLD_POSITIONS.bed;
    case 'ValidatePlacement':
    case 'PlaceEntity': {
      const logicalX = Number(payload.logicalX);
      const logicalY = Number(payload.logicalY);
      if (!Number.isInteger(logicalX) || !Number.isInteger(logicalY)) return null;
      return { x: logicalX, y: logicalY };
    }
    default:
      return null;
  }
}

function cellBlocked(
  state: ZeroWorldState,
  point: ZeroLogicalPoint,
): boolean {
  if (isStaticSolidCell(point)) return true;

  return Object.values(state.entities).some(
    (entity) =>
      entity.spatialBinding?.logicalX === point.x &&
      entity.spatialBinding?.logicalY === point.y,
  );
}

function pathToInteractionRange(
  state: ZeroWorldState,
  target: ZeroLogicalPoint,
): ZeroLogicalPoint[] {
  const start = {
    x: state.avatarPosition.logicalX,
    y: state.avatarPosition.logicalY,
  };

  if (manhattanDistance(start, target) <= 1) return [];

  const queue: Array<{ point: ZeroLogicalPoint; path: ZeroLogicalPoint[] }> = [
    { point: start, path: [] },
  ];
  const visited = new Set<string>([`${start.x},${start.y}`]);

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) break;

    const neighbors = [
      { x: current.point.x + 1, y: current.point.y },
      { x: current.point.x - 1, y: current.point.y },
      { x: current.point.x, y: current.point.y + 1 },
      { x: current.point.x, y: current.point.y - 1 },
    ];

    for (const next of neighbors) {
      const key = `${next.x},${next.y}`;
      if (visited.has(key) || !insideZeroLand(next) || cellBlocked(state, next)) {
        continue;
      }

      const path = [...current.path, next];
      if (manhattanDistance(next, target) === 1) return path;

      visited.add(key);
      queue.push({ point: next, path });
    }
  }

  throw new Error(
    `NO_WALKABLE_PATH_TO_INTERACTION_RANGE: ${target.x},${target.y}`,
  );
}

async function prepareSpatialContext(
  runtime: ZeroCommandRuntime,
  cmd: HnkCommand<unknown>,
): Promise<void> {
  if (cmd.commandType === 'MoveAvatar') return;

  const target = interactionTargetForCommand(cmd);
  if (!target || !insideZeroLand(target)) return;

  const path = pathToInteractionRange(runtime.state, target);
  for (const step of path) {
    autoMoveSerial += 1;
    const move = await runtime.execute(
      command(
        `AUTO-MOVE-${autoMoveSerial}`,
        'MoveAvatar',
        {
          logicalX: step.x,
          logicalY: step.y,
        },
        { targetId: ZERO_IDS.avatar },
      ),
    );
    assert(
      move.accepted,
      `Auto movement failed at (${step.x}, ${step.y}): ${move.rejectionCode}`,
    );
  }
}

async function executePrepared(
  runtime: ZeroCommandRuntime,
  cmd: HnkCommand<unknown>,
) {
  await prepareSpatialContext(runtime, cmd);
  return runtime.execute(cmd);
}

async function expectAccepted(
  runtime: ZeroCommandRuntime,
  cmd: HnkCommand<unknown>,
): Promise<void> {
  const result = await executePrepared(runtime, cmd);
  assert(
    result.accepted,
    `Expected ${cmd.commandType} to be accepted, got ${result.rejectionCode}`,
  );
}

async function runGoldenPath(): Promise<void> {
  const store = new InMemoryPersistence<ZeroWorldState>();
  const runtime = await ZeroCommandRuntime.create(
    ports(store),
    ZERO_FIXTURE_V1_INITIAL_STATE,
  );

  await expectAccepted(runtime, command('CMD-001', 'StartSession'));
  await expectAccepted(
    runtime,
    command('CMD-002', 'ObserveLexeme', {}, { targetId: ZERO_IDS.valiSurface }),
  );
  await expectAccepted(
    runtime,
    command(
      'CMD-003',
      'RequestLexemeTeaching',
      {},
      { targetId: ZERO_IDS.metatron },
    ),
  );
  await expectAccepted(runtime, command('CMD-004', 'DiscoverKnowledge'));

  const gatherCommands = [1, 2, 3, 4].map((index) =>
    command(
      `CMD-GATHER-${index}`,
      'GatherResource',
      { quantity: 1 },
      {
        targetId: ZERO_IDS.woodNode,
        idempotencyKey: `IDEMP:GATHER:${index}`,
      },
    ),
  );

  for (const gather of gatherCommands) {
    await expectAccepted(runtime, gather);
  }

  const beforeDuplicate = runtime.state;
  const duplicate = await runtime.execute(gatherCommands[3]);
  assert(duplicate.accepted, 'Duplicate gather should return prior accepted result.');
  assert(duplicate.deduplicated, 'Duplicate gather must be marked deduplicated.');
  equal(
    runtime.state.woodNodeRemaining,
    beforeDuplicate.woodNodeRemaining,
    'Duplicate gather changed Wood node',
  );

  const depleted = await runtime.execute(
    command('CMD-GATHER-5', 'GatherResource', { quantity: 1 }),
  );
  equal(depleted.accepted, false, 'Gather from depleted node should fail');
  equal(depleted.rejectionCode, 'NODE_DEPLETED', 'Wrong depleted-node rejection');

  await expectAccepted(runtime, command('CMD-PRACTICE', 'AttemptPractice'));

  const prematureOffer = await executePrepared(
    runtime,
    command('CMD-OFFER-PRE', 'OfferTransfer', {}, { targetId: ZERO_IDS.metatron }),
  );
  assert(prematureOffer.accepted, 'Premature offer command itself should be accepted.');
  equal(
    prematureOffer.data?.offerAccepted,
    false,
    'Gift must be refused before Box placement',
  );

  await expectAccepted(runtime, command('CMD-CRAFT', 'CraftEntity'));

  const invalidPlacement = await runtime.execute(
    command('CMD-PLACE-BAD', 'PlaceEntity', {
      landId: ZERO_IDS.land,
      logicalX: 99,
      logicalY: 99,
      orientation: 0,
    }),
  );
  equal(invalidPlacement.accepted, false, 'Out-of-bounds placement should fail');
  equal(
    invalidPlacement.rejectionCode,
    'OUT_OF_BOUNDS',
    'Wrong placement rejection code',
  );

  const validation = await executePrepared(
    runtime,
    command('CMD-VALIDATE', 'ValidatePlacement', {
      landId: ZERO_IDS.land,
      logicalX: 5,
      logicalY: 5,
      orientation: 0,
    }),
  );
  assert(validation.accepted, 'Placement validation should pass.');

  await expectAccepted(
    runtime,
    command('CMD-PLACE', 'PlaceEntity', {
      landId: ZERO_IDS.land,
      logicalX: 5,
      logicalY: 5,
      orientation: 0,
    }),
  );

  const snapshot = await runtime.saveSnapshot(
    'SNAPSHOT-ZERO-AFTER-PLACE',
    '2026-01-01T00:01:00Z',
  );
  assert(snapshot.streamSequenceNo > 0, 'Snapshot stream position must be non-zero.');

  const offer = await executePrepared(
    runtime,
    command('CMD-OFFER', 'OfferTransfer', {}, { targetId: ZERO_IDS.metatron }),
  );
  assert(offer.accepted, 'Post-placement offer should be accepted.');
  equal(offer.data?.offerAccepted, true, 'Post-placement offer policy should accept.');

  await expectAccepted(
    runtime,
    command('CMD-TRANSFER', 'TransferOwnership', {
      toOwnerId: ZERO_IDS.metatron,
      quantity: 1,
    }),
  );

  await expectAccepted(
    runtime,
    command('CMD-REFLECT', 'AppendReflection', {
      text: 'The Home changed through learned work.',
      linkedEventRefs: [],
    }),
  );

  await expectAccepted(
    runtime,
    command(
      'CMD-REST',
      'Rest',
      {},
      { targetId: ZERO_IDS.bed, worldTime: runtime.state.worldTime },
    ),
  );

  await expectAccepted(runtime, command('CMD-END', 'EndSession'));

  assertZeroFixtureGoldenState(runtime.state);

  const restored = await ZeroCommandRuntime.create(
    ports(store),
    ZERO_FIXTURE_V1_INITIAL_STATE,
  );
  assertZeroFixtureGoldenState(restored.state);
  equal(
    stableStateHash(restored.state),
    stableStateHash(runtime.state),
    'Snapshot + later events restore differs from live state',
  );

  const fullReplay = replayZeroEvents(
    structuredClone(ZERO_FIXTURE_V1_INITIAL_STATE),
    await store.allEvents(ZERO_IDS.world),
  );
  equal(
    stableStateHash(fullReplay),
    stableStateHash(restored.state),
    'Full event replay differs from restored state',
  );
}

async function runIdempotencyConflict(): Promise<void> {
  const store = new InMemoryPersistence<ZeroWorldState>();
  const runtime = await ZeroCommandRuntime.create(
    ports(store),
    ZERO_FIXTURE_V1_INITIAL_STATE,
  );

  const first = command('IDEMP-CMD-1', 'StartSession', {}, {
    idempotencyKey: 'SHARED-IDEMPOTENCY',
  });
  await expectAccepted(runtime, first);

  const same = await runtime.execute({
    ...first,
    commandId: 'IDEMP-CMD-2',
  });
  assert(same.accepted && same.deduplicated, 'Same logical retry must deduplicate.');

  const conflict = await runtime.execute(
    command('IDEMP-CMD-3', 'ObserveLexeme', {}, {
      idempotencyKey: 'SHARED-IDEMPOTENCY',
    }),
  );
  equal(conflict.accepted, false, 'Conflicting idempotency payload must fail');
  equal(
    conflict.rejectionCode,
    'IDEMPOTENCY_CONFLICT',
    'Wrong idempotency conflict code',
  );
}

async function runOptimisticConcurrency(): Promise<void> {
  const store = new InMemoryPersistence<ZeroWorldState>();
  const runtimeA = await ZeroCommandRuntime.create(
    ports(store),
    ZERO_FIXTURE_V1_INITIAL_STATE,
  );
  const runtimeB = await ZeroCommandRuntime.create(
    ports(store),
    ZERO_FIXTURE_V1_INITIAL_STATE,
  );

  await expectAccepted(runtimeA, command('CONC-A', 'StartSession'));

  const stale = await runtimeB.execute(
    command('CONC-B', 'StartSession', {}, { idempotencyKey: 'CONC-B' }),
  );
  equal(stale.accepted, false, 'Stale runtime must not append');
  equal(
    stale.rejectionCode,
    'CONCURRENCY_CONFLICT',
    'Wrong concurrency conflict code',
  );
  equal(stale.needsReload, true, 'Concurrency conflict must request reload');
}

async function runCrashAfterCommit(): Promise<void> {
  const store = new InMemoryPersistence<ZeroWorldState>();
  const runtime = await ZeroCommandRuntime.create(
    ports(store),
    ZERO_FIXTURE_V1_INITIAL_STATE,
  );

  await expectAccepted(runtime, command('CR-OBS', 'ObserveLexeme'));
  await expectAccepted(runtime, command('CR-TEACH', 'RequestLexemeTeaching'));
  await expectAccepted(runtime, command('CR-KNOW', 'DiscoverKnowledge'));

  for (let index = 1; index <= 4; index += 1) {
    await expectAccepted(
      runtime,
      command(`CR-G-${index}`, 'GatherResource', { quantity: 1 }),
    );
  }

  await expectAccepted(runtime, command('CR-PRACTICE', 'AttemptPractice'));
  await expectAccepted(runtime, command('CR-CRAFT', 'CraftEntity'));
  await expectAccepted(
    runtime,
    command('CR-PLACE', 'PlaceEntity', {
      landId: ZERO_IDS.land,
      logicalX: 5,
      logicalY: 5,
      orientation: 0,
    }),
  );

  // Simulate process/browser loss: discard the runtime object without EndSession.
  const restarted = await ZeroCommandRuntime.create(
    ports(store),
    ZERO_FIXTURE_V1_INITIAL_STATE,
  );

  const box = restarted.state.entities[ZERO_IDS.woodenBox];
  assert(box?.spatialBinding, 'Committed Box placement was lost after restart.');
  equal(box.spatialBinding.logicalX, 5, 'Restored Box X differs');
  equal(box.spatialBinding.logicalY, 5, 'Restored Box Y differs');
}

async function runRejectedPrerequisites(): Promise<void> {
  const store = new InMemoryPersistence<ZeroWorldState>();
  const runtime = await ZeroCommandRuntime.create(
    ports(store),
    ZERO_FIXTURE_V1_INITIAL_STATE,
  );

  const gather = await executePrepared(
    runtime,
    command('REJECT-GATHER', 'GatherResource', { quantity: 1 }),
  );
  equal(gather.accepted, false, 'Gather before knowledge must fail');
  equal(gather.rejectionCode, 'KNOWLEDGE_REQUIRED', 'Wrong gather rejection');

  const craft = await executePrepared(
    runtime,
    command('REJECT-CRAFT', 'CraftEntity'),
  );
  equal(craft.accepted, false, 'Craft before knowledge must fail');
  equal(craft.rejectionCode, 'KNOWLEDGE_REQUIRED', 'Wrong craft rejection');
}

await runGoldenPath();
await runIdempotencyConflict();
await runOptimisticConcurrency();
await runCrashAfterCommit();
await runRejectedPrerequisites();

globalThis.console.log(
  'ZERO_RUNTIME_CHECK_PASS: golden path, restore/replay, idempotency, concurrency, crash durability, prerequisite rejections',
);
