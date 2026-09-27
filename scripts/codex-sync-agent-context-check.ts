import type { HnkKnowledgeObject } from '@hnk-verse/contracts';
import {
  KnowledgeRegistry,
  ProvenanceLedger,
  applyCodexSync,
  buildAgentKnowledgeContext,
} from '@hnk-verse/domain';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const registry = new KnowledgeRegistry();
const ledger = new ProvenanceLedger();

const root: HnkKnowledgeObject = {
  id: 'CODEX-HNK-ROOT-001',
  type: 'CODEX_CANON',
  title: 'HNK root fixture',
  lifecycle: 'CANON',
  authorityScope: 'HNK',
  authorityLevel: 'ROOT_CANON',
  evidenceState: 'CERTIFIED',
  sources: ['codex-hnk:test'],
  relations: [{ type: 'ROOT_OF', target: 'HNK-VERSE' }],
  tags: ['HNK'],
};

const domain: HnkKnowledgeObject = {
  id: 'CODEX-HNK-TECH-001',
  type: 'CODEX_TECHNOLOGY_CANON',
  title: 'Technology fixture',
  lifecycle: 'CANON',
  authorityScope: 'CODEX-HNK/TECNOLOGIA',
  authorityLevel: 'DOMAIN_CANON',
  evidenceState: 'VALIDATED',
  sources: ['codex-hnk:technology:test'],
  relations: [{ type: 'DOMAIN_CANON_FOR', target: 'HNK-VERSE' }],
  tags: ['TECNOLOGIA'],
};

const sync = applyCodexSync({
  syncId: 'SYNC-001',
  source: 'CODEX-HNK',
  sourceVersion: '1.0.0-test',
  generatedAt: '2026-09-27T00:00:00Z',
  objects: [domain, root],
}, registry, ledger);

assert(sync.accepted.length === 2, 'CODEX sync should accept canonical fixtures');
assert(ledger.all().length === 2, 'CODEX sync provenance must be recorded');

registry.ingest({
  id: 'REJECTED-001',
  type: 'EXPERIMENT',
  title: 'Rejected fixture',
  lifecycle: 'REJECTED',
  authorityScope: 'HNK-VERSE',
  authorityLevel: 'PROJECTION',
  sources: ['test'],
  relations: [],
  tags: ['TECNOLOGIA'],
});

const context = buildAgentKnowledgeContext(registry, { limit: 10 });
assert(context.objects[0]?.authorityLevel === 'ROOT_CANON', 'agent context must prioritize root canon');
assert(context.objects[1]?.authorityLevel === 'DOMAIN_CANON', 'agent context must prioritize domain canon next');
assert(!context.objects.some((object) => object.lifecycle === 'REJECTED'), 'rejected knowledge must never enter agent context');

console.log('codex-sync-agent-context-check: PASS');
