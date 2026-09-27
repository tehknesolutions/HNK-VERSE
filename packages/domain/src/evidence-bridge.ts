import type { HnkKnowledgeObject } from '@hnk-verse/contracts';
import type { ProvenanceLedger } from './provenance-ledger.ts';

export type RuntimeEvidenceInput<T = unknown> = {
  id: string;
  title: string;
  sourceRef: string;
  evidenceRefs: string[];
  payload: T;
  observedAt: string;
};

export function runtimeEvidenceObject<T>(input: RuntimeEvidenceInput<T>): HnkKnowledgeObject<T> {
  return {
    id: input.id,
    type: 'HNK_VERSE_RUNTIME_EVIDENCE',
    title: input.title,
    lifecycle: 'OBSERVED',
    authorityScope: 'HNK-VERSE',
    authorityLevel: 'EVIDENCE_SOURCE',
    evidenceState: 'OBSERVED',
    sources: [input.sourceRef],
    evidence: input.evidenceRefs,
    relations: [
      { type: 'PRODUCES_EVIDENCE_FOR', target: 'CODEX-HNK/TECNOLOGIA' },
      { type: 'MUST_NOT_PROMOTE_TO_CANON', target: 'HNK' },
    ],
    temporalScope: { observedAt: input.observedAt },
    payload: input.payload,
  };
}

export function exportEvidenceToTechnologyLedger(
  object: HnkKnowledgeObject,
  ledger: ProvenanceLedger,
  recordedAt: string,
): void {
  if (object.authorityLevel !== 'EVIDENCE_SOURCE') throw new Error('ONLY_EVIDENCE_SOURCE_CAN_BE_EXPORTED');
  ledger.append({
    id: `export:${object.id}:${recordedAt}`,
    subjectRef: object.id,
    sourceRef: object.sources[0]!,
    sourceSystem: 'HNK-VERSE',
    operation: 'EXPORT',
    recordedAt,
    evidenceRefs: object.evidence,
    metadata: { target: 'CODEX-HNK/TECNOLOGIA', via: 'TEHKNE-OS-compatible-provenance' },
  });
}
