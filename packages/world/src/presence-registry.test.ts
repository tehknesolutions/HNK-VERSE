import assert from 'node:assert/strict';
import test from 'node:test';

import { createPresence } from './identity-presence.ts';
import {
  connectPresence,
  createPresenceRegistry,
  disconnectSession,
  getIdentityPresences,
  reconnectPresence,
} from './presence-registry.ts';

test('one identity can hold multiple presences through distinct sessions', () => {
  let registry = createPresenceRegistry();
  registry = connectPresence(registry, createPresence({ id: 'presence:desktop', identityId: 'identity:tw', sessionId: 'session:desktop', state: 'ACTIVE', address: { verseId: 'VERSE-ZERO-001' }, visibility: { online: true, verse: true, preciseLocation: false } }));
  registry = connectPresence(registry, createPresence({ id: 'presence:mobile', identityId: 'identity:tw', sessionId: 'session:mobile', state: 'IDLE', address: { verseId: 'verse:alakazam' }, visibility: { online: true, verse: true, preciseLocation: false } }));
  assert.equal(getIdentityPresences(registry, 'identity:tw').length, 2);
});

test('disconnecting a session only disconnects presences owned by that session', () => {
  let registry = createPresenceRegistry();
  registry = connectPresence(registry, createPresence({ id: 'presence:desktop', identityId: 'identity:tw', sessionId: 'session:desktop', state: 'ACTIVE', address: { verseId: 'VERSE-ZERO-001' }, visibility: { online: true, verse: true, preciseLocation: false } }));
  registry = connectPresence(registry, createPresence({ id: 'presence:mobile', identityId: 'identity:tw', sessionId: 'session:mobile', state: 'ACTIVE', address: { verseId: 'verse:alakazam' }, visibility: { online: true, verse: true, preciseLocation: false } }));
  registry = disconnectSession(registry, 'session:desktop');
  assert.equal(registry.presences.get('presence:desktop')?.state, 'DISCONNECTED');
  assert.equal(registry.presences.get('presence:mobile')?.state, 'ACTIVE');
});

test('reconnect preserves identity/session ownership and can move context explicitly', () => {
  let registry = createPresenceRegistry();
  registry = connectPresence(registry, createPresence({ id: 'presence:desktop', identityId: 'identity:tw', sessionId: 'session:desktop', state: 'DISCONNECTED', address: { verseId: 'VERSE-ZERO-001' }, visibility: { online: false, verse: false, preciseLocation: false } }));
  registry = reconnectPresence(registry, 'presence:desktop', { verseId: 'verse:alakazam', spaceId: 'space:entry' });
  const presence = registry.presences.get('presence:desktop');
  assert.equal(presence?.identityId, 'identity:tw');
  assert.equal(presence?.sessionId, 'session:desktop');
  assert.equal(presence?.state, 'ACTIVE');
  assert.equal(presence?.address.verseId, 'verse:alakazam');
});
