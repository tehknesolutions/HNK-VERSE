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
