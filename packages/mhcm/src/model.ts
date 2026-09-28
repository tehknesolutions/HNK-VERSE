export const MHCM_SCHEMA_VERSION = 1 as const;

export type Provenance = {
  source: string;
  generator?: string;
  schemaVersion: number;
  authorityStatus: 'RAW' | 'OBSERVED' | 'EXPERIMENTAL' | 'REVIEWED' | 'APPROVED' | 'CANON' | 'REJECTED' | 'SUPERSEDED' | 'DEPRECATED' | 'ARCHIVED';
  sourceRefs: string[];
};

export type Address = {
  namespace: string;
  coordinate: string;
  version: string;
};

export type Cell = {
  id: string;
  address: Address;
  layer?: string;
  sector?: string;
  classification?: string;
  provenance: Provenance;
};

export type EdgeRelation = string;

export type Edge = {
  id: string;
  source: string;
  target: string;
  relation: EdgeRelation;
  directed: boolean;
  provenance: Provenance;
};

export type PathValue = {
  id: string;
  start: string;
  nodes: string[];
  edges: string[];
  end: string;
  directed: boolean;
  provenance: Provenance;
};

export type Path = PathValue;

export type SemanticValue = PathValue;

export class SemanticRegistry<T extends { id: string }> {
  private readonly values = new Map<string, T>();

  constructor(values: Iterable<T> = []) {
    for (const value of values) this.register(value);
  }

  register(value: T): void {
    if (this.values.has(value.id)) throw new Error(`Duplicate semantic value: ${value.id}`);
    this.values.set(value.id, value);
  }

  has(id: string): boolean {
    return this.values.has(id);
  }

  get(id: string): T | undefined {
    return this.values.get(id);
  }

  valuesList(): T[] {
    return [...this.values.values()];
  }
}

export function createProvenance(
  source: string,
  sourceRefs: string[],
  authorityStatus: Provenance['authorityStatus'] = 'EXPERIMENTAL',
  generator?: string,
): Provenance {
  return {
    source,
    ...(generator ? { generator } : {}),
    schemaVersion: MHCM_SCHEMA_VERSION,
    authorityStatus,
    sourceRefs: [...sourceRefs],
  };
}
