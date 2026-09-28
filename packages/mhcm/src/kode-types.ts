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
  return KODE_TYPES[id];
}

export type KodeTypeSystemValidation = {
  ok: true;
} | {
  ok: false;
  errors: string[];
};

export function validateKodeTypeDefinitions(types: Record<KodeTypeId, KodeType> = KODE_TYPES): KodeTypeSystemValidation {
  const errors: string[] = [];
  for (const type of Object.values(types)) {
    for (const parent of type.parents) {
      if (!types[parent]) errors.push(`Type ${type.id} references unknown parent ${parent}.`);
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

export function assertValidKodeTypeDefinitions(types: Record<KodeTypeId, KodeType> = KODE_TYPES): void {
  const result = validateKodeTypeDefinitions(types);
  if (!result.ok) throw new Error(`Invalid KODE type system:\\n${result.errors.join('\\n')}`);
}

export class KodeTypeSystem {
  get(id: KodeTypeId): KodeType {
    return getKodeType(id);
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
