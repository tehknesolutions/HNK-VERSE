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

export type SemanticNamespace = 'path' | 'cell' | 'edge' | 'generic';

export type SemanticRef = {
  namespace: SemanticNamespace;
  id: string;
};

export type SemanticRegistryKey = `${SemanticNamespace}:${string}`;

export function createSemanticRef(namespace: SemanticNamespace, id: string): SemanticRef {
  return { namespace, id };
}

export function semanticRefKey(ref: SemanticRef): SemanticRegistryKey {
  return `${ref.namespace}:${ref.id}`;
}

export class SemanticRegistry<T extends { id: string }> {
  private readonly values = new Map<SemanticRegistryKey, T>();

  private key(namespace: SemanticNamespace, id: string): SemanticRegistryKey {
    return semanticRefKey(createSemanticRef(namespace, id));
  }

  constructor(values: Iterable<T> = []) {
    for (const value of values) this.register(value);
  }

  register(value: T, namespace: SemanticNamespace = 'generic'): void {
    const key = this.key(namespace, value.id);
    if (this.values.has(key)) throw new Error(`Duplicate semantic value: ${key}`);
    this.values.set(key, value);
  }

  has(id: string, namespace: SemanticNamespace = 'generic'): boolean {
    return this.values.has(this.key(namespace, id));
  }

  get(id: string, namespace: SemanticNamespace = 'generic'): T | undefined {
    return this.values.get(this.key(namespace, id));
  }

  valuesList(namespace?: SemanticNamespace): T[] {
    if (!namespace) return [...this.values.values()];
    const prefix = `${namespace}:`;
    return [...this.values.entries()].filter(([key]) => key.startsWith(prefix)).map(([, value]) => value);
  }
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
