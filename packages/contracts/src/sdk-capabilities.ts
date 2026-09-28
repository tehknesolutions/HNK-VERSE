import type { ContractVersion } from './sdk-context.ts';

export const CAPABILITY_SUPPORT_STATES = [
  'SUPPORTED',
  'UNSUPPORTED',
  'CONDITIONAL',
  'EXPERIMENTAL',
  'DEPRECATED',
] as const;
export type CapabilitySupportState = (typeof CAPABILITY_SUPPORT_STATES)[number];

export type CapabilityDeclaration = {
  capabilityId: string;
  state: CapabilitySupportState;
  version: string;
  modes?: readonly string[];
  requiredPermissions?: readonly string[];
  metadata?: Readonly<Record<string, unknown>>;
};

export type VerseCapabilityManifest = {
  manifestVersion: number;
  verseId: string;
  verseContractVersion: string;
  platformCompatibility: readonly ContractVersion[];
  schemaVersion: number;
  authorityRef: string;
  publishedAt: string;
  capabilities: readonly CapabilityDeclaration[];
};

export type CapabilityNegotiationRequest = {
  verseId: string;
  requiredContracts?: readonly ContractVersion[];
  requestedCapabilities: readonly string[];
  grantedPermissions: readonly string[];
  correlationId: string;
};

export type CapabilityNegotiationResult =
  | { accepted: true; verseId: string; acceptedCapabilities: readonly string[]; correlationId: string }
  | { accepted: false; verseId: string; code: 'UNSUPPORTED_CAPABILITY' | 'INCOMPATIBLE_VERSION' | 'PERMISSION_DENIED' | 'VALIDATION_FAILED'; rejectedCapabilities: readonly string[]; correlationId: string };