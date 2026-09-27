import {
  HNK_SYSTEM,
  assertTechnologyPlacement,
  canTechnologyRefActAsCanon,
  type HnkKnowledgeObject,
} from '@hnk-verse/contracts';
import {
  CodexResolver,
  KnowledgeRegistry,
  ProvenanceLedger,
  exportEvidenceToTechnologyLedger,
  runtimeEvidenceObject,
} from '@hnk-verse/domain';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

assert(assertTechnologyPlacement(HNK_SYSTEM.technologyPlacement), 'technology hierarchy must be exact');
assert(!canTechnologyRefActAsCanon({
  source: 'codex-hnk',
  vertent: 'TECNOLOGIA',
  canonicalId: null,
  resolution: 'pending',
  provenance: { sourceSystem: 'TEHKNE-OS', sourceOrganization: 'TEHKNE_SOLUTIONS', codexVertent: 'TECNOLOGIA', sourceRef: 'tkn:test' },
  promotion: 'EVIDENCE',
}), 'pending technology evidence must not act as canon');

const registry = new KnowledgeRegistry();
const source: HnkKnowledgeObject = {
  id: 'TKN-TECH-001',
  type: 'TECHNOLOGY_SOURCE',
  title: 'Technology source fixture',
  lifecycle: 'RAW',
  authorityScope: 'TEHKNE-OS',
  authorityLevel: 'EVIDENCE_SOURCE',
  evidenceState: 'UNVERIFIED',
  sources: ['tehkne-os:test'],
  relations: [{ type: 'PRODUCES_EVIDENCE_FOR', target: 'CODEX-HNK/TECNOLOGIA' }],
};
registry.ingest(source);
assert(registry.require(source.id).title === source.title, 'registry ingest failed');

let duplicateBlocked = false;
try { registry.ingest(source); } catch { duplicateBlocked = true; }
assert(duplicateBlocked, 'duplicate knowledge identity must be blocked');

const resolver = new CodexResolver();
const pending = {
  source: 'codex-hnk' as const,
  resolution: 'pending' as const,
  canonicalId: null,
  internalRef: 'TECH-REF-001',
  bridgeStatus: 'PENDING_CANONICAL_ID' as const,
  sourceRefs: ['tehkne-os:test'],
  authority: 'SOURCE_SUPPORTED_DERIVATION' as const,
  status: 'candidate' as const,
};
assert(resolver.resolve(pending).resolution === 'pending', 'unknown CODEX ref must stay pending');
resolver.register({ internalRef: 'TECH-REF-001', canonicalId: 'CODEX-TECH-001', version: '1.0.0', status: 'approved' });
assert(resolver.resolve(pending).resolution === 'resolved', 'registered CODEX ref must resolve');

const evidence = runtimeEvidenceObject({
  id: 'VERSE-EVIDENCE-001',
  title: 'Runtime observation fixture',
  sourceRef: 'hnk-verse:zero',
  evidenceRefs: ['event:test'],
  payload: { pass: true },
  observedAt: '2026-09-27T00:00:00Z',
});
registry.ingest(evidence);
const ledger = new ProvenanceLedger();
exportEvidenceToTechnologyLedger(evidence, ledger, '2026-09-27T00:01:00Z');
assert(ledger.forSubject(evidence.id).length === 1, 'evidence export provenance missing');

console.log('knowledge-architecture-check: PASS');
