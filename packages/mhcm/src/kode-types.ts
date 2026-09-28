export type KodeTypeId = 'Path' | 'OperatorResultPath' | 'SpecialPath';

export type KodeTypeCategory = 'value' | 'operator-result';

export type KodeType = {
  id: KodeTypeId;
  category: KodeTypeCategory;
  parents: readonly KodeTypeId[];
};

export const KODE_TYPES: Record<KodeTypeId, KodeType> = {
  Path: { id: 'Path', category: 'value', parents: [] },
  OperatorResultPath: { id: 'OperatorResultPath', category: 'operator-result', parents: ['Path'] },
  SpecialPath: { id: 'SpecialPath', category: 'operator-result', parents: ['OperatorResultPath'] },
};

export type KodeTypeCompatibility = {
  actual: KodeTypeId;
  expected: KodeTypeId;
};

export function getKodeType(id: KodeTypeId): KodeType {
  const type = KODE_TYPES[id];
  if (!type) throw new Error(`Unknown KODE type: ${id}.`);
  return type;
}

export type KodeTypeSystemValidation = {
  ok: true;
} | {
  ok: false;
  errors: string[];
};

export function validateKodeTypeDefinitions(types: Record<KodeTypeId, KodeType> = KODE_TYPES): KodeTypeSystemValidation {
  const errors: string[] = [];
  const allowedCategories = new Set<KodeTypeCategory>(['value', 'operator-result']);
  for (const [key, type] of Object.entries(types)) {
    if (key !== type.id) errors.push(`Type registry key ${key} does not match descriptor id ${type.id}.`);
    if (!allowedCategories.has(type.category)) errors.push(`Type ${type.id} has invalid category ${type.category}.`);
    if (!Array.isArray(type.parents)) errors.push(`Type ${type.id} has invalid parents metadata.`);
  }
  for (const type of Object.values(types)) {
    for (const parent of type.parents) {
      if (!types[parent]) {
        errors.push(`Type ${type.id} references unknown parent ${parent}.`);
        continue;
      }
      if (type.category === 'value' && types[parent].category === 'operator-result') {
        errors.push(`Type ${type.id} (value) cannot inherit from operator-result type ${parent}.`);
      }
    }
  }
  for (const type of Object.values(types)) {
    const visiting = new Set<KodeTypeId>();
    const visited = new Set<KodeTypeId>();
    const visit = (id: KodeTypeId): void => {
      if (visiting.has(id)) {
        errors.push(`Type hierarchy cycle detected at ${id}.`);
        return;
      }
      if (visited.has(id)) return;
      visiting.add(id);
      for (const parent of types[id]?.parents ?? []) {
        if (types[parent]) visit(parent);
      }
      visiting.delete(id);
      visited.add(id);
    };
    visit(type.id);
  }
  return errors.length ? { ok: false, errors } : { ok: true };
}

export function isValidKodeTypeCategory(type: KodeType, types: Record<KodeTypeId, KodeType> = KODE_TYPES): boolean {
  return type.parents.every((parent) => {
    const parentType = types[parent];
    return !parentType || !(type.category === 'value' && parentType.category === 'operator-result');
  });
}

export function assertValidKodeTypeDefinitions(types: Record<KodeTypeId, KodeType> = KODE_TYPES): void {
  const result = validateKodeTypeDefinitions(types);
  if (!result.ok) throw new Error(`Invalid KODE type system:\\n${result.errors.join('\\n')}`);
}

function freezeTypeDefinitions(types: Record<KodeTypeId, KodeType>): Readonly<Record<KodeTypeId, KodeType>> {
  const frozen: Record<KodeTypeId, KodeType> = {} as Record<KodeTypeId, KodeType>;
  for (const [id, type] of Object.entries(types) as [KodeTypeId, KodeType][]) {
    frozen[id] = Object.freeze({ ...type, parents: Object.freeze([...type.parents]) });
  }
  return Object.freeze(frozen);
}

export class KodeTypeSystem {
  private readonly types: Readonly<Record<KodeTypeId, KodeType>>;

  constructor(types: Record<KodeTypeId, KodeType> = KODE_TYPES) {
    assertValidKodeTypeDefinitions(types);
    this.types = freezeTypeDefinitions(types);
  }

  get(id: KodeTypeId): KodeType {
    const type = this.types[id];
    if (!type) throw new Error(`Unknown KODE type: ${id}.`);
    return type;
  }

  isSubtypeOf(actual: KodeTypeId, expected: KodeTypeId, seen = new Set<KodeTypeId>()): boolean {
    if (actual === expected) return true;
    if (seen.has(actual)) return false;
    seen.add(actual);
    return this.get(actual).parents.some((parent) => this.isSubtypeOf(parent, expected, seen));
  }

  isCompatible(actual: KodeTypeId, expected: KodeTypeId): boolean {
    return this.isSubtypeOf(actual, expected);
  }

  isPathType(type: KodeTypeId): boolean {
    return this.isCompatible(type, 'Path');
  }
}
