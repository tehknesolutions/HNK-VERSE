import { ZERO_IDS, type HnkCommand, type ZeroCommandType } from '@hnk-verse/contracts';
import type { ZeroWorldState } from '@hnk-verse/domain';
import { ZERO_FIXTURE_V1_INITIAL_STATE } from '@hnk-verse/fixtures';
import { InMemoryPersistence } from '@hnk-verse/persistence';
import { ZeroCommandRuntime } from '@hnk-verse/simulation';
import {
  ZERO_HOME_THRESHOLD,
  ZERO_WORLD_POSITIONS,
  isHomeThresholdCell,
  isHomeWallCell,
  isStaticSolidCell,
} from '@hnk-verse/world';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

let serial = 0;

function command(
  commandType: ZeroCommandType,
  payload: Record<string, unknown> = {},
  targetId?: string,
): HnkCommand<Record<string, unknown>> {
  serial += 1;
  const id = `SPATIAL-${serial}`;
  return {
    commandId: id,
    commandType,
    schemaVersion: 1,
    actorId: ZERO_IDS.avatar,
    verseId: ZERO_IDS.verse,
    worldId: ZERO_IDS.world,
    sessionId: 'SESSION-SPATIAL-CHECK-001',
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

const remoteObserve = await runtime.execute(
  command('ObserveLexeme', {}, ZERO_IDS.valiSurface),
);
assert(!remoteObserve.accepted, 'Remote VALI observation must be rejected.');
assert(
  remoteObserve.rejectionCode === 'OUT_OF_RANGE',
  `Expected OUT_OF_RANGE, got ${remoteObserve.rejectionCode}`,
);

const teleport = await runtime.execute(
  command(
    'MoveAvatar',
    { logicalX: 6, logicalY: 4 },
    ZERO_IDS.avatar,
  ),
);
assert(!teleport.accepted, 'Two-cell logical movement must be rejected.');
assert(
  teleport.rejectionCode === 'OUT_OF_RANGE',
  `Expected OUT_OF_RANGE for oversized step, got ${teleport.rejectionCode}`,
);

const towardBed = await runtime.execute(
  command(
    'MoveAvatar',
    { logicalX: 4, logicalY: 3 },
    ZERO_IDS.avatar,
  ),
);
assert(towardBed.accepted, 'Move beside Bed should be accepted.');

const intoBed = await runtime.execute(
  command(
    'MoveAvatar',
    {
      logicalX: ZERO_WORLD_POSITIONS.bed.x,
      logicalY: ZERO_WORLD_POSITIONS.bed.y,
    },
    ZERO_IDS.avatar,
  ),
);
assert(!intoBed.accepted, 'Avatar must not walk onto Bed fixture.');
assert(
  intoBed.rejectionCode === 'CELL_OCCUPIED',
  `Expected CELL_OCCUPIED for Bed, got ${intoBed.rejectionCode}`,
);

const intoNorthWall = await runtime.execute(
  command(
    'MoveAvatar',
    { logicalX: 4, logicalY: 2 },
    ZERO_IDS.avatar,
  ),
);
assert(!intoNorthWall.accepted, 'Avatar must not cross Home wall.');
assert(
  intoNorthWall.rejectionCode === 'CELL_OCCUPIED',
  `Expected CELL_OCCUPIED for wall, got ${intoNorthWall.rejectionCode}`,
);

const pathToThreshold = [
  { logicalX: 4, logicalY: 4 },
  { logicalX: 5, logicalY: 4 },
  { logicalX: 6, logicalY: 4 },
  { logicalX: 7, logicalY: 4 },
  { logicalX: 7, logicalY: 5 },
  { logicalX: 8, logicalY: 5 },
  { logicalX: 8, logicalY: 6 },
  {
    logicalX: ZERO_HOME_THRESHOLD.logical.x,
    logicalY: ZERO_HOME_THRESHOLD.logical.y,
  },
];

for (const step of pathToThreshold) {
  const moved = await runtime.execute(
    command('MoveAvatar', step, ZERO_IDS.avatar),
  );
  assert(
    moved.accepted,
    `Path to threshold failed at ${step.logicalX},${step.logicalY}: ${moved.rejectionCode}`,
  );
}

assert(
  runtime.state.avatarPosition.logicalX === ZERO_HOME_THRESHOLD.logical.x &&
    runtime.state.avatarPosition.logicalY === ZERO_HOME_THRESHOLD.logical.y,
  'Avatar did not reach Home threshold.',
);

assert(
  isHomeThresholdCell(ZERO_HOME_THRESHOLD.logical),
  'Threshold topology must recognize threshold cell.',
);
assert(
  !isHomeWallCell(ZERO_HOME_THRESHOLD.logical),
  'Threshold must not also be a wall.',
);
assert(
  !isStaticSolidCell(ZERO_HOME_THRESHOLD.logical),
  'Threshold must remain walkable.',
);

const outsideStep = await runtime.execute(
  command(
    'MoveAvatar',
    { logicalX: 10, logicalY: 6 },
    ZERO_IDS.avatar,
  ),
);
assert(outsideStep.accepted, 'Avatar must be able to leave Home through threshold.');

const events = await store.allEvents(ZERO_IDS.world);
const thresholdEvent = events.find((event) => {
  if (event.eventType !== 'AvatarPositionCheckpointed') return false;
  const payload = (event.payload ?? {}) as Record<string, unknown>;
  return payload.homeThreshold === true;
});

assert(thresholdEvent, 'Crossing threshold must be recorded in checkpoint context.');

console.log(
  'ZERO_SPATIAL_CHECK_PASS: range + single-step movement + fixture/wall collision + walkable threshold',
);
