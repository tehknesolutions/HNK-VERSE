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
