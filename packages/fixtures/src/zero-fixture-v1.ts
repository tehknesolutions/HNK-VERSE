import {
  ZERO_IDS,
  ZERO_PENDING_MALKUTH_CODEX_REF,
  ZERO_VALI_LANGUAGE_REF,
  type HnkEvent,
} from '@hnk-verse/contracts';
import {
  replayZeroEvents,
  type ZeroWorldState,
} from '@hnk-verse/domain';

export const ZERO_FIXTURE_V1_VERSION = '1.0.0' as const;
export const ZERO_FIXTURE_V1_REAL_CLOCK = '2026-01-01T00:00:00Z' as const;
export const ZERO_FIXTURE_V1_WORLD_TIME = 'WORLD-DAY-001T08:00:00' as const;

export const ZERO_FIXTURE_V1_INITIAL_STATE: ZeroWorldState = {
  schemaVersion: 1,
  worldId: ZERO_IDS.world,
  lexemeObserved: false,
  valiKnown: false,
  practicalKnowledgeDiscovered: false,
  woodNodeRemaining: 4,
  inventories: {
    [ZERO_IDS.playerInventory]: {
      'RESOURCE-WOOD-ZERO-V0': 0,
    },
    [ZERO_IDS.metatronInventory]: {
      'RESOURCE-WOOD-ZERO-V0': 0,
    },
  },
  skillEvidenceIds: [],
  entities: {},
  agentMemories: [],
  relationshipHistory: [],
  reflections: [],
  energyRest: 60,
  worldTime: ZERO_FIXTURE_V1_WORLD_TIME,
  lastEventId: null,
};

function fixtureEvent(
  index: number,
  eventType: string,
  payload: unknown,
  actorId = ZERO_IDS.avatar,
  targetId?: string,
  correlationId = 'CORR-ZERO',
  causationId?: string,
): HnkEvent<unknown> {
  return {
    eventId: 'EV-ZERO-' + String(index).padStart(3, '0'),
    eventType,
    schemaVersion: 1,
    verseId: ZERO_IDS.verse,
    worldId: ZERO_IDS.world,
    actorId,
    targetId,
    sessionId: 'SESSION-ZERO-001',
    realTimestamp: ZERO_FIXTURE_V1_REAL_CLOCK,
    worldTimestamp: ZERO_FIXTURE_V1_WORLD_TIME,
    correlationId,
    causationId,
    payload,
    provenance: {
      fixtureId: ZERO_IDS.fixture,
      fixtureVersion: ZERO_FIXTURE_V1_VERSION,
    },
  };
}

export const ZERO_FIXTURE_V1_EVENTS: readonly HnkEvent<unknown>[] = [
  fixtureEvent(1, 'IdentitySessionStarted', {}, ZERO_IDS.avatar),
  fixtureEvent(
    2,
    'LexemeFormObserved',
    {
      lexemeRef: 'LEX-013',
      form: 'VALI',
      meaningRevealed: false,
      sourceAuthority: '@hnk/linguas',
      languageAuthority: 'FROZEN',
    },
    ZERO_IDS.avatar,
    ZERO_IDS.valiSurface,
    'CORR-LEARN',
  ),
  fixtureEvent(
    3,
    'AgentTeachingOffered',
    {
      lexemeRef: 'LEX-013',
      agentId: ZERO_IDS.metatron,
    },
    ZERO_IDS.metatron,
    ZERO_IDS.avatar,
    'CORR-LEARN',
    'EV-ZERO-002',
  ),
  fixtureEvent(
    4,
    'LexemeMeaningLearned',
    {
      lexemeRef: 'LEX-013',
      surface: 'VALI',
      meaningPt: 'trabalho / trabalhar',
      zeroBinding: 'TRANSVERSAL',
      curriculumBindingL07: false,
      languageRef: ZERO_VALI_LANGUAGE_REF,
    },
    ZERO_IDS.avatar,
    ZERO_IDS.valiSurface,
    'CORR-LEARN',
    'EV-ZERO-003',
  ),
  fixtureEvent(
    5,
    'KnowledgeUnitDiscovered',
    {
      knowledgeRef: ZERO_PENDING_MALKUTH_CODEX_REF,
    },
    ZERO_IDS.avatar,
    undefined,
    'CORR-LEARN',
    'EV-ZERO-004',
  ),
  ...[6, 7, 8, 9].map((index) =>
    fixtureEvent(
      index,
      'ResourceGathered',
      {
        nodeId: ZERO_IDS.woodNode,
        resourceDefinitionId: 'RESOURCE-WOOD-ZERO-V0',
        quantity: 1,
        ownerId: ZERO_IDS.avatar,
      },
      ZERO_IDS.avatar,
      ZERO_IDS.woodNode,
      'CORR-GATHER',
    ),
  ),
  fixtureEvent(
    10,
    'PracticeAttempted',
    {
      skillDefinitionId: 'SKILL-PRACTICAL-WORK-ZERO-V0',
      processId: 'PROCESS-WOODEN-BOX-ZERO-V0',
      contextEntityId: ZERO_IDS.workbench,
    },
    ZERO_IDS.avatar,
    ZERO_IDS.workbench,
    'CORR-CREATE',
  ),
  fixtureEvent(
    11,
    'PracticeSucceeded',
    {
      skillDefinitionId: 'SKILL-PRACTICAL-WORK-ZERO-V0',
      processId: 'PROCESS-WOODEN-BOX-ZERO-V0',
    },
    ZERO_IDS.avatar,
    ZERO_IDS.workbench,
    'CORR-CREATE',
    'EV-ZERO-010',
  ),
  fixtureEvent(
    12,
    'SkillEvidenceRecorded',
    {
      evidenceId: 'EVIDENCE-ZERO-PRACTICAL-WORK-001',
      skillDefinitionId: 'SKILL-PRACTICAL-WORK-ZERO-V0',
      sourceEventRefs: ['EV-ZERO-011'],
      contextEntityId: ZERO_IDS.workbench,
      result: 'SUCCESS',
      guided: true,
      quality: 1,
    },
    ZERO_IDS.avatar,
    ZERO_IDS.workbench,
    'CORR-CREATE',
    'EV-ZERO-011',
  ),
  fixtureEvent(
    13,
    'ResourceConsumed',
    {
      resourceDefinitionId: 'RESOURCE-WOOD-ZERO-V0',
      quantity: 3,
      purpose: 'PROCESS-WOODEN-BOX-ZERO-V0',
    },
    ZERO_IDS.avatar,
    ZERO_IDS.workbench,
    'CORR-CREATE',
    'EV-ZERO-011',
  ),
  fixtureEvent(
    14,
    'EntityCreated',
    {
      entityInstanceId: ZERO_IDS.woodenBox,
      definitionId: 'ENTITY-WOODEN-BOX-ZERO-V0',
      ownerId: ZERO_IDS.avatar,
      capabilities: [
        'CONTAINER',
        'PLACEABLE',
        'MOVABLE_BY_OWNER',
        'STORAGE',
        'INSPECTABLE',
      ],
      provenance: {
        processId: 'PROCESS-WOODEN-BOX-ZERO-V0',
        workbenchId: ZERO_IDS.workbench,
      },
    },
    ZERO_IDS.avatar,
    ZERO_IDS.workbench,
    'CORR-CREATE',
    'EV-ZERO-013',
  ),
  fixtureEvent(
    15,
    'EntityPlaced',
    {
      entityInstanceId: ZERO_IDS.woodenBox,
      landId: ZERO_IDS.land,
      logicalX: 5,
      logicalY: 5,
      orientation: 0,
    },
    ZERO_IDS.avatar,
    ZERO_IDS.woodenBox,
    'CORR-PLACE',
    'EV-ZERO-014',
  ),
  fixtureEvent(
    16,
    'AgentPerceivedWorldEvent',
    {
      agentId: ZERO_IDS.metatron,
      observedEventId: 'EV-ZERO-015',
      epistemicSource: 'DIRECT_OBSERVATION',
    },
    ZERO_IDS.metatron,
    ZERO_IDS.woodenBox,
    'CORR-PLACE',
    'EV-ZERO-015',
  ),
  fixtureEvent(
    17,
    'AgentMemoryCreated',
    {
      memoryId: 'MEM-ZERO-METATRON-BOX-001',
      memoryType: 'PLAYER_CREATED_AND_PLACED_BOX',
      sourceEventId: 'EV-ZERO-015',
    },
    ZERO_IDS.metatron,
    ZERO_IDS.avatar,
    'CORR-PLACE',
    'EV-ZERO-016',
  ),
  fixtureEvent(
    18,
    'TransferOffered',
    {
      fromActorId: ZERO_IDS.avatar,
      toActorId: ZERO_IDS.metatron,
      resourceDefinitionId: 'RESOURCE-WOOD-ZERO-V0',
      quantity: 1,
    },
    ZERO_IDS.avatar,
    ZERO_IDS.metatron,
    'CORR-GIFT',
  ),
  fixtureEvent(
    19,
    'OwnershipTransferred',
    {
      fromOwnerId: ZERO_IDS.avatar,
      toOwnerId: ZERO_IDS.metatron,
      resourceDefinitionId: 'RESOURCE-WOOD-ZERO-V0',
      quantity: 1,
    },
    ZERO_IDS.avatar,
    ZERO_IDS.metatron,
    'CORR-GIFT',
    'EV-ZERO-018',
  ),
  fixtureEvent(
    20,
    'RelationshipHistoryAppended',
    {
      historyId: 'RELHIST-ZERO-GIFT-001',
      relationshipId: ZERO_IDS.relationship,
      eventType: 'GIFT_RECEIVED',
      sourceEventId: 'EV-ZERO-019',
      actorFrom: ZERO_IDS.avatar,
      actorTo: ZERO_IDS.metatron,
      resourceDefinitionId: 'RESOURCE-WOOD-ZERO-V0',
      quantity: 1,
    },
    ZERO_IDS.avatar,
    ZERO_IDS.metatron,
    'CORR-GIFT',
    'EV-ZERO-019',
  ),
  fixtureEvent(
    21,
    'AgentMemoryCreated',
    {
      memoryId: 'MEM-ZERO-METATRON-GIFT-001',
      memoryType: 'GIFT_RECEIVED',
      sourceEventId: 'EV-ZERO-019',
    },
    ZERO_IDS.metatron,
    ZERO_IDS.avatar,
    'CORR-GIFT',
    'EV-ZERO-019',
  ),
  fixtureEvent(
    22,
    'HumanReflectionAppended',
    {
      reflectionId: 'REFLECTION-ZERO-001',
      authorId: ZERO_IDS.avatar,
      text: 'Fixture reflection: the Home changed through learned work.',
      linkedEventRefs: ['EV-ZERO-004', 'EV-ZERO-015', 'EV-ZERO-019'],
      authorityClass: 'HUMAN_AUTHORED_INTERPRETATION',
    },
    ZERO_IDS.avatar,
    undefined,
    'CORR-RECORD',
  ),
  fixtureEvent(
    23,
    'AvatarRested',
    {
      avatarId: ZERO_IDS.avatar,
      energyBefore: 60,
      energyAfter: 100,
      worldTimeBefore: 'WORLD-DAY-001T08:00:00',
      worldTimeAfter: 'WORLD-DAY-001T16:00:00',
    },
    ZERO_IDS.avatar,
    ZERO_IDS.bed,
    'CORR-REST',
  ),
  fixtureEvent(24, 'IdentitySessionEnded', {}, ZERO_IDS.avatar),
] as const;

export const ZERO_FIXTURE_V1_GOLDEN_STATE = replayZeroEvents(
  ZERO_FIXTURE_V1_INITIAL_STATE,
  ZERO_FIXTURE_V1_EVENTS,
);

export function assertZeroFixtureGoldenState(
  state: ZeroWorldState = ZERO_FIXTURE_V1_GOLDEN_STATE,
): void {
  const playerWood =
    state.inventories[ZERO_IDS.playerInventory]?.['RESOURCE-WOOD-ZERO-V0'] ?? -1;
  const metatronWood =
    state.inventories[ZERO_IDS.metatronInventory]?.['RESOURCE-WOOD-ZERO-V0'] ?? -1;
  const box = state.entities[ZERO_IDS.woodenBox];

  if (!state.lexemeObserved) throw new Error('VALI form was not observed.');
  if (!state.valiKnown) throw new Error('VALI meaning was not learned.');
  if (!state.practicalKnowledgeDiscovered) {
    throw new Error('Practical Malkuth knowledge was not discovered.');
  }
  if (state.woodNodeRemaining !== 0) {
    throw new Error('Wood node must be depleted in golden state.');
  }
  if (playerWood !== 0) throw new Error('Player Wood must be 0 after gift.');
  if (metatronWood !== 1) throw new Error('Metatron must own 1 Wood after gift.');
  if (state.skillEvidenceIds.length !== 1) {
    throw new Error('Exactly one ZERO Skill Evidence record is required.');
  }
  if (!box) throw new Error('Wooden Box instance is missing.');
  if (box.ownerId !== ZERO_IDS.avatar) throw new Error('Player must own Wooden Box.');
  if (!box.spatialBinding) throw new Error('Wooden Box must be placed.');
  if (state.agentMemories.length !== 2) {
    throw new Error('Metatron must have Box and Gift memories.');
  }
  if (state.relationshipHistory.length !== 1) {
    throw new Error('Exactly one gift relationship history record is required.');
  }
  if (state.reflections.length !== 1) {
    throw new Error('Exactly one fixture reflection is required.');
  }
  if (state.energyRest !== 100) throw new Error('Rest must restore fixture Energy.');
  if (state.worldTime !== 'WORLD-DAY-001T16:00:00') {
    throw new Error('Rest must advance fixture World Time.');
  }
}
