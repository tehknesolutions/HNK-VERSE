import { ZERO_IDS } from '@hnk-verse/contracts';

export type ZeroLogicalPoint = {
  x: number;
  y: number;
};

export const ZERO_WORLD_GRID = {
  width: 18,
  height: 14,
} as const;

export const ZERO_HOME_FOOTPRINT = {
  minX: 2,
  maxX: 9,
  minY: 2,
  maxY: 7,
} as const;

export const ZERO_HOME_THRESHOLD = {
  id: ZERO_IDS.homeThreshold,
  logical: { x: 9, y: 6 },
  orientation: 'EAST',
} as const;

export const ZERO_WORLD_POSITIONS = {
  avatarSpawn: { x: 4, y: 4 },
  bed: { x: 3, y: 3 },
  workbench: { x: 10, y: 5 },
  valiSurface: { x: 8, y: 4 },
  metatron: { x: 12, y: 6 },
  cartographyTable: { x: 12, y: 5 },
  woodNode: { x: 15, y: 9 },
  storageZone: { x: 5, y: 5 },
} as const satisfies Record<string, ZeroLogicalPoint>;

export const ZERO_INTERACTION_RANGE = 1;

export const ZERO_STATIC_SOLIDS = [
  {
    id: ZERO_IDS.bed,
    logical: ZERO_WORLD_POSITIONS.bed,
    kind: 'BED',
  },
  {
    id: ZERO_IDS.workbench,
    logical: ZERO_WORLD_POSITIONS.workbench,
    kind: 'WORKBENCH',
  },
  {
    id: ZERO_IDS.valiSurface,
    logical: ZERO_WORLD_POSITIONS.valiSurface,
    kind: 'VALI_SURFACE',
  },
  {
    id: ZERO_IDS.metatron,
    logical: ZERO_WORLD_POSITIONS.metatron,
    kind: 'AGENT',
  },
  {
    id: ZERO_IDS.cartographyTable,
    logical: ZERO_WORLD_POSITIONS.cartographyTable,
    kind: 'CARTOGRAPHY_TABLE',
  },
  {
    id: ZERO_IDS.woodNode,
    logical: ZERO_WORLD_POSITIONS.woodNode,
    kind: 'RESOURCE_NODE',
  },
] as const;

function pointKey(point: ZeroLogicalPoint): string {
  return `${point.x},${point.y}`;
}

function buildHomeWallCells(): ZeroLogicalPoint[] {
  const result: ZeroLogicalPoint[] = [];

  for (let x = ZERO_HOME_FOOTPRINT.minX; x <= ZERO_HOME_FOOTPRINT.maxX; x += 1) {
    result.push({ x, y: ZERO_HOME_FOOTPRINT.minY });
    result.push({ x, y: ZERO_HOME_FOOTPRINT.maxY });
  }

  for (
    let y = ZERO_HOME_FOOTPRINT.minY + 1;
    y < ZERO_HOME_FOOTPRINT.maxY;
    y += 1
  ) {
    result.push({ x: ZERO_HOME_FOOTPRINT.minX, y });
    result.push({ x: ZERO_HOME_FOOTPRINT.maxX, y });
  }

  return result.filter(
    (point) =>
      point.x !== ZERO_HOME_THRESHOLD.logical.x ||
      point.y !== ZERO_HOME_THRESHOLD.logical.y,
  );
}

export const ZERO_HOME_WALL_CELLS = buildHomeWallCells();

const STATIC_SOLID_KEYS = new Set(
  ZERO_STATIC_SOLIDS.map((solid) => pointKey(solid.logical)),
);

const HOME_WALL_KEYS = new Set(
  ZERO_HOME_WALL_CELLS.map(pointKey),
);

export function insideZeroLand(point: ZeroLogicalPoint): boolean {
  return (
    Number.isInteger(point.x) &&
    Number.isInteger(point.y) &&
    point.x >= 1 &&
    point.x <= ZERO_WORLD_GRID.width &&
    point.y >= 1 &&
    point.y <= ZERO_WORLD_GRID.height
  );
}

export function isHomeWallCell(point: ZeroLogicalPoint): boolean {
  return HOME_WALL_KEYS.has(pointKey(point));
}

export function isStaticSolidCell(point: ZeroLogicalPoint): boolean {
  return STATIC_SOLID_KEYS.has(pointKey(point)) || isHomeWallCell(point);
}

export function isHomeThresholdCell(point: ZeroLogicalPoint): boolean {
  return (
    point.x === ZERO_HOME_THRESHOLD.logical.x &&
    point.y === ZERO_HOME_THRESHOLD.logical.y
  );
}

export function manhattanDistance(
  from: ZeroLogicalPoint,
  to: ZeroLogicalPoint,
): number {
  return Math.abs(from.x - to.x) + Math.abs(from.y - to.y);
}

export function isWithinInteractionRange(
  from: ZeroLogicalPoint,
  to: ZeroLogicalPoint,
  range = ZERO_INTERACTION_RANGE,
): boolean {
  return manhattanDistance(from, to) <= range;
}

export function interactionPointForTarget(
  targetId: string | undefined,
): ZeroLogicalPoint | null {
  switch (targetId) {
    case ZERO_IDS.bed:
      return ZERO_WORLD_POSITIONS.bed;
    case ZERO_IDS.workbench:
      return ZERO_WORLD_POSITIONS.workbench;
    case ZERO_IDS.valiSurface:
      return ZERO_WORLD_POSITIONS.valiSurface;
    case ZERO_IDS.metatron:
      return ZERO_WORLD_POSITIONS.metatron;
    case ZERO_IDS.cartographyTable:
      return ZERO_WORLD_POSITIONS.cartographyTable;
    case ZERO_IDS.woodNode:
      return ZERO_WORLD_POSITIONS.woodNode;
    case ZERO_IDS.storageZone:
      return ZERO_WORLD_POSITIONS.storageZone;
    default:
      return null;
  }
}


export type ZeroPathBlocker = (point: ZeroLogicalPoint) => boolean;

export type ZeroPathResult = {
  start: ZeroLogicalPoint;
  goal: ZeroLogicalPoint;
  steps: ZeroLogicalPoint[];
  visited: number;
};

const ZERO_CARDINAL_NEIGHBORS = [
  { x: 1, y: 0 },
  { x: 0, y: 1 },
  { x: -1, y: 0 },
  { x: 0, y: -1 },
] as const;

export function zeroPointKey(point: ZeroLogicalPoint): string {
  return pointKey(point);
}

export function zeroCardinalNeighbors(
  point: ZeroLogicalPoint,
): ZeroLogicalPoint[] {
  return ZERO_CARDINAL_NEIGHBORS.map((offset) => ({
    x: point.x + offset.x,
    y: point.y + offset.y,
  }));
}

export function isZeroWalkableCell(
  point: ZeroLogicalPoint,
  dynamicBlocked?: ZeroPathBlocker,
): boolean {
  return (
    insideZeroLand(point) &&
    !isStaticSolidCell(point) &&
    !(dynamicBlocked?.(point) ?? false)
  );
}

function reconstructPath(
  start: ZeroLogicalPoint,
  goal: ZeroLogicalPoint,
  parents: Map<string, ZeroLogicalPoint | null>,
): ZeroLogicalPoint[] {
  const reversed: ZeroLogicalPoint[] = [];
  let current: ZeroLogicalPoint | null = goal;

  while (
    current &&
    (current.x !== start.x || current.y !== start.y)
  ) {
    reversed.push(current);
    current = parents.get(pointKey(current)) ?? null;
  }

  reversed.reverse();
  return reversed;
}

export function findZeroPath(
  start: ZeroLogicalPoint,
  goal: ZeroLogicalPoint,
  dynamicBlocked?: ZeroPathBlocker,
): ZeroPathResult | null {
  if (!insideZeroLand(start) || !insideZeroLand(goal)) return null;

  if (start.x === goal.x && start.y === goal.y) {
    return {
      start: { ...start },
      goal: { ...goal },
      steps: [],
      visited: 1,
    };
  }

  if (!isZeroWalkableCell(goal, dynamicBlocked)) return null;

  const queue: ZeroLogicalPoint[] = [{ ...start }];
  const parents = new Map<string, ZeroLogicalPoint | null>([
    [pointKey(start), null],
  ]);
  let cursor = 0;

  while (cursor < queue.length) {
    const current = queue[cursor];
    cursor += 1;

    for (const next of zeroCardinalNeighbors(current)) {
      const key = pointKey(next);
      if (parents.has(key)) continue;
      if (!isZeroWalkableCell(next, dynamicBlocked)) continue;

      parents.set(key, current);

      if (next.x === goal.x && next.y === goal.y) {
        return {
          start: { ...start },
          goal: { ...goal },
          steps: reconstructPath(start, next, parents),
          visited: parents.size,
        };
      }

      queue.push(next);
    }
  }

  return null;
}

export function zeroInteractionGoals(
  target: ZeroLogicalPoint,
  dynamicBlocked?: ZeroPathBlocker,
): ZeroLogicalPoint[] {
  return zeroCardinalNeighbors(target).filter((point) =>
    isZeroWalkableCell(point, dynamicBlocked),
  );
}

export function findZeroInteractionRoute(
  start: ZeroLogicalPoint,
  target: ZeroLogicalPoint,
  dynamicBlocked?: ZeroPathBlocker,
): ZeroPathResult | null {
  if (!insideZeroLand(start) || !insideZeroLand(target)) return null;

  if (isWithinInteractionRange(start, target)) {
    return {
      start: { ...start },
      goal: { ...start },
      steps: [],
      visited: 1,
    };
  }

  const goals = zeroInteractionGoals(target, dynamicBlocked);
  if (goals.length === 0) return null;

  const goalKeys = new Set(goals.map(pointKey));
  const queue: ZeroLogicalPoint[] = [{ ...start }];
  const parents = new Map<string, ZeroLogicalPoint | null>([
    [pointKey(start), null],
  ]);
  let cursor = 0;

  while (cursor < queue.length) {
    const current = queue[cursor];
    cursor += 1;

    for (const next of zeroCardinalNeighbors(current)) {
      const key = pointKey(next);
      if (parents.has(key)) continue;
      if (!isZeroWalkableCell(next, dynamicBlocked)) continue;

      parents.set(key, current);

      if (goalKeys.has(key)) {
        return {
          start: { ...start },
          goal: { ...next },
          steps: reconstructPath(start, next, parents),
          visited: parents.size,
        };
      }

      queue.push(next);
    }
  }

  return null;
}
