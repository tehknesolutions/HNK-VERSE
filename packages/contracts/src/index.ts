export type AuthorityStatus = 'approved' | 'candidate' | 'fixture';

export type CanonicalCodexRef = {
  source: 'codex-hnk';
  resolution: 'resolved';
  canonicalId: string;
  version: string;
  hash?: string;
  status: Exclude<AuthorityStatus, 'fixture'>;
};

export type PendingCodexRef = {
  source: 'codex-hnk';
  resolution: 'pending';
  canonicalId: null;
  internalRef: string;
  bridgeStatus: 'PENDING_CANONICAL_ID';
  sourceRefs: string[];
  authority: 'SOURCE_SUPPORTED_DERIVATION';
  version?: string;
  hash?: string;
  status: 'candidate' | 'fixture';
};

export type CodexRef = CanonicalCodexRef | PendingCodexRef;

export type LanguageRef = {
  source: 'hnk-idioma';
  canonicalId: string;
  surface: string;
  version: string;
  hash?: string;
  status: AuthorityStatus;
  authority?: 'FROZEN' | 'WATCH' | 'CANDIDATE' | 'GATE' | 'BRIDGE' | 'REFERENCE';
};

export type HnkCommand<T = unknown> = {
  commandId: string;
  commandType: ZeroCommandType | string;
  schemaVersion: number;
  actorId: string;
  verseId: string;
  worldId: string;
  sessionId: string;
  targetId?: string;
  issuedAtReal: string;
  issuedAtWorld: string;
  correlationId: string;
  causationId?: string;
  idempotencyKey: string;
  payload: T;
};

export type HnkEvent<T = unknown> = {
  eventId: string;
  eventType: ZeroEventType | string;
  schemaVersion: number;
  verseId: string;
  worldId: string;
  actorId?: string;
  targetId?: string;
  sessionId?: string;
  realTimestamp: string;
  worldTimestamp: string;
  causationId?: string;
  correlationId: string;
  payload: T;
  provenance?: Record<string, unknown>;
};

export type PracticeEvent = {
  practiceId: string;
  actorId: string;
  worldId: string;
  action: unknown;
  observation: unknown;
  result: unknown;
  interpretation?: unknown;
  evidenceRefs: string[];
  canonRefs: string[];
  occurredAt: string;
};

export type CommandReceipt = {
  commandId: string;
  idempotencyKey: string;
  actorId: string;
  worldId: string;
  commandType: string;
  requestHash: string;
  resultStatus: 'accepted' | 'rejected';
  resultEventIds: string[];
  rejectionCode?: ZeroRejectionCode;
  createdAt: string;
};

export const ZERO_COMMAND_TYPES = [
  'StartSession',
  'MoveAvatar',
  'ObserveLexeme',
  'RequestLexemeTeaching',
  'DiscoverKnowledge',
  'GatherResource',
  'AttemptPractice',
  'CraftEntity',
  'ValidatePlacement',
  'PlaceEntity',
  'MoveEntity',
  'RemoveEntity',
  'InteractWithAgent',
  'OfferTransfer',
  'TransferOwnership',
  'AppendReflection',
  'Rest',
  'EndSession',
] as const;

export type ZeroCommandType = (typeof ZERO_COMMAND_TYPES)[number];

export const ZERO_EVENT_TYPES = [
  'IdentitySessionStarted',
  'AvatarPositionCheckpointed',
  'LexemeFormObserved',
  'AgentTeachingOffered',
  'LexemeMeaningLearned',
  'KnowledgeUnitDiscovered',
  'ResourceGathered',
  'PracticeAttempted',
  'PracticeSucceeded',
  'PracticeFailed',
  'SkillEvidenceRecorded',
  'ResourceConsumed',
  'EntityCreated',
  'EntityPlaced',
  'EntityMoved',
  'EntityRemoved',
  'AgentPerceivedWorldEvent',
  'AgentMemoryCreated',
  'TransferOffered',
  'TransferRefused',
  'OwnershipTransferred',
  'RelationshipHistoryAppended',
  'HumanReflectionAppended',
  'AvatarRested',
  'WorldDayAdvanced',
  'IdentitySessionEnded',
  'CanonicalReferenceResolved',
] as const;

export type ZeroEventType = (typeof ZERO_EVENT_TYPES)[number];

export const ZERO_REJECTION_CODES = [
  'KNOWLEDGE_REQUIRED',
  'RESOURCE_INSUFFICIENT',
  'NODE_DEPLETED',
  'OUT_OF_RANGE',
  'NO_PERMISSION',
  'CELL_OCCUPIED',
  'INVALID_TRANSFER',
  'MILESTONE_REQUIRED',
  'CANON_LOCKED',
  'OUT_OF_BOUNDS',
  'INVALID_FOOTPRINT',
  'ENTITY_NOT_OWNED',
  'WORLD_RULE_DENIED',
  'CONCURRENCY_CONFLICT',
  'IDEMPOTENCY_CONFLICT',
] as const;

export type ZeroRejectionCode = (typeof ZERO_REJECTION_CODES)[number];

export type LexemeFormObservedPayload = {
  lexemeRef: 'LEX-013';
  form: 'VALI';
  meaningRevealed: false;
  sourceAuthority: '@hnk/linguas';
  languageAuthority: 'FROZEN';
};

export type LexemeMeaningLearnedPayload = {
  lexemeRef: 'LEX-013';
  surface: 'VALI';
  meaningPt: 'trabalho / trabalhar';
  zeroBinding: 'TRANSVERSAL';
  curriculumBindingL07: false;
  languageRef: LanguageRef;
};

export type KnowledgeUnitDiscoveredPayload = {
  knowledgeRef: PendingCodexRef | CanonicalCodexRef;
};

export type ResourceGatheredPayload = {
  nodeId: 'RESOURCE-NODE-WOOD-ZERO-001' | string;
  resourceDefinitionId: 'RESOURCE-WOOD-ZERO-V0' | string;
  quantity: number;
  ownerId: string;
};

export type SkillEvidenceRecordedPayload = {
  evidenceId: string;
  skillDefinitionId: 'SKILL-PRACTICAL-WORK-ZERO-V0' | string;
  sourceEventRefs: string[];
  contextEntityId: string;
  result: 'SUCCESS' | 'FAILURE';
  guided: boolean;
  quality: number;
};

export type EntityCreatedPayload = {
  entityInstanceId: string;
  definitionId: 'ENTITY-WOODEN-BOX-ZERO-V0' | string;
  ownerId: string;
  capabilities: string[];
  provenance: Record<string, unknown>;
};

export type EntityPlacedPayload = {
  entityInstanceId: string;
  landId: string;
  logicalX: number;
  logicalY: number;
  orientation: number;
};

export type OwnershipTransferredPayload = {
  fromOwnerId: string;
  toOwnerId: string;
  resourceDefinitionId: string;
  quantity: number;
};

export type HumanReflectionAppendedPayload = {
  reflectionId: string;
  authorId: string;
  text: string;
  linkedEventRefs: string[];
  authorityClass: 'HUMAN_AUTHORED_INTERPRETATION';
};

export type AvatarRestedPayload = {
  avatarId: string;
  energyBefore: number;
  energyAfter: number;
  worldTimeBefore: string;
  worldTimeAfter: string;
};

export type AvatarPositionCheckpointedPayload = {
  avatarId: string;
  logicalX: number;
  logicalY: number;
};

export const ZERO_IDS = {
  hnkIdentity: 'HNKID-ZERO-001',
  verse: 'VERSE-ZERO-001',
  world: 'WORLD-ZERO-MALKUTH-001',
  land: 'LAND-ZERO-MALKUTH-001',
  home: 'HOME-ZERO-MALKUTH-001',
  avatar: 'AVATAR-ZERO-PLAYER-001',
  metatron: 'AGENT-ZERO-CARTOGRAPHER-001',
  bed: 'ENTITY-BED-ZERO-001',
  workbench: 'ENTITY-WORKBENCH-ZERO-001',
  valiSurface: 'ENTITY-VALI-SURFACE-ZERO-001',
  cartographyTable: 'ENTITY-CARTOGRAPHY-TABLE-ZERO-001',
  woodNode: 'RESOURCE-NODE-WOOD-ZERO-001',
  woodenBox: 'ENTITY-WOODEN-BOX-ZERO-001',
  playerInventory: 'INVENTORY-ZERO-PLAYER-001',
  metatronInventory: 'INVENTORY-ZERO-METATRON-001',
  relationship: 'REL-ZERO-PLAYER-METATRON-001',
  skillRecord: 'SKILLREC-ZERO-PRACTICAL-WORK-001',
  eventStream: 'STREAM-ZERO-MALKUTH-001',
  fixture: 'HNK-ZERO-MALKUTH-FIXTURE-V1',
} as const;

export const ZERO_PENDING_MALKUTH_CODEX_REF: PendingCodexRef = {
  source: 'codex-hnk',
  resolution: 'pending',
  canonicalId: null,
  internalRef: 'ZERO-KNOWLEDGE-MALKUTH-MANIFESTATION-V0',
  bridgeStatus: 'PENDING_CANONICAL_ID',
  sourceRefs: ['HNK-PROJECT-MALKUTH-SOURCE'],
  authority: 'SOURCE_SUPPORTED_DERIVATION',
  status: 'fixture',
};

export const ZERO_VALI_LANGUAGE_REF: LanguageRef = {
  source: 'hnk-idioma',
  canonicalId: 'LEX-013',
  surface: 'VALI',
  version: '1.0.0-preproduction',
  status: 'fixture',
  authority: 'FROZEN',
};

export const LUCIDITY_INVARIANT =
  'EXPERIENCE != INTERPRETATION != EVIDENCE != CANON' as const;

export const PRACTICE_LUCIDITY_INVARIANT =
  'ACTION != OBSERVATION != RESULT != INTERPRETATION != EVIDENCE != CANON' as const;

export const FULL_LUCIDITY_INVARIANT =
  'EVENT != PERCEPTION != MEMORY != TESTIMONY != CLAIM != EVIDENCE != INTERPRETATION != CANON' as const;
