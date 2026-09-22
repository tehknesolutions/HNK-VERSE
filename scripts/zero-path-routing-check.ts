import {
  ZERO_IDS,
  type HnkCommand,
  type ZeroCommandType,
} from '@hnk-verse/contracts';
import type { ZeroWorldState } from '@hnk-verse/domain';
import { ZERO_FIXTURE_V1_INITIAL_STATE } from '@hnk-verse/fixtures';
import { InMemoryPersistence } from '@hnk-verse/persistence';
import { ZeroCommandRuntime } from '@hnk-verse/simulation';
import {
  ZERO_HOME_THRESHOLD,
  ZERO_WORLD_POSITIONS,
  findZeroInteractionRoute,
  findZeroPath,
  insideZeroLand,
  isStaticSolidCell,
  manhattanDistance,
  zeroPointKey,
  type ZeroLogicalPoint,
} from '@hnk-verse/world';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function assertCardinalPath(
  start: ZeroLogicalPoint,
  steps: readonly ZeroLogicalPoint[],
): void {
  let previous = start;

  for (const step of steps) {
    assert(insideZeroLand(step), `PATH_OUT_OF_BOUNDS: ${zeroPointKey(step)}`);
    assert(!isStaticSolidCell(step), `PATH_STATIC_COLLISION: ${zeroPointKey(step)}`);
    assert(
      manhattanDistance(previous, step) === 1,
      `PATH_NON_CARDINAL_STEP: ${zeroPointKey(previous)} -> ${zeroPointKey(step)}`,
    );
    previous = step;
  }
}

const spawn = ZERO_WORLD_POSITIONS.avatarSpawn;

const valiRoute = findZeroInteractionRoute(
  spawn,
  ZERO_WORLD_POSITIONS.valiSurface,
);
assert(valiRoute, 'VALI_ROUTE_MISSING');
assert(valiRoute.steps.length > 0, 'VALI_ROUTE_SHOULD_MOVE');
assertCardinalPath(spawn, valiRoute.steps);
assert(
  manhattanDistance(valiRoute.goal, ZERO_WORLD_POSITIONS.valiSurface) === 1,
  'VALI_ROUTE_MUST_END_ADJACENT',
);

const valiRouteRepeat = findZeroInteractionRoute(
  spawn,
  ZERO_WORLD_POSITIONS.valiSurface,
);
assert(
  JSON.stringify(valiRouteRepeat) === JSON.stringify(valiRoute),
  'PATHFINDER_MUST_BE_DETERMINISTIC',
);

const metatronRoute = findZeroInteractionRoute(
  valiRoute.goal,
  ZERO_WORLD_POSITIONS.metatron,
);
assert(metatronRoute, 'METATRON_ROUTE_MISSING');
assertCardinalPath(valiRoute.goal, metatronRoute.steps);
assert(
  metatronRoute.steps.some(
    (step) =>
      step.x === ZERO_HOME_THRESHOLD.logical.x &&
      step.y === ZERO_HOME_THRESHOLD.logical.y,
  ),
  'METATRON_ROUTE_MUST_USE_HOME_THRESHOLD',
);

const blockedAtExit = (point: ZeroLogicalPoint) =>
  point.x === 10 && point.y === 6;

const blockedMetatronRoute = findZeroInteractionRoute(
  spawn,
  ZERO_WORLD_POSITIONS.metatron,
  blockedAtExit,
);
assert(
  blockedMetatronRoute === null,
  'DYNAMIC_BLOCKER_AT_HOME_EXIT_MUST_BREAK_EXTERNAL_ROUTE',
);

const freeTile = { x: 14, y: 8 };
const freeTileRoute = findZeroPath(spawn, freeTile);
assert(freeTileRoute, 'FREE_TILE_ROUTE_MISSING');
assertCardinalPath(spawn, freeTileRoute.steps);
assert(
  freeTileRoute.goal.x === freeTile.x &&
    freeTileRoute.goal.y === freeTile.y,
  'FREE_TILE_ROUTE_MUST_END_ON_CLICKED_TILE',
);

const blockedTileRoute = findZeroPath(
  spawn,
  ZERO_WORLD_POSITIONS.workbench,
);
assert(
  blockedTileRoute === null,
  'CLICK_TO_WALK_MUST_NOT_ROUTE_ONTO_STATIC_FIXTURE',
);

let serial = 0;
function command(
  commandType: ZeroCommandType,
  payload: Record<string, unknown> = {},
  targetId?: string,
): HnkCommand<Record<string, unknown>> {
  serial += 1;
  const id = `PATH-CHECK-${serial}`;

  return {
    commandId: id,
    commandType,
    schemaVersion: 1,
    actorId: ZERO_IDS.avatar,
    verseId: ZERO_IDS.verse,
    worldId: ZERO_IDS.world,
    sessionId: 'SESSION-PATH-CHECK-001',
    targetId,
    issuedAtReal: '2026-01-01T00:00:00Z',
    issuedAtWorld: 'WORLD-DAY-001T08:00:00',
    correlationId: id,
    idempotencyKey: id,
    payload,
  };
}

const store = new InMemoryPersistence<ZeroWorldState>();
const runtime = await ZeroCommandRuntime.create(
  { events: store, snapshots: store, receipts: store },
  structuredClone(ZERO_FIXTURE_V1_INITIAL_STATE),
);

for (const step of valiRoute.steps) {
  const moved = await runtime.execute(
    command(
      'MoveAvatar',
      { logicalX: step.x, logicalY: step.y },
      ZERO_IDS.avatar,
    ),
  );

  assert(
    moved.accepted,
    `RUNTIME_REJECTED_PLANNED_STEP: ${step.x},${step.y} / ${moved.rejectionCode}`,
  );
}

const observed = await runtime.execute(
  command('ObserveLexeme', {}, ZERO_IDS.valiSurface),
);
assert(
  observed.accepted && runtime.state.lexemeObserved,
  'PLANNED_ROUTE_MUST_UNLOCK_DOMAIN_INTERACTION',
);

console.log(
  'ZERO_PATH_ROUTING_CHECK_PASS: deterministic BFS + click-to-walk + interaction routing + dynamic obstruction + runtime-compatible steps',
);
