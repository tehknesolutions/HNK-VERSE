export type KodeTypeId = 'Path' | 'OperatorResultPath';

export type KodeTypeCategory = 'value' | 'operator-result';

export type KodeType = {
  id: KodeTypeId;
  category: KodeTypeCategory;
  parents: readonly KodeTypeId[];
};

export const KODE_TYPES: Record<KodeTypeId, KodeType> = {
  Path: { id: 'Path', category: 'value', parents: [] },
  OperatorResultPath: { id: 'OperatorResultPath', category: 'operator-result', parents: ['Path'] },
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

  isCompatible(actual: KodeTypeId, expected: KodeTypeId): boolean {
    if (actual === expected) return true;
    return this.get(actual).parents.includes(expected);
  }

  isPathType(type: KodeTypeId): boolean {
    return this.isCompatible(type, 'Path');
  }
}
