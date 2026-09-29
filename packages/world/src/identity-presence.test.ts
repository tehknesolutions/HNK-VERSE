import assert from 'node:assert/strict';
import test from 'node:test';

import {
  createAvatar,
  createIdentity,
  createPresence,
  createSession,
  updatePresence,
} from './identity-presence.ts';

test('identity remains stable when avatar changes', () => {
  const identity = createIdentity('identity:tw');
  const first = createAvatar('avatar:one', identity.id);
  const second = createAvatar('avatar:two', identity.id);

  assert.equal(first.ownerIdentityId, identity.id);
  assert.equal(second.ownerIdentityId, identity.id);
  assert.equal(identity.id, 'identity:tw');
});

test('multiple sessions reference one identity without becoming identities', () => {
  const identity = createIdentity('identity:tw');
  const desktop = createSession('session:desktop', identity.id, ['INTERACT']);
  const mobile = createSession('session:mobile', identity.id, ['READ_PRESENCE']);

  assert.equal(desktop.identityId, mobile.identityId);
  assert.notEqual(desktop.id, mobile.id);
  assert.deepEqual(desktop.grantedCapabilities, ['INTERACT']);
  assert.deepEqual(mobile.grantedCapabilities, ['READ_PRESENCE']);
});

test('presence binds identity and session to context with independent visibility', () => {
  const presence = createPresence({
    id: 'presence:hub',
    identityId: 'identity:tw',
    sessionId: 'session:desktop',
    state: 'ACTIVE',
    address: { verseId: 'VERSE-ZERO-001', spaceId: 'WORLD-ZERO-MALKUTH-001' },
    visibility: { online: true, verse: true, preciseLocation: false },
  });

  assert.equal(presence.identityId, 'identity:tw');
  assert.equal(presence.sessionId, 'session:desktop');
  assert.equal(presence.visibility.preciseLocation, false);
});

test('presence transition preserves identity and session while changing context/state', () => {
  const source = createPresence({
    id: 'presence:hub',
    identityId: 'identity:tw',
    sessionId: 'session:desktop',
    state: 'ACTIVE',
    address: { verseId: 'VERSE-ZERO-001', spaceId: 'WORLD-ZERO-MALKUTH-001' },
    visibility: { online: true, verse: true, preciseLocation: false },
  });
  const target = updatePresence(source, {
    state: 'IN_TRANSITION',
    address: { verseId: 'verse:alakazam', spaceId: 'space:entry' },
  });

  assert.equal(target.identityId, source.identityId);
  assert.equal(target.sessionId, source.sessionId);
  assert.equal(target.address.verseId, 'verse:alakazam');
  assert.equal(source.address.verseId, 'VERSE-ZERO-001');
});
