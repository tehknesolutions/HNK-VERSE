import type { KodeType } from './kode-semantic.ts';

export type KodeTypeCompatibility = {
  actual: KodeType;
  expected: KodeType;
};

export class KodeTypeSystem {
  isCompatible(actual: KodeType, expected: KodeType): boolean {
    if (actual === expected) return true;
    return expected === 'Path' && actual === 'OperatorResultPath';
  }

  isPathType(type: KodeType): boolean {
    return this.isCompatible(type, 'Path');
  }
}
