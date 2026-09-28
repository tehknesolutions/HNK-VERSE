import type { HnkAddress } from './platform-kernel.ts';
import { updatePresence, type PlatformPresence } from './identity-presence.ts';

export type PresenceRegistry = { presences: ReadonlyMap<string, PlatformPresence> };
export function createPresenceRegistry(): PresenceRegistry { return { presences: new Map() }; }

export function connectPresence(registry: PresenceRegistry, presence: PlatformPresence): PresenceRegistry {
  if (registry.presences.has(presence.id)) throw new Error(`Presence already registered: ${presence.id}`);
  const presences = new Map(registry.presences);
  presences.set(presence.id, structuredClone(presence));
  return { presences };
}
export function getIdentityPresences(registry: PresenceRegistry, identityId: string): readonly PlatformPresence[] {
  return [...registry.presences.values()].filter(p => p.identityId === identityId).map(p => structuredClone(p));
}
export function disconnectSession(registry: PresenceRegistry, sessionId: string): PresenceRegistry {
  const presences = new Map(registry.presences);
  for (const [id, p] of presences) if (p.sessionId === sessionId) presences.set(id, updatePresence(p, { state:'OFFLINE', visibility:{...p.visibility, online:false} }));
  return { presences };
}
export function reconnectPresence(registry: PresenceRegistry, presenceId: string, address: HnkAddress): PresenceRegistry {
  const current = registry.presences.get(presenceId);
  if (!current) throw new Error(`Presence not found: ${presenceId}`);
  const presences = new Map(registry.presences);
  presences.set(presenceId, updatePresence(current, { state:'ACTIVE', address, visibility:{...current.visibility, online:true} }));
  return { presences };
}
