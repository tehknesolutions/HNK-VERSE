import type { HnkAddress } from './platform-kernel.ts';

export type WorldEntityKind =
  | 'AVATAR'
  | 'AGENT'
  | 'SPACE'
  | 'OBJECT'
  | 'PORTAL'
  | 'EXPERIENCE'
  | 'VERSE';

export type WorldEntity = {
  id: string;
  kind: WorldEntityKind;
  address: HnkAddress;
  data: Record<string, unknown>;
};

export type WorldRelation = {
  id: string;
  type: string;
  from: string;
  to: string;
  data: Record<string, unknown>;
};

export type WorldGraph = {
  entities: ReadonlyMap<string, WorldEntity>;
  relations: readonly WorldRelation[];
};

function cloneValue<T>(value: T): T {
  return structuredClone(value);
}

export function createWorldGraph(): WorldGraph {
  return { entities: new Map(), relations: [] };
}

export function upsertWorldEntity(graph: WorldGraph, entity: WorldEntity): WorldGraph {
  const entities = new Map(graph.entities);
  entities.set(entity.id, cloneValue(entity));
  return { ...graph, entities };
}

export function addWorldRelation(graph: WorldGraph, relation: WorldRelation): WorldGraph {
  if (!graph.entities.has(relation.from) || !graph.entities.has(relation.to)) {
    throw new Error('World relation endpoint does not exist in graph.');
  }

  return { ...graph, relations: [...graph.relations, cloneValue(relation)] };
}

export function getOutgoingRelations(graph: WorldGraph, entityId: string): readonly WorldRelation[] {
  return graph.relations.filter((relation) => relation.from === entityId);
}
