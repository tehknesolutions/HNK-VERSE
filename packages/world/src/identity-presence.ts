export type IdentityStatus = 'ACTIVE' | 'SUSPENDED' | 'ARCHIVED';

export interface PlatformIdentity {
  readonly id: string;
  readonly status: IdentityStatus;
}

export interface PlatformAvatar {
  readonly id: string;
  readonly ownerIdentityId: string;
}

export interface PlatformSession {
  readonly id: string;
  readonly identityId: string;
  readonly grantedCapabilities: readonly string[];
}

export type PresenceState =
  | 'OFFLINE' | 'ONLINE' | 'IDLE' | 'ACTIVE' | 'BUSY'
  | 'SPECTATING' | 'CREATING' | 'PLAYING' | 'IN_TRANSITION' | 'HIDDEN';

export interface PresenceAddress {
  readonly verseId: string;
  readonly spaceId?: string;
}

export interface PresenceVisibility {
  readonly online: boolean;
  readonly verse: boolean;
  readonly preciseLocation: boolean;
}

export interface PlatformPresence {
  readonly id: string;
  readonly identityId: string;
  readonly sessionId: string;
  readonly state: PresenceState;
  readonly address: PresenceAddress;
  readonly visibility: PresenceVisibility;
}

export function createIdentity(id: string): PlatformIdentity {
  return Object.freeze({ id, status: 'ACTIVE' });
}

export function createAvatar(id: string, ownerIdentityId: string): PlatformAvatar {
  return Object.freeze({ id, ownerIdentityId });
}

export function createSession(
  id: string,
  identityId: string,
  grantedCapabilities: readonly string[] = [],
): PlatformSession {
  return Object.freeze({ id, identityId, grantedCapabilities: Object.freeze([...grantedCapabilities]) });
}

export function createPresence(input: PlatformPresence): PlatformPresence {
  return Object.freeze({
    ...input,
    address: Object.freeze({ ...input.address }),
    visibility: Object.freeze({ ...input.visibility }),
  });
}

export function updatePresence(
  source: PlatformPresence,
  patch: Partial<Pick<PlatformPresence, 'state' | 'address' | 'visibility'>>,
): PlatformPresence {
  return createPresence({
    ...source,
    ...patch,
    identityId: source.identityId,
    sessionId: source.sessionId,
  });
}
