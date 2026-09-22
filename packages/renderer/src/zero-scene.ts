import { ZERO_IDS } from '@hnk-verse/contracts';
import type { ZeroWorldState } from '@hnk-verse/domain';

export const ZERO_GRID = {
  width: 18,
  height: 14,
  tileWidth: 64,
  tileHeight: 32,
  originX: 576,
  originY: 72,
} as const;

export type LogicalPoint = {
  x: number;
  y: number;
};

export type ScreenPoint = {
  x: number;
  y: number;
};

export type ZeroFixtureKind =
  | 'home-floor'
  | 'bed'
  | 'workbench'
  | 'vali'
  | 'metatron'
  | 'cartography'
  | 'wood'
  | 'storage-zone'
  | 'box';

export type ZeroSceneFixture = {
  id: string;
  kind: ZeroFixtureKind;
  label: string;
  logical: LogicalPoint;
  interactive: boolean;
  quantity?: number;
  state?: string;
};

export function logicalToIso(point: LogicalPoint): ScreenPoint {
  const { tileWidth, tileHeight, originX, originY } = ZERO_GRID;
  return {
    x: originX + (point.x - point.y) * (tileWidth / 2),
    y: originY + (point.x + point.y) * (tileHeight / 2),
  };
}

export function isoToLogical(point: ScreenPoint): LogicalPoint {
  const { tileWidth, tileHeight, originX, originY } = ZERO_GRID;
  const dx = point.x - originX;
  const dy = point.y - originY;
  return {
    x: (dy / (tileHeight / 2) + dx / (tileWidth / 2)) / 2,
    y: (dy / (tileHeight / 2) - dx / (tileWidth / 2)) / 2,
  };
}

export function snapLogical(point: LogicalPoint): LogicalPoint {
  return {
    x: Math.round(point.x),
    y: Math.round(point.y),
  };
}

export function insideZeroLand(point: LogicalPoint): boolean {
  return (
    point.x >= 1 &&
    point.x <= ZERO_GRID.width &&
    point.y >= 1 &&
    point.y <= ZERO_GRID.height
  );
}

export const ZERO_HOME_FOOTPRINT = {
  minX: 2,
  maxX: 9,
  minY: 2,
  maxY: 7,
} as const;

export const ZERO_SCENE_POSITIONS = {
  avatarSpawn: { x: 4, y: 4 },
  bed: { x: 3, y: 3 },
  workbench: { x: 10, y: 5 },
  valiSurface: { x: 8, y: 4 },
  metatron: { x: 12, y: 6 },
  cartographyTable: { x: 12, y: 5 },
  woodNode: { x: 15, y: 9 },
  storageZone: { x: 5, y: 5 },
} as const satisfies Record<string, LogicalPoint>;

export function buildZeroScene(state: ZeroWorldState): ZeroSceneFixture[] {
  const fixtures: ZeroSceneFixture[] = [
    {
      id: ZERO_IDS.bed,
      kind: 'bed',
      label: 'Cama',
      logical: ZERO_SCENE_POSITIONS.bed,
      interactive: true,
      state: `Energia ${state.energyRest}`,
    },
    {
      id: ZERO_IDS.workbench,
      kind: 'workbench',
      label: 'Bancada',
      logical: ZERO_SCENE_POSITIONS.workbench,
      interactive: true,
      state: state.skillEvidenceIds.length > 0 ? 'Prática evidenciada' : 'Prática disponível',
    },
    {
      id: ZERO_IDS.valiSurface,
      kind: 'vali',
      label: state.valiKnown ? 'VALI · trabalho / trabalhar' : 'VALI',
      logical: ZERO_SCENE_POSITIONS.valiSurface,
      interactive: true,
      state: state.valiKnown
        ? 'Conhecido'
        : state.lexemeObserved
          ? 'Forma observada'
          : 'Não observado',
    },
    {
      id: ZERO_IDS.metatron,
      kind: 'metatron',
      label: 'Metatron',
      logical: ZERO_SCENE_POSITIONS.metatron,
      interactive: true,
      state:
        state.agentMemories.length > 0
          ? `${state.agentMemories.length} memória(s)`
          : 'Cartógrafo',
    },
    {
      id: ZERO_IDS.cartographyTable,
      kind: 'cartography',
      label: 'Cartografia',
      logical: ZERO_SCENE_POSITIONS.cartographyTable,
      interactive: false,
    },
    {
      id: ZERO_IDS.woodNode,
      kind: 'wood',
      label: 'Madeira',
      logical: ZERO_SCENE_POSITIONS.woodNode,
      interactive: state.woodNodeRemaining > 0,
      quantity: state.woodNodeRemaining,
      state: `${state.woodNodeRemaining}/4`,
    },
    {
      id: 'ZONE-ZERO-HOME-STORAGE-001',
      kind: 'storage-zone',
      label: 'Zona de armazenamento',
      logical: ZERO_SCENE_POSITIONS.storageZone,
      interactive: Boolean(state.entities[ZERO_IDS.woodenBox]) &&
        !state.entities[ZERO_IDS.woodenBox]?.spatialBinding,
      state: state.entities[ZERO_IDS.woodenBox]?.spatialBinding ? 'Ocupada' : 'Livre',
    },
  ];

  const box = state.entities[ZERO_IDS.woodenBox];
  if (box?.spatialBinding) {
    fixtures.push({
      id: box.entityInstanceId,
      kind: 'box',
      label: 'Caixa de Madeira',
      logical: {
        x: box.spatialBinding.logicalX,
        y: box.spatialBinding.logicalY,
      },
      interactive: true,
      state: 'Persistente',
    });
  }

  return fixtures;
}

export function tilePolygon(point: LogicalPoint): string {
  const center = logicalToIso(point);
  const halfW = ZERO_GRID.tileWidth / 2;
  const halfH = ZERO_GRID.tileHeight / 2;
  return [
    `${center.x},${center.y - halfH}`,
    `${center.x + halfW},${center.y}`,
    `${center.x},${center.y + halfH}`,
    `${center.x - halfW},${center.y}`,
  ].join(' ');
}
