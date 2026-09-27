import type { HnkKnowledgeObject } from '@hnk-verse/contracts';
import { KnowledgeRegistry } from './knowledge-registry.ts';
import { ProvenanceLedger, type ProvenanceRecord } from './provenance-ledger.ts';

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

type StagedMutation = {
  object: HnkKnowledgeObject;
  provenance: ProvenanceRecord;
};

export function applyCodexSync(
  envelope: CodexSyncEnvelope,
  registry: KnowledgeRegistry,
  ledger: ProvenanceLedger,
): CodexSyncResult {
  if (!envelope || typeof envelope !== 'object') throw new Error('CODEX_SYNC_ENVELOPE_REQUIRED');
  if (envelope.source !== 'CODEX-HNK') throw new Error('CODEX_SYNC_SOURCE_INVALID');
  if (!envelope.syncId || !envelope.sourceVersion || !envelope.generatedAt || !Array.isArray(envelope.objects)) {
    throw new Error('CODEX_SYNC_IDENTITY_REQUIRED');
  }

  const accepted: string[] = [];
  const skipped: string[] = [];
  const staged: StagedMutation[] = [];
  const seenIds = new Set<string>();

  for (const object of envelope.objects) {
    if (!object || typeof object !== 'object' || !object.id) throw new Error('CODEX_SYNC_OBJECT_INVALID');
    if (seenIds.has(object.id)) throw new Error('CODEX_SYNC_DUPLICATE_OBJECT');
    seenIds.add(object.id);

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

    const provenance: ProvenanceRecord = {
      id: `sync:${envelope.syncId}:${object.id}`,
      subjectRef: object.id,
      sourceRef: `CODEX-HNK@${envelope.sourceVersion}`,
      sourceSystem: 'CODEX-HNK',
      operation: 'INGEST',
      recordedAt: envelope.generatedAt,
      metadata: { syncId: envelope.syncId },
    };

    if (ledger.has(provenance.id)) throw new Error('CODEX_SYNC_PROVENANCE_CONFLICT');
    staged.push({ object, provenance });
  }

  // Commit only after the complete envelope has passed validation.
  // Provenance is reserved first so a provenance conflict can never leave
  // authoritative registry state without lineage.
  for (const mutation of staged) ledger.append(mutation.provenance);
  for (const mutation of staged) {
    if (registry.get(mutation.object.id)) registry.replace(mutation.object);
    else registry.ingest(mutation.object);
    accepted.push(mutation.object.id);
  }

  return { syncId: envelope.syncId, accepted, skipped };
}
