import assert from 'node:assert/strict';
import test from 'node:test';

import { ZERO_STATIC_SOLIDS, ZERO_WORLD_GRID, ZERO_WORLD_POSITIONS } from './zero-world.ts';
import { adaptZeroWorldToGraph } from './zero-world-adapter.ts';

test('ZERO adapts into the platform graph without changing legacy world data', () => {
  const before = JSON.stringify({ ZERO_STATIC_SOLIDS, ZERO_WORLD_GRID, ZERO_WORLD_POSITIONS });
  const graph = adaptZeroWorldToGraph();

  assert.equal(
    JSON.stringify({ ZERO_STATIC_SOLIDS, ZERO_WORLD_GRID, ZERO_WORLD_POSITIONS }),
    before,
  );
  assert.equal(graph.entities.get('verse:zero')?.kind, 'VERSE');
  assert.equal(graph.entities.get('space:zero-grid')?.kind, 'SPACE');
  assert.equal(graph.entities.get('entity:zero:player')?.kind, 'AVATAR');
  assert.equal(
    [...graph.entities.values()].filter((entity) => entity.data.source === 'ZERO_STATIC_SOLID').length,
    ZERO_STATIC_SOLIDS.length,
  );
});
