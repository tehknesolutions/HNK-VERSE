import type { AuthorityLevel, HnkKnowledgeObject, KnowledgeLifecycle } from '@hnk-verse/contracts';
import type { KnowledgeRegistry } from './knowledge-registry.ts';

export type KnowledgeQuery = {
  authorityScope?: string;
  projectScope?: string;
  tags?: string[];
  relationTarget?: string;
  authorityLevels?: AuthorityLevel[];
  lifecycles?: KnowledgeLifecycle[];
  includeHistorical?: boolean;
  limit?: number;
};

export type KnowledgePolicyDecision = {
  allowed: boolean;
  reason: 'ALLOWED' | 'REJECTED' | 'ARCHIVED' | 'SCOPE_MISMATCH' | 'AUTHORITY_DENIED';
};

export type KnowledgeQueryResult = {
  objects: HnkKnowledgeObject[];
  rejected: Array<{ id: string; reason: KnowledgePolicyDecision['reason'] }>;
};

const AUTHORITY_WEIGHT: Record<AuthorityLevel, number> = {
  ROOT_CANON: 700,
  DOMAIN_CANON: 650,
  PRODUCT_CANON: 600,
  IMPLEMENTATION_AUTHORITY: 500,
  EVIDENCE_SOURCE: 300,
  HISTORICAL_SOURCE: 200,
  PROJECTION: 100,
};

export function evaluateKnowledgePolicy(object: HnkKnowledgeObject, query: KnowledgeQuery): KnowledgePolicyDecision {
  if (object.lifecycle === 'REJECTED') return { allowed: false, reason: 'REJECTED' };
  if (!query.includeHistorical && (object.lifecycle === 'ARCHIVED' || object.lifecycle === 'SUPERSEDED' || object.lifecycle === 'DEPRECATED')) return { allowed: false, reason: 'ARCHIVED' };
  if (query.authorityScope && object.authorityScope !== query.authorityScope && object.authorityLevel !== 'ROOT_CANON') return { allowed: false, reason: 'SCOPE_MISMATCH' };
  if (query.projectScope && object.projectScope && object.projectScope !== query.projectScope) return { allowed: false, reason: 'SCOPE_MISMATCH' };
  if (query.authorityLevels?.length && !query.authorityLevels.includes(object.authorityLevel)) return { allowed: false, reason: 'AUTHORITY_DENIED' };
  if (query.lifecycles?.length && !query.lifecycles.includes(object.lifecycle)) return { allowed: false, reason: 'AUTHORITY_DENIED' };
  if (query.tags?.length && !query.tags.some((tag) => object.tags?.includes(tag))) return { allowed: false, reason: 'SCOPE_MISMATCH' };
  if (query.relationTarget && !object.relations.some((relation) => relation.target === query.relationTarget)) return { allowed: false, reason: 'SCOPE_MISMATCH' };
  return { allowed: true, reason: 'ALLOWED' };
}

export function queryKnowledge(registry: KnowledgeRegistry, query: KnowledgeQuery = {}): KnowledgeQueryResult {
  const objects: HnkKnowledgeObject[] = [];
  const rejected: KnowledgeQueryResult['rejected'] = [];
  for (const object of registry.list()) {
    const decision = evaluateKnowledgePolicy(object, query);
    if (decision.allowed) objects.push(object);
    else rejected.push({ id: object.id, reason: decision.reason });
  }
  objects.sort((a, b) => (AUTHORITY_WEIGHT[b.authorityLevel] - AUTHORITY_WEIGHT[a.authorityLevel]) || (b.confidence ?? 0) - (a.confidence ?? 0) || a.id.localeCompare(b.id));
  return { objects: objects.slice(0, query.limit ?? 64), rejected };
}
