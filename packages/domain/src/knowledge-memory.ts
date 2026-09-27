import type { HnkKnowledgeObject } from '@hnk-verse/contracts';
import type { ProvenanceLedger } from './provenance-ledger.ts';

export type KnowledgeMemoryState = 'EXPOSED' | 'LEARNED' | 'RETAINED' | 'DERIVED' | 'FORGOTTEN';

export type KnowledgeMemoryRecord = {
  memoryId: string;
  consumerKind: 'AGENT' | 'WORLD' | 'SYSTEM';
  consumerId: string;
  knowledgeId: string;
  state: KnowledgeMemoryState;
  learnedAt?: string;
  updatedAt: string;
  sourceMemoryIds?: string[];
};

export class KnowledgeMemory {
  readonly #records = new Map<string, KnowledgeMemoryRecord>();

  remember(record: KnowledgeMemoryRecord): KnowledgeMemoryRecord {
    if (!record.memoryId || !record.consumerId || !record.knowledgeId || !record.updatedAt) throw new Error('KNOWLEDGE_MEMORY_IDENTITY_REQUIRED');
    const current = this.#records.get(record.memoryId);
    if (current?.state === 'FORGOTTEN' && record.state !== 'FORGOTTEN') throw new Error('FORGOTTEN_MEMORY_REACTIVATION_REQUIRES_NEW_ID');
    this.#records.set(record.memoryId, Object.freeze({ ...record }));
    return record;
  }

  get(memoryId: string): KnowledgeMemoryRecord | undefined { return this.#records.get(memoryId); }
  forConsumer(kind: KnowledgeMemoryRecord['consumerKind'], id: string): KnowledgeMemoryRecord[] {
    return [...this.#records.values()].filter((record) => record.consumerKind === kind && record.consumerId === id);
  }
  retainedKnowledgeIds(kind: KnowledgeMemoryRecord['consumerKind'], id: string): string[] {
    return this.forConsumer(kind, id).filter((record) => record.state === 'LEARNED' || record.state === 'RETAINED' || record.state === 'DERIVED').map((record) => record.knowledgeId);
  }
}

export function deriveKnowledgeEvidence(
  source: HnkKnowledgeObject,
  memory: KnowledgeMemoryRecord,
  derived: HnkKnowledgeObject,
  ledger: ProvenanceLedger,
): HnkKnowledgeObject {
  if (memory.state !== 'DERIVED') throw new Error('DERIVED_MEMORY_REQUIRED');
  if (derived.lifecycle === 'CANON') throw new Error('MEMORY_DERIVATION_CANNOT_CREATE_CANON');
  if (derived.authorityLevel === 'ROOT_CANON' || derived.authorityLevel === 'DOMAIN_CANON') throw new Error('MEMORY_DERIVATION_CANNOT_CREATE_CANON_AUTHORITY');
  ledger.append({
    id: `derive:${memory.memoryId}:${derived.id}`,
    subjectRef: derived.id,
    sourceRef: source.id,
    sourceSystem: 'HNK-VERSE',
    operation: 'DERIVE',
    recordedAt: memory.updatedAt,
    evidenceRefs: derived.evidence,
    metadata: { memoryId: memory.memoryId, consumerKind: memory.consumerKind, consumerId: memory.consumerId },
  });
  return derived;
}
