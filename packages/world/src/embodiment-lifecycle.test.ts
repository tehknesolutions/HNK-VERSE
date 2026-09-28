import assert from 'node:assert/strict';
import test from 'node:test';

import {
  createEmbodiment,
  transitionEmbodiment,
  transitionPresence,
} from './embodiment-lifecycle.ts';
import { createPresence } from './identity-presence.ts';

test('embodiment is contextual and does not become identity or avatar', () => {
  const embodiment = createEmbodiment({
    id: 'embodiment:zero:tw',
    identityId: 'identity:tw',
    avatarId: 'avatar:one',
    presenceId: 'presence:zero',
    address: { verseId: 'VERSE-ZERO-001', spaceId: 'WORLD-ZERO-MALKUTH-001' },
    state: { hp: 10 },
  });
  assert.equal(embodiment.identityId, 'identity:tw');
  assert.equal(embodiment.avatarId, 'avatar:one');
  assert.notEqual(embodiment.id, embodiment.identityId);
  assert.notEqual(embodiment.id, embodiment.avatarId);
});

test('embodiment transition preserves platform identity/avatar and replaces contextual state', () => {
  const source = createEmbodiment({ id: 'embodiment:zero:tw', identityId: 'identity:tw', avatarId: 'avatar:one', presenceId: 'presence:zero', address: { verseId: 'VERSE-ZERO-001' }, state: { hp: 10 } });
  const target = transitionEmbodiment(source, { id: 'embodiment:alakazam:tw', presenceId: 'presence:alakazam', address: { verseId: 'verse:alakazam' }, state: { mana: 7 } });
  assert.equal(target.identityId, source.identityId);
  assert.equal(target.avatarId, source.avatarId);
  assert.deepEqual(target.state, { mana: 7 });
  assert.deepEqual(source.state, { hp: 10 });
});

test('presence lifecycle emits Chronicle-ready transition facts without owning Chronicle', () => {
  const source = createPresence({ id: 'presence:zero', identityId: 'identity:tw', sessionId: 'session:desktop', state: 'ACTIVE', address: { verseId: 'VERSE-ZERO-001' }, visibility: { online: true, verse: true, preciseLocation: false } });
  const result = transitionPresence(source, { state: 'IN_TRANSITION', address: { verseId: 'verse:alakazam' } });
  assert.equal(result.presence.identityId, source.identityId);
  assert.equal(result.fact.type, 'PRESENCE_TRANSITIONED');
  assert.equal(result.fact.identityId, source.identityId);
  assert.equal(result.fact.from.verseId, 'VERSE-ZERO-001');
  assert.equal(result.fact.to.verseId, 'verse:alakazam');
});
