export type ReferenceAvatarAsset = {
  primary: string;
  fallback?: string;
};

export type ReferenceAvatarDefinition = {
  characterId: string;
  verseId: string;
  campaignId?: string;
  role: 'reference-avatar';
  playerIdentity: 'independent';
  asset: ReferenceAvatarAsset;
  visualEvolution?: string;
};

export const TECNOMAGE_PRIME_V28: ReferenceAvatarDefinition = {
  characterId: 'tecnomage-prime',
  verseId: 'strangeverse',
  campaignId: 'alakazam-and-the-strangeverse',
  role: 'reference-avatar',
  playerIdentity: 'independent',
  asset: {
    primary: '/assets/characters/tecnomage-prime-v2.8-runtime-q.glb',
    fallback: '/assets/characters/tecnomage-prime-v2.8-runtime-optimized.glb',
  },
  visualEvolution: 'ANATOMY27 → HERO39',
};

export function resolveReferenceAvatarAsset(definition: ReferenceAvatarDefinition): ReferenceAvatarAsset {
  return { ...definition.asset };
}

export function createReferenceAvatarDescriptor(definition: ReferenceAvatarDefinition) {
  return {
    characterId: definition.characterId,
    verseId: definition.verseId,
    campaignId: definition.campaignId,
    role: definition.role,
    playerIdentity: definition.playerIdentity,
    visualEvolution: definition.visualEvolution,
  } as const;
}
