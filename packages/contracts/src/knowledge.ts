export const KNOWLEDGE_LIFECYCLES = ['RAW','OBSERVED','EXPERIMENTAL','REVIEWED','APPROVED','CANON','REJECTED','SUPERSEDED','DEPRECATED','ARCHIVED'] as const;
export type KnowledgeLifecycle = (typeof KNOWLEDGE_LIFECYCLES)[number];
export const EVIDENCE_STATES = ['UNVERIFIED','OBSERVED','TESTED','VALIDATED','CERTIFIED'] as const;
export type EvidenceState = (typeof EVIDENCE_STATES)[number];
export const AUTHORITY_LEVELS = ['ROOT_CANON','DOMAIN_CANON','PRODUCT_CANON','IMPLEMENTATION_AUTHORITY','PROJECTION','EVIDENCE_SOURCE','HISTORICAL_SOURCE'] as const;
export type AuthorityLevel = (typeof AUTHORITY_LEVELS)[number];
export const KNOWLEDGE_RELATIONS = ['ROOT_OF','DOMAIN_CANON_FOR','CONSUMES_CANON_FROM','PUBLISHES_CONTRACT_TO','MIGRATED_FROM','INCUBATED_IN','PROJECTS_INTO','PRODUCES_EVIDENCE_FOR','PEDAGOGICAL_PROJECTION_OF','RUNTIME_PROJECTION_OF','MUST_NOT_PROMOTE_TO_CANON','IMPLEMENTS','VALIDATED_BY','SUPERSEDES','DERIVED_FROM','EXTRACTED_FROM','REUSES'] as const;
export type KnowledgeRelationType = (typeof KNOWLEDGE_RELATIONS)[number];
export type KnowledgeRelation = { type: KnowledgeRelationType; target: string };
export type TemporalScope = { observedAt?: string; validFrom?: string; validUntil?: string | null };
export type HnkKnowledgeObject<T = unknown> = { id:string; type:string; title:string; description?:string; lifecycle:KnowledgeLifecycle; authorityScope:string; authorityLevel:AuthorityLevel; evidenceState?:EvidenceState; confidence?:number; sources:string[]; evidence?:string[]; relations:KnowledgeRelation[]; tags?:string[]; projectScope?:string; supersedes?:string[]; temporalScope?:TemporalScope; payload?:T };

export function maySelfPromoteToCanon(_object: HnkKnowledgeObject): boolean { return false; }
export function isDerivedAuthority(level: AuthorityLevel): boolean { return level === 'PROJECTION' || level === 'EVIDENCE_SOURCE' || level === 'HISTORICAL_SOURCE'; }

export function assertKnowledgeObject(object: HnkKnowledgeObject): void {
  if (!object || typeof object !== 'object') throw new Error('KNOWLEDGE_OBJECT_REQUIRED');
  if (!object.id || !object.type || !object.title || !object.authorityScope) throw new Error('KNOWLEDGE_IDENTITY_REQUIRED');
  if (!Array.isArray(object.sources) || !object.sources.length || object.sources.some((source) => typeof source !== 'string' || !source)) throw new Error('KNOWLEDGE_SOURCE_REQUIRED');
  if (!Array.isArray(object.relations)) throw new Error('KNOWLEDGE_RELATIONS_REQUIRED');
  if (!(KNOWLEDGE_LIFECYCLES as readonly string[]).includes(object.lifecycle)) throw new Error('KNOWLEDGE_LIFECYCLE_INVALID');
  if (!(AUTHORITY_LEVELS as readonly string[]).includes(object.authorityLevel)) throw new Error('KNOWLEDGE_AUTHORITY_INVALID');
  if (object.evidenceState !== undefined && !(EVIDENCE_STATES as readonly string[]).includes(object.evidenceState)) throw new Error('KNOWLEDGE_EVIDENCE_STATE_INVALID');
  if (object.confidence !== undefined && (typeof object.confidence !== 'number' || object.confidence < 0 || object.confidence > 1)) throw new Error('KNOWLEDGE_CONFIDENCE_OUT_OF_RANGE');
  if (object.lifecycle === 'CANON' && isDerivedAuthority(object.authorityLevel)) throw new Error('DERIVED_AUTHORITY_CANNOT_BE_CANON');
}
