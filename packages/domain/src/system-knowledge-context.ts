import type { HnkKnowledgeObject } from '@hnk-verse/contracts';
import type { KnowledgeRegistry } from './knowledge-registry.ts';
import { buildAgentKnowledgeContext } from './agent-knowledge-context.ts';

export type RuntimeKnowledgeScope = {
  worldId?: string;
  systemId?: string;
  projectScope?: string;
  tags?: string[];
  limit?: number;
};

export type RuntimeKnowledgeContext = {
  kind: 'WORLD' | 'SYSTEM';
  scopeId: string;
  objects: HnkKnowledgeObject[];
  generatedFrom: 'GOVERNED_REGISTRY';
};

function scopeContext(
  registry: KnowledgeRegistry,
  kind: 'WORLD' | 'SYSTEM',
  scopeId: string,
  scope: RuntimeKnowledgeScope,
): RuntimeKnowledgeContext {
  if (!scopeId) throw new Error(`${kind}_KNOWLEDGE_SCOPE_REQUIRED`);
  const base = buildAgentKnowledgeContext(registry, {
    projectScope: scope.projectScope,
    tags: scope.tags,
    limit: Math.max(scope.limit ?? 64, 1) * 2,
  });
  const scopeTag = `${kind}:${scopeId}`;
  const objects = base.objects.filter((object) => {
    if (object.authorityLevel === 'ROOT_CANON') return true;
    if (object.tags?.includes(scopeTag)) return true;
    if (kind === 'WORLD' && object.tags?.includes('WORLD')) return true;
    if (kind === 'SYSTEM' && object.tags?.includes('SYSTEM')) return true;
    return object.authorityLevel === 'DOMAIN_CANON' && object.relations.some((relation) => relation.target === scopeId || relation.target === 'HNK-VERSE');
  });
  return { kind, scopeId, objects: objects.slice(0, scope.limit ?? 64), generatedFrom: 'GOVERNED_REGISTRY' };
}

export function buildWorldKnowledgeContext(registry: KnowledgeRegistry, worldId: string, scope: RuntimeKnowledgeScope = {}): RuntimeKnowledgeContext {
  return scopeContext(registry, 'WORLD', worldId, { ...scope, worldId });
}

export function buildSystemKnowledgeContext(registry: KnowledgeRegistry, systemId: string, scope: RuntimeKnowledgeScope = {}): RuntimeKnowledgeContext {
  return scopeContext(registry, 'SYSTEM', systemId, { ...scope, systemId });
}
