import {
  projectEventInspector,
  projectZeroChronicle,
} from '@hnk-verse/chronicle';
import {
  ZERO_IDS,
  type HnkEvent,
} from '@hnk-verse/contracts';
import { ZERO_FIXTURE_V1_EVENTS } from '@hnk-verse/fixtures';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const sources = ZERO_FIXTURE_V1_EVENTS.map((event, index) => ({
  sequenceNo: index + 1,
  event,
}));

const chronicle = projectZeroChronicle(sources);
const inspector = projectEventInspector(sources);

const titles = new Set(chronicle.map((entry) => entry.title));

for (const expected of [
  'VALI observado',
  'VALI compreendido',
  'Conhecimento prático descoberto',
  'Prática evidenciada',
  'Caixa de Madeira criada',
  'A Home foi transformada',
  'Propriedade transferida',
  'O presente entrou na história da relação',
  'Reflexão humana',
  'Descanso na Home',
]) {
  assert(titles.has(expected), `CHRONICLE_MISSING: ${expected}`);
}

const reflection = chronicle.find((entry) => entry.title === 'Reflexão humana');
assert(reflection, 'CHRONICLE_REFLECTION_MISSING');
assert(
  reflection.authority === 'HUMAN_AUTHORED_INTERPRETATION',
  'CHRONICLE_REFLECTION_AUTHORITY_WRONG',
);
assert(
  reflection.sourceEventRefs.length >= 1,
  'CHRONICLE_REFLECTION_SOURCE_REFS_MISSING',
);

assert(
  inspector.length === ZERO_FIXTURE_V1_EVENTS.length,
  'EVENT_INSPECTOR_MUST_PRESERVE_ALL_EVENTS',
);

const movement: HnkEvent<unknown> = {
  eventId: 'EV-CHRONICLE-MOVE-001',
  eventType: 'AvatarPositionCheckpointed',
  schemaVersion: 1,
  verseId: ZERO_IDS.verse,
  worldId: ZERO_IDS.world,
  actorId: ZERO_IDS.avatar,
  targetId: ZERO_IDS.avatar,
  realTimestamp: '2026-01-01T00:00:00Z',
  worldTimestamp: 'WORLD-DAY-001T09:00:00',
  correlationId: 'CORR-CHRONICLE-MOVE',
  payload: {
    avatarId: ZERO_IDS.avatar,
    logicalX: 7,
    logicalY: 6,
  },
};

const withMovement = [
  ...sources,
  {
    sequenceNo: sources.length + 1,
    event: movement,
  },
];

assert(
  projectZeroChronicle(withMovement).length === chronicle.length,
  'MOVEMENT_CHECKPOINT_MUST_NOT_POLLUTE_CHRONICLE',
);
assert(
  projectEventInspector(withMovement).at(-1)?.eventType ===
    'AvatarPositionCheckpointed',
  'EVENT_INSPECTOR_MUST_INCLUDE_MOVEMENT_CHECKPOINT',
);

console.log(
  'ZERO_CHRONICLE_CHECK_PASS: derived milestones + interpretation authority + full inspector + movement-noise filtering',
);
