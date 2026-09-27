export * from './hierarchy';

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
  'StartSession','MoveAvatar','ObserveLexeme','RequestLexemeTeaching','DiscoverKnowledge','GatherResource','AttemptPractice','CraftEntity','ValidatePlacement','PlaceEntity','MoveEntity','RemoveEntity','InteractWithAgent','OfferTransfer','TransferOwnership','AppendReflection','Rest','EndSession',
] as const;
export type ZeroCommandType = (typeof ZERO_COMMAND_TYPES)[number];

export const ZERO_EVENT_TYPES = [
  'IdentitySessionStarted','AvatarPositionCheckpointed','LexemeFormObserved','AgentTeachingOffered','LexemeMeaningLearned','KnowledgeUnitDiscovered','ResourceGathered','PracticeAttempted','PracticeSucceeded','PracticeFailed','SkillEvidenceRecorded','ResourceConsumed','EntityCreated','EntityPlaced','EntityMoved','EntityRemoved','AgentPerceivedWorldEvent','AgentMemoryCreated','TransferOffered','TransferRefused','OwnershipTransferred','RelationshipHistoryAppended','HumanReflectionAppended','AvatarRested','WorldDayAdvanced','IdentitySessionEnded','CanonicalReferenceResolved',
] as const;
export type ZeroEventType = (typeof ZERO_EVENT_TYPES)[number];

export const ZERO_REJECTION_CODES = [
  'KNOWLEDGE_REQUIRED','RESOURCE_INSUFFICIENT','NODE_DEPLETED','OUT_OF_RANGE','NO_PERMISSION','CELL_OCCUPIED','INVALID_TRANSFER','MILESTONE_REQUIRED','CANON_LOCKED','OUT_OF_BOUNDS','INVALID_FOOTPRINT','ENTITY_NOT_OWNED','WORLD_RULE_DENIED','CONCURRENCY_CONFLICT','IDEMPOTENCY_CONFLICT',
] as const;
export type ZeroRejectionCode = (typeof ZERO_REJECTION_CODES)[number];

export type LexemeFormObservedPayload = { lexemeRef: 'LEX-013'; form: 'VALI'; meaningRevealed: false; sourceAuthority: '@hnk/linguas'; languageAuthority: 'FROZEN' };
export type LexemeMeaningLearnedPayload = { lexemeRef: 'LEX-013'; surface: 'VALI'; meaningPt: 'trabalho / trabalhar'; zeroBinding: 'TRANSVERSAL'; curriculumBindingL07: false; languageRef: LanguageRef };
export type KnowledgeUnitDiscoveredPayload = { knowledgeRef: PendingCodexRef | CanonicalCodexRef };
export type ResourceGatheredPayload = { nodeId: 'RESOURCE-NODE-WOOD-ZERO-001' | string; resourceDefinitionId: 'RESOURCE-WOOD-ZERO-V0' | string; quantity: number; ownerId: string };
export type SkillEvidenceRecordedPayload = Record<string, unknown>;
