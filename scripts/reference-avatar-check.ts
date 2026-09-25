import {
  TECNOMAGE_PRIME_V28,
  createReferenceAvatarDescriptor,
  resolveReferenceAvatarAsset,
} from '@hnk-verse/renderer';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function equal<T>(actual: T, expected: T, message: string): void {
  if (!Object.is(actual, expected)) {
    throw new Error(`${message}: expected ${String(expected)}, got ${String(actual)}`);
  }
}

const descriptor = createReferenceAvatarDescriptor(TECNOMAGE_PRIME_V28);
const asset = resolveReferenceAvatarAsset(TECNOMAGE_PRIME_V28);

equal(descriptor.characterId, 'tecnomage-prime', 'Wrong reference avatar character');
equal(descriptor.verseId, 'strangeverse', 'Reference avatar escaped Strangeverse namespace');
equal(
  descriptor.campaignId,
  'alakazam-and-the-strangeverse',
  'Wrong campaign binding',
);
equal(descriptor.role, 'reference-avatar', 'Wrong avatar role');
equal(
  descriptor.playerIdentity,
  'independent',
  'Reference avatar must not become player identity',
);
equal(
  asset.primary,
  '/assets/characters/tecnomage-prime-v2.8-runtime-q.glb',
  'Wrong primary runtime asset',
);
equal(
  asset.fallback,
  '/assets/characters/tecnomage-prime-v2.8-runtime-optimized.glb',
  'Wrong fallback runtime asset',
);
assert(
  descriptor.visualEvolution === 'ANATOMY27 → HERO39',
  'Visual evolution line changed unexpectedly',
);

console.log('REFERENCE_AVATAR_GATE_PASS');
