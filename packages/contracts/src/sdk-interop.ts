export const INTEROP_OUTCOMES = [
  'REJECT',
  'REFERENCE',
  'PROJECT',
  'TRANSLATE',
  'TRANSFER',
  'CLONE',
] as const;
export type InteropOutcomeKind = (typeof INTEROP_OUTCOMES)[number];

export type InteropProvenance = {
  sourceRef: string;
  sourceAuthority: string;
  targetContextRef: string;
  contractVersion: string;
  mapperRef?: string;
};

export type InteropOutcome =
  | { kind: 'REJECT'; reason: string; provenance?: InteropProvenance }
  | { kind: 'REFERENCE'; sourceRef: string; provenance: InteropProvenance }
  | { kind: 'PROJECT'; sourceRef: string; projectionRef: string; provenance: InteropProvenance }
  | { kind: 'TRANSLATE'; sourceRef: string; resultRef: string; mapperRef: string; provenance: InteropProvenance }
  | { kind: 'TRANSFER'; sourceRef: string; resultRef: string; provenance: InteropProvenance }
  | { kind: 'CLONE'; sourceRef: string; resultRef: string; provenance: InteropProvenance };