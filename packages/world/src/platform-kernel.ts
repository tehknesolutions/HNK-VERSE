export type HnkAddress = {
  verseId: string;
  spaceId?: string;
};

export type PlatformIdentity = {
  id: string;
  address: HnkAddress;
};

export type PlatformState = {
  authority: 'HNK_VERSE_PLATFORM';
  identityId: string;
};

export type VerseState = {
  authority: 'VERSE';
  verseId: string;
  identityId: string;
  data: Record<string, unknown>;
};

export type CapabilityManifest = {
  version: string;
  capabilities: readonly string[];
};

export type TransitionOutcome =
  | 'REJECT'
  | 'REFERENCE'
  | 'PROJECT'
  | 'TRANSLATE'
  | 'TRANSFER'
  | 'CLONE';

export type TransitionRequest = {
  identityId: string;
  source: HnkAddress;
  target: HnkAddress;
  targetManifest: CapabilityManifest;
  requestedState?: readonly {
    key: string;
    scope: 'PLATFORM' | 'VERSE' | 'EXPERIENCE' | 'PROJECTION';
    requiredCapability?: string;
  }[];
};

export type TransitionResult = {
  identityId: string;
  address: HnkAddress;
  outcomes: Array<{ key: string; outcome: TransitionOutcome; reason: string }>;
  trace: {
    identityId: string;
    sourceVerseId: string;
    targetVerseId: string;
    manifestVersion: string;
  };
};

export function createPlatformIdentity(
  id: string,
  address: HnkAddress,
): PlatformIdentity {
  return { id, address: { ...address } };
}

export function moveIdentity(
  identity: PlatformIdentity,
  address: HnkAddress,
): PlatformIdentity {
  return { ...identity, address: { ...address } };
}

export function capabilitySupported(
  manifest: CapabilityManifest,
  capability: string,
): boolean {
  return manifest.capabilities.includes(capability);
}

export function createTransition(request: TransitionRequest): TransitionResult {
  const outcomes = (request.requestedState ?? []).map((state) => {
    if (state.scope === 'PLATFORM') {
      return {
        key: state.key,
        outcome: 'REFERENCE' as const,
        reason: 'Platform state remains platform-authoritative across Verse boundaries.',
      };
    }

    if (
      state.requiredCapability &&
      capabilitySupported(request.targetManifest, state.requiredCapability)
    ) {
      return {
        key: state.key,
        outcome: 'PROJECT' as const,
        reason: `Target explicitly supports ${state.requiredCapability}.`,
      };
    }

    return {
      key: state.key,
      outcome: 'REJECT' as const,
      reason: 'Cross-context state requires an explicit capability/transfer contract.',
    };
  });

  return {
    identityId: request.identityId,
    address: { ...request.target },
    outcomes,
    trace: {
      identityId: request.identityId,
      sourceVerseId: request.source.verseId,
      targetVerseId: request.target.verseId,
      manifestVersion: request.targetManifest.version,
    },
  };
}
