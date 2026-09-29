import assert from 'node:assert/strict';
import test from 'node:test';

import {
  capabilitySupported,
  createPlatformIdentity,
  createTransition,
  moveIdentity,
  type PlatformState,
  type VerseState,
} from './platform-kernel.ts';

test('platform identity survives address changes', () => {
  const identity = createPlatformIdentity('entity:creator:001', {
    verseId: 'verse:hub',
    spaceId: 'space:home',
  });
  const moved = moveIdentity(identity, {
    verseId: 'verse:alchemy',
    spaceId: 'space:lab',
  });

  assert.equal(moved.id, identity.id);
  assert.notDeepEqual(moved.address, identity.address);
});

test('platform and Verse state retain distinct authorities', () => {
  const platform: PlatformState = {
    authority: 'HNK_VERSE_PLATFORM',
    identityId: 'entity:creator:001',
  };
  const verse: VerseState = {
    authority: 'VERSE',
    verseId: 'verse:alakazam',
    identityId: 'entity:creator:001',
    data: { level: 7 },
  };

  assert.notEqual(platform.authority, verse.authority);
});

test('missing capability is unsupported by default', () => {
  assert.equal(capabilitySupported({ version: '1', capabilities: [] }, 'external-items'), false);
});

test('Verse state does not cross a boundary implicitly', () => {
  const result = createTransition({
    identityId: 'entity:creator:001',
    source: { verseId: 'verse:alakazam' },
    target: { verseId: 'verse:alchemy' },
    targetManifest: { version: '1', capabilities: [] },
    requestedState: [{ key: 'level', scope: 'VERSE' }],
  });

  assert.equal(result.outcomes[0]?.outcome, 'REJECT');
  assert.equal(result.trace.identityId, 'entity:creator:001');
  assert.equal(result.trace.sourceVerseId, 'verse:alakazam');
  assert.equal(result.trace.targetVerseId, 'verse:alchemy');
});
