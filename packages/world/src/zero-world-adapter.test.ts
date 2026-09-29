import assert from 'node:assert/strict';
import test from 'node:test';

import { ZERO_IDS } from '@hnk-verse/contracts';
import { ZERO_STATIC_SOLIDS, ZERO_WORLD_GRID, ZERO_WORLD_POSITIONS } from './zero-world.ts';
import { adaptZeroWorldToGraph } from './zero-world-adapter.ts';

test('ZERO adapts into the platform graph without changing legacy world data', () => {
  const before = JSON.stringify({ ZERO_STATIC_SOLIDS, ZERO_WORLD_GRID, ZERO_WORLD_POSITIONS });
  const graph = adaptZeroWorldToGraph();

  assert.equal(
    JSON.stringify({ ZERO_STATIC_SOLIDS, ZERO_WORLD_GRID, ZERO_WORLD_POSITIONS }),
    before,
  );
  assert.equal(graph.entities.get(ZERO_IDS.verse)?.kind, 'VERSE');
  assert.equal(graph.entities.get(ZERO_IDS.world)?.kind, 'SPACE');
  assert.equal(graph.entities.get(ZERO_IDS.avatar)?.kind, 'AVATAR');
  assert.equal(
    [...graph.entities.values()].filter((entity) => entity.data.source === 'ZERO_STATIC_SOLID').length,
    ZERO_STATIC_SOLIDS.length,
  );
});

test('ZERO adapter preserves canonical IDs for legacy command/event interoperability', () => {
  const graph = adaptZeroWorldToGraph();

  assert.ok(graph.entities.has(ZERO_IDS.verse));
  assert.ok(graph.entities.has(ZERO_IDS.world));
  assert.ok(graph.entities.has(ZERO_IDS.avatar));
  assert.equal(graph.entities.get(ZERO_IDS.avatar)?.address.verseId, ZERO_IDS.verse);
  assert.equal(graph.entities.get(ZERO_IDS.avatar)?.address.spaceId, ZERO_IDS.world);
});
