import type { HnkKnowledgeObject } from '@hnk-verse/contracts';
import type { KnowledgeRegistry } from './knowledge-registry.ts';

export type AgentKnowledgeIntent = {
  domain?: string;
  tags?: string[];
  projectScope?: string;
  limit?: number;
};

export type AgentKnowledgeContext = {
  objects: HnkKnowledgeObject[];
  authorityOrder: readonly string[];
  generatedFrom: 'GOVERNED_REGISTRY';
};

const AUTHORITY_WEIGHT: Record<string, number> = {
  ROOT_CANON: 700,
  DOMAIN_CANON: 650,
  PRODUCT_CANON: 600,
  IMPLEMENTATION_AUTHORITY: 500,
  EVIDENCE_SOURCE: 300,
  HISTORICAL_SOURCE: 200,
  PROJECTION: 100,
};

const LIFECYCLE_WEIGHT: Record<string, number> = {
  CANON: 100,
  APPROVED: 90,
  REVIEWED: 80,
  EXPERIMENTAL: 60,
  OBSERVED: 40,
  RAW: 20,
  SUPERSEDED: -50,
  DEPRECATED: -60,
  ARCHIVED: -70,
  REJECTED: -1000,
};

export function buildAgentKnowledgeContext(
  registry: KnowledgeRegistry,
  intent: AgentKnowledgeIntent = {},
): AgentKnowledgeContext {
  const tags = new Set(intent.tags ?? []);
  const eligible = registry.list().filter((object) => {
    if (object.lifecycle === 'REJECTED') return false;
    if (intent.projectScope && object.projectScope && object.projectScope !== intent.projectScope) return false;
    if (intent.domain && object.authorityScope !== intent.domain && !object.tags?.includes(intent.domain)) return false;
    if (tags.size && !object.tags?.some((tag) => tags.has(tag))) return false;
    return true;
  });

  eligible.sort((a, b) => {
    const scoreA = (AUTHORITY_WEIGHT[a.authorityLevel] ?? 0) + (LIFECYCLE_WEIGHT[a.lifecycle] ?? 0) + (a.confidence ?? 0);
    const scoreB = (AUTHORITY_WEIGHT[b.authorityLevel] ?? 0) + (LIFECYCLE_WEIGHT[b.lifecycle] ?? 0) + (b.confidence ?? 0);
    return scoreB - scoreA || a.id.localeCompare(b.id);
  });

  return {
    objects: eligible.slice(0, intent.limit ?? 32),
    authorityOrder: ['ROOT_CANON','DOMAIN_CANON','PRODUCT_CANON','IMPLEMENTATION_AUTHORITY','EVIDENCE_SOURCE','HISTORICAL_SOURCE','PROJECTION'],
    generatedFrom: 'GOVERNED_REGISTRY',
  };
}
