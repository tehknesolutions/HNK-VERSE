import type { HnkAddress } from './platform-kernel.ts';
import { updatePresence, type PlatformPresence } from './identity-presence.ts';

export type PresenceRegistry = { presences: ReadonlyMap<string, PlatformPresence> };

export function createPresenceRegistry(): PresenceRegistry { return { presences: new Map() }; }

export function connectPresence(registry: PresenceRegistry, presence: PlatformPresence): PresenceRegistry {
  const presences = new Map(registry.presences);
  presences.set(presence.id, structuredClone(presence));
  return { presences };
}

export function getIdentityPresences(registry: PresenceRegistry, identityId: string): readonly PlatformPresence[] {
  return [...registry.presences.values()].filter((presence) => presence.identityId === identityId).map((presence) => structuredClone(presence));
}

export function disconnectSession(registry: PresenceRegistry, sessionId: string): PresenceRegistry {
  const presences = new Map(registry.presences);
  for (const [id, presence] of presences) if (presence.sessionId === sessionId) presences.set(id, updatePresence(presence, { state: 'OFFLINE', visibility: { ...presence.visibility, online: false } }));
  return { presences };
}

export function reconnectPresence(registry: PresenceRegistry, presenceId: string, address: HnkAddress): PresenceRegistry {
  const current = registry.presences.get(presenceId);
  if (!current) throw new Error(`Presence not found: ${presenceId}`);
  const presences = new Map(registry.presences);
  presences.set(presenceId, updatePresence(current, { state: 'ACTIVE', address, visibility: { ...current.visibility, online: true } }));
  return { presences };
}
