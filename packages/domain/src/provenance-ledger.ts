export type ProvenanceRecord = {
  id: string;
  subjectRef: string;
  sourceRef: string;
  sourceSystem: string;
  operation: 'INGEST' | 'DERIVE' | 'VALIDATE' | 'PROJECT' | 'EXPORT';
  recordedAt: string;
  evidenceRefs?: string[];
  metadata?: Record<string, unknown>;
};

export class ProvenanceLedger {
  readonly #records: ProvenanceRecord[] = [];

  has(id: string): boolean {
    return this.#records.some((entry) => entry.id === id);
  }

  append(record: ProvenanceRecord): ProvenanceRecord {
    if (!record.id || !record.subjectRef || !record.sourceRef || !record.sourceSystem || !record.recordedAt) {
      throw new Error('PROVENANCE_IDENTITY_REQUIRED');
    }
    if (this.has(record.id)) throw new Error('PROVENANCE_ID_ALREADY_EXISTS');
    this.#records.push(Object.freeze({ ...record }));
    return record;
  }

  forSubject(subjectRef: string): ProvenanceRecord[] {
    return this.#records.filter((record) => record.subjectRef === subjectRef);
  }

  all(): ProvenanceRecord[] {
    return [...this.#records];
  }
}
