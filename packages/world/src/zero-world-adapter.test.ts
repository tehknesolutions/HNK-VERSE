import assert from 'node:assert/strict';
import test from 'node:test';

import { ZERO_WORLD } from './zero-world.ts';
import { adaptZeroWorldToGraph } from './zero-world-adapter.ts';

test('ZERO adapts into the platform graph without changing the legacy world', () => {
  const before = JSON.stringify(ZERO_WORLD);
  const graph = adaptZeroWorldToGraph();

  assert.equal(JSON.stringify(ZERO_WORLD), before);
  assert.equal(graph.entities.get('verse:zero')?.kind, 'VERSE');
  assert.equal(graph.entities.get('space:zero-grid')?.kind, 'SPACE');
  assert.ok(graph.entities.has('entity:zero:player'));
});
