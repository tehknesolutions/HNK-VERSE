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

export type Path = {
  id: string;
  start: string;
  nodes: string[];
  edges: string[];
  end: string;
  directed: boolean;
  provenance: Provenance;
};

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
