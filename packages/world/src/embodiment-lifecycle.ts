import type { HnkAddress } from './platform-kernel.ts';
import { updatePresence, type PlatformPresence, type PresenceState } from './identity-presence.ts';

export type ContextualEmbodiment = {
  id: string;
  identityId: string;
  avatarId: string;
  presenceId: string;
  address: HnkAddress;
  state: Record<string, unknown>;
};

export type PresenceTransitionFact = {
  type: 'PRESENCE_TRANSITIONED';
  identityId: string;
  sessionId: string;
  presenceId: string;
  from: HnkAddress;
  to: HnkAddress;
  fromState: PresenceState;
  toState: PresenceState;
};

export function createEmbodiment(input: ContextualEmbodiment): ContextualEmbodiment {
  return structuredClone(input);
}

export function transitionEmbodiment(source: ContextualEmbodiment, target: Pick<ContextualEmbodiment, 'id' | 'presenceId' | 'address' | 'state'>): ContextualEmbodiment {
  return structuredClone({ ...target, identityId: source.identityId, avatarId: source.avatarId });
}

export function transitionPresence(source: PlatformPresence, patch: { state: PresenceState; address: HnkAddress }): { presence: PlatformPresence; fact: PresenceTransitionFact } {
  const presence = updatePresence(source, patch);
  return {
    presence,
    fact: {
      type: 'PRESENCE_TRANSITIONED',
      identityId: source.identityId,
      sessionId: source.sessionId,
      presenceId: source.id,
      from: structuredClone(source.address),
      to: structuredClone(presence.address),
      fromState: source.state,
      toState: presence.state,
    },
  };
}
