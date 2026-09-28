import {
  ZERO_STATIC_SOLIDS,
  ZERO_WORLD_GRID,
  ZERO_WORLD_POSITIONS,
} from './zero-world.ts';
import {
  addWorldRelation,
  createWorldGraph,
  upsertWorldEntity,
  type WorldEntityKind,
  type WorldGraph,
} from './world-graph.ts';

const ZERO_VERSE_ID = 'verse:zero';
const ZERO_SPACE_ID = 'space:zero-grid';

function zeroKind(kind: string): WorldEntityKind {
  return kind === 'AGENT' ? 'AGENT' : 'OBJECT';
}

export function adaptZeroWorldToGraph(): WorldGraph {
  let graph = createWorldGraph();

  graph = upsertWorldEntity(graph, {
    id: ZERO_VERSE_ID,
    kind: 'VERSE',
    address: { verseId: ZERO_VERSE_ID },
    data: { source: 'ZERO_LEGACY' },
  });
  graph = upsertWorldEntity(graph, {
    id: ZERO_SPACE_ID,
    kind: 'SPACE',
    address: { verseId: ZERO_VERSE_ID, spaceId: ZERO_SPACE_ID },
    data: { source: 'ZERO_LEGACY', grid: { ...ZERO_WORLD_GRID } },
  });
  graph = upsertWorldEntity(graph, {
    id: 'entity:zero:player',
    kind: 'AVATAR',
    address: { verseId: ZERO_VERSE_ID, spaceId: ZERO_SPACE_ID },
    data: { source: 'ZERO_LEGACY', logical: { ...ZERO_WORLD_POSITIONS.avatarSpawn } },
  });

  graph = addWorldRelation(graph, {
    id: 'relation:zero:verse-contains-space',
    type: 'CONTAINS',
    from: ZERO_VERSE_ID,
    to: ZERO_SPACE_ID,
    data: {},
  });
  graph = addWorldRelation(graph, {
    id: 'relation:zero:space-contains-player',
    type: 'CONTAINS',
    from: ZERO_SPACE_ID,
    to: 'entity:zero:player',
    data: {},
  });

  for (const solid of ZERO_STATIC_SOLIDS) {
    const id = `entity:zero:${solid.id}`;
    graph = upsertWorldEntity(graph, {
      id,
      kind: zeroKind(solid.kind),
      address: { verseId: ZERO_VERSE_ID, spaceId: ZERO_SPACE_ID },
      data: {
        source: 'ZERO_STATIC_SOLID',
        legacyId: solid.id,
        legacyKind: solid.kind,
        logical: { ...solid.logical },
      },
    });
    graph = addWorldRelation(graph, {
      id: `relation:zero:space-contains:${solid.id}`,
      type: 'CONTAINS',
      from: ZERO_SPACE_ID,
      to: id,
      data: {},
    });
  }

  return graph;
}
