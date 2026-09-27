import {
  assertKnowledgeObject,
  type HnkKnowledgeObject,
  type KnowledgeLifecycle,
} from '@hnk-verse/contracts';

export type KnowledgeRegistrySnapshot = {
  objects: HnkKnowledgeObject[];
};

export class KnowledgeRegistry {
  readonly #objects = new Map<string, HnkKnowledgeObject>();

  validateIngest<T>(object: HnkKnowledgeObject<T>): void {
    assertKnowledgeObject(object);
    if (this.#objects.has(object.id)) throw new Error('KNOWLEDGE_ID_ALREADY_EXISTS');
  }

  validateReplace<T>(object: HnkKnowledgeObject<T>): void {
    assertKnowledgeObject(object);
    const previous = this.require(object.id);
    if (previous.lifecycle === 'CANON' && object.lifecycle !== 'CANON' && object.lifecycle !== 'SUPERSEDED' && object.lifecycle !== 'ARCHIVED') {
      throw new Error('CANON_DOWNGRADE_FORBIDDEN');
    }
  }

  ingest<T>(object: HnkKnowledgeObject<T>): HnkKnowledgeObject<T> {
    this.validateIngest(object);
    this.#objects.set(object.id, object);
    return object;
  }

  get<T = unknown>(id: string): HnkKnowledgeObject<T> | undefined {
    return this.#objects.get(id) as HnkKnowledgeObject<T> | undefined;
  }

  require<T = unknown>(id: string): HnkKnowledgeObject<T> {
    const object = this.get<T>(id);
    if (!object) throw new Error('KNOWLEDGE_NOT_FOUND');
    return object;
  }

  list(): HnkKnowledgeObject[] {
    return [...this.#objects.values()];
  }

  byLifecycle(lifecycle: KnowledgeLifecycle): HnkKnowledgeObject[] {
    return this.list().filter((object) => object.lifecycle === lifecycle);
  }

  replace<T>(object: HnkKnowledgeObject<T>): HnkKnowledgeObject<T> {
    this.validateReplace(object);
    this.#objects.set(object.id, object);
    return object;
  }

  snapshot(): KnowledgeRegistrySnapshot {
    return { objects: this.list() };
  }
}
