import type { HnkKnowledgeObject } from '@hnk-verse/contracts';
import { KnowledgeRegistry } from './knowledge-registry.ts';
import { ProvenanceLedger } from './provenance-ledger.ts';

export type CodexSyncEnvelope = {
  syncId: string;
  source: 'CODEX-HNK';
  sourceVersion: string;
  generatedAt: string;
  objects: HnkKnowledgeObject[];
};

export type CodexSyncResult = {
  syncId: string;
  accepted: string[];
  skipped: string[];
};

export function applyCodexSync(
  envelope: CodexSyncEnvelope,
  registry: KnowledgeRegistry,
  ledger: ProvenanceLedger,
): CodexSyncResult {
  if (!envelope.syncId || !envelope.sourceVersion || !envelope.generatedAt) throw new Error('CODEX_SYNC_IDENTITY_REQUIRED');
  const accepted: string[] = [];
  const skipped: string[] = [];

  for (const object of envelope.objects) {
    if (object.authorityLevel !== 'ROOT_CANON' && object.authorityLevel !== 'DOMAIN_CANON') {
      throw new Error('CODEX_SYNC_AUTHORITY_INVALID');
    }
    if (object.lifecycle !== 'CANON' && object.lifecycle !== 'APPROVED') {
      throw new Error('CODEX_SYNC_LIFECYCLE_INVALID');
    }
    const current = registry.get(object.id);
    if (current && JSON.stringify(current) === JSON.stringify(object)) {
      skipped.push(object.id);
      continue;
    }
    if (current) registry.replace(object);
    else registry.ingest(object);
    accepted.push(object.id);
    ledger.append({
      id: `sync:${envelope.syncId}:${object.id}`,
      subjectRef: object.id,
      sourceRef: `CODEX-HNK@${envelope.sourceVersion}`,
      sourceSystem: 'CODEX-HNK',
      operation: 'INGEST',
      recordedAt: envelope.generatedAt,
      metadata: { syncId: envelope.syncId },
    });
  }

  return { syncId: envelope.syncId, accepted, skipped };
}
