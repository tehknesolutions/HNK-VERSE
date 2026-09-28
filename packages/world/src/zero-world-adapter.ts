import { ZERO_IDS } from '@hnk-verse/contracts';
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

function zeroKind(kind: string): WorldEntityKind {
  return kind === 'AGENT' ? 'AGENT' : 'OBJECT';
}

function canonicalSolidId(legacyId: string): string {
  const canonical: Record<string, string> = {
    BED: ZERO_IDS.bed,
    WORKBENCH: ZERO_IDS.workbench,
    VALI_SURFACE: ZERO_IDS.valiSurface,
    CARTOGRAPHY_TABLE: ZERO_IDS.cartographyTable,
    WOOD_NODE: ZERO_IDS.woodNode,
    METATRON: ZERO_IDS.metatron,
  };
  return canonical[legacyId] ?? `ZERO-LEGACY-${legacyId}`;
}

export function adaptZeroWorldToGraph(): WorldGraph {
  let graph = createWorldGraph();

  graph = upsertWorldEntity(graph, {
    id: ZERO_IDS.verse,
    kind: 'VERSE',
    address: { verseId: ZERO_IDS.verse },
    data: { source: 'ZERO_LEGACY' },
  });
  graph = upsertWorldEntity(graph, {
    id: ZERO_IDS.world,
    kind: 'SPACE',
    address: { verseId: ZERO_IDS.verse, spaceId: ZERO_IDS.world },
    data: { source: 'ZERO_LEGACY', grid: { ...ZERO_WORLD_GRID } },
  });
  graph = upsertWorldEntity(graph, {
    id: ZERO_IDS.avatar,
    kind: 'AVATAR',
    address: { verseId: ZERO_IDS.verse, spaceId: ZERO_IDS.world },
    data: { source: 'ZERO_LEGACY', logical: { ...ZERO_WORLD_POSITIONS.avatarSpawn } },
  });

  graph = addWorldRelation(graph, {
    id: 'REL-ZERO-VERSE-CONTAINS-WORLD',
    type: 'CONTAINS',
    from: ZERO_IDS.verse,
    to: ZERO_IDS.world,
    data: {},
  });
  graph = addWorldRelation(graph, {
    id: 'REL-ZERO-WORLD-CONTAINS-AVATAR',
    type: 'CONTAINS',
    from: ZERO_IDS.world,
    to: ZERO_IDS.avatar,
    data: {},
  });

  for (const solid of ZERO_STATIC_SOLIDS) {
    const id = canonicalSolidId(solid.id);
    graph = upsertWorldEntity(graph, {
      id,
      kind: zeroKind(solid.kind),
      address: { verseId: ZERO_IDS.verse, spaceId: ZERO_IDS.world },
      data: {
        source: 'ZERO_STATIC_SOLID',
        legacyId: solid.id,
        legacyKind: solid.kind,
        logical: { ...solid.logical },
      },
    });
    graph = addWorldRelation(graph, {
      id: `REL-ZERO-WORLD-CONTAINS-${solid.id}`,
      type: 'CONTAINS',
      from: ZERO_IDS.world,
      to: id,
      data: {},
    });
  }

  return graph;
}
