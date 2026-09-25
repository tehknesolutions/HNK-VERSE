import { describe, expect, it } from 'vitest';
import {
  TECNOMAGE_PRIME_V28,
  createReferenceAvatarDescriptor,
  resolveReferenceAvatarAsset,
} from './reference-avatar.ts';

describe('reference avatar contract', () => {
  it('keeps Tecnomage Prime namespaced to Strangeverse', () => {
    expect(TECNOMAGE_PRIME_V28.verseId).toBe('strangeverse');
    expect(TECNOMAGE_PRIME_V28.campaignId).toBe('alakazam-and-the-strangeverse');
  });

  it('prefers the quantized runtime asset and preserves an explicit fallback', () => {
    expect(resolveReferenceAvatarAsset(TECNOMAGE_PRIME_V28)).toEqual({
      primary: '/assets/characters/tecnomage-prime-v2.8-runtime-q.glb',
      fallback: '/assets/characters/tecnomage-prime-v2.8-runtime-optimized.glb',
    });
  });

  it('does not identify the player as Alakazam', () => {
    const descriptor = createReferenceAvatarDescriptor(TECNOMAGE_PRIME_V28);
    expect(descriptor.role).toBe('reference-avatar');
    expect(descriptor.playerIdentity).toBe('independent');
    expect(descriptor.characterId).toBe('tecnomage-prime');
  });
});
