import assert from 'node:assert/strict';
import test from 'node:test';

import {
  createWorldGraph,
  getOutgoingRelations,
  upsertWorldEntity,
  addWorldRelation,
  type WorldEntity,
} from './world-graph.ts';

test('world graph stores typed entities independently from their address', () => {
  const graph = createWorldGraph();
  const entity: WorldEntity = {
    id: 'entity:zero:player',
    kind: 'AVATAR',
    address: { verseId: 'verse:zero', spaceId: 'space:zero-grid' },
    data: { legacyId: 'player' },
  };

  const next = upsertWorldEntity(graph, entity);
  assert.equal(next.entities.get(entity.id)?.id, entity.id);
  assert.equal(next.entities.get(entity.id)?.kind, 'AVATAR');
});

test('world relations are explicit typed edges', () => {
  let graph = createWorldGraph();
  graph = upsertWorldEntity(graph, {
    id: 'entity:zero:player',
    kind: 'AVATAR',
    address: { verseId: 'verse:zero' },
    data: {},
  });
  graph = upsertWorldEntity(graph, {
    id: 'entity:zero:door',
    kind: 'OBJECT',
    address: { verseId: 'verse:zero' },
    data: {},
  });
  graph = addWorldRelation(graph, {
    id: 'relation:zero:player-door',
    type: 'CAN_INTERACT_WITH',
    from: 'entity:zero:player',
    to: 'entity:zero:door',
    data: {},
  });

  assert.equal(getOutgoingRelations(graph, 'entity:zero:player')[0]?.to, 'entity:zero:door');
});

test('relation endpoints must already exist', () => {
  const graph = createWorldGraph();
  assert.throws(() => addWorldRelation(graph, {
    id: 'relation:invalid',
    type: 'CONTAINS',
    from: 'entity:missing:a',
    to: 'entity:missing:b',
    data: {},
  }), /endpoint/i);
});

test('entity input mutations cannot change a stored graph snapshot', () => {
  const entity: WorldEntity = {
    id: 'entity:immutable',
    kind: 'OBJECT',
    address: { verseId: 'verse:test' },
    data: { nested: { value: 1 } },
  };
  const graph = upsertWorldEntity(createWorldGraph(), entity);

  entity.address.verseId = 'verse:mutated';
  (entity.data.nested as { value: number }).value = 99;

  assert.equal(graph.entities.get('entity:immutable')?.address.verseId, 'verse:test');
  assert.deepEqual(graph.entities.get('entity:immutable')?.data, { nested: { value: 1 } });
});

test('relation input mutations cannot invalidate a stored graph snapshot', () => {
  let graph = createWorldGraph();
  graph = upsertWorldEntity(graph, { id: 'entity:a', kind: 'OBJECT', address: { verseId: 'verse:test' }, data: {} });
  graph = upsertWorldEntity(graph, { id: 'entity:b', kind: 'OBJECT', address: { verseId: 'verse:test' }, data: {} });
  const relation = { id: 'relation:ab', type: 'LINK', from: 'entity:a', to: 'entity:b', data: { nested: { value: 1 } } };
  graph = addWorldRelation(graph, relation);

  relation.to = 'entity:missing';
  relation.data.nested.value = 99;

  assert.equal(graph.relations[0]?.to, 'entity:b');
  assert.deepEqual(graph.relations[0]?.data, { nested: { value: 1 } });
});
