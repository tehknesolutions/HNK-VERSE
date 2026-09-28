import {
  CAPABILITY_SUPPORT_STATES,
  INTEROP_OUTCOMES,
  SDK_ERROR_CODES,
  TRANSITION_STATES,
  VERSE_LIFECYCLE_STATES,
} from '@hnk-verse/contracts';

const expectedInterop = ['REJECT','REFERENCE','PROJECT','TRANSLATE','TRANSFER','CLONE'];
const expectedErrors = [
  'UNSUPPORTED_CAPABILITY','INCOMPATIBLE_VERSION','PERMISSION_DENIED',
  'INVALID_CONTEXT','IDENTITY_RESOLUTION_FAILED','ENTITY_NOT_FOUND',
  'INVALID_ADDRESS','TRANSITION_REJECTED','TRANSFER_REJECTED',
  'TRANSLATION_FAILED','PROJECTION_FAILED','VERSE_UNAVAILABLE',
  'VALIDATION_FAILED','CONFLICT','TIMEOUT','INTERNAL_VERSE_ERROR',
  'PLATFORM_BOUNDARY_ERROR',
];

const assert = (condition: unknown, message: string): asserts condition => {
  if (!condition) throw new Error(`VERSE_SDK_CONTRACT_CHECK_FAILED: ${message}`);
};

const includesAll = (actual: readonly string[], expected: readonly string[]) =>
  expected.every((value) => actual.includes(value));

assert(includesAll(INTEROP_OUTCOMES, expectedInterop), 'all six interop outcomes must be public');
assert(includesAll(SDK_ERROR_CODES, expectedErrors), 'required SDK error codes must be public');
assert(includesAll(CAPABILITY_SUPPORT_STATES, ['SUPPORTED','UNSUPPORTED','CONDITIONAL','EXPERIMENTAL','DEPRECATED']), 'capability support states incomplete');
assert(includesAll(TRANSITION_STATES, ['REQUESTED','RESOLVING','NEGOTIATING','PREPARING','EXITING_SOURCE','ENTERING_TARGET','COMPLETED','FAILED']), 'transition states incomplete');
assert(includesAll(VERSE_LIFECYCLE_STATES, ['UNINITIALIZED','INITIALIZING','READY','ENTERING','ACTIVE','SUSPENDED','EXITING','DISPOSED']), 'lifecycle states incomplete');

const hubContext = {
  identityId: 'HNKID-ZERO-001',
  sessionId: 'SESSION-ZERO-001',
  presenceId: 'PRESENCE-HUB-001',
  verseId: 'VERSE-ZERO-HUB-001',
  worldId: 'WORLD-ZERO-MALKUTH-001',
  roles: ['player'],
  permissions: ['presence.read'],
  correlationId: 'CORR-ZERO-001',
  contracts: [{ name: 'verse-sdk', version: '0.1' }],
};

const aManifest = {
  manifestVersion: 1,
  verseId: 'VERSE-ZERO-A-001',
  verseContractVersion: '1.0',
  platformCompatibility: [{ name: 'verse-sdk', version: '0.1' }],
  schemaVersion: 1,
  authorityRef: 'authority:zero-a',
  publishedAt: '2026-09-27T00:00:00Z',
  capabilities: [{
    capabilityId: 'embodiment.verse-native',
    state: 'SUPPORTED' as const,
    version: '1.0',
    requiredPermissions: ['verse.enter'],
  }],
};

const bManifest = {
  ...aManifest,
  verseId: 'VERSE-ZERO-B-001',
  capabilities: [{
    capabilityId: 'interop.cosmetic-projection',
    state: 'SUPPORTED' as const,
    version: '1.0',
  }],
};

assert(hubContext.identityId && aManifest.verseId && bManifest.verseId, 'Hub/A/B fixtures must have stable refs');

console.log('VERSE_SDK_CONTRACT_CHECK_PASS');
