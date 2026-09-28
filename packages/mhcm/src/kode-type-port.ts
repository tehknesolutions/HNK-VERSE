import type { KodeTypeId } from './kode-types.ts';

export interface KodeTypeSystemPort {
  get(id: KodeTypeId): {
    id: KodeTypeId;
    category: string;
    parents: readonly KodeTypeId[];
  };
  isSubtypeOf(actual: KodeTypeId, expected: KodeTypeId): boolean;
  isCompatible(actual: KodeTypeId, expected: KodeTypeId): boolean;
  isPathType(type: KodeTypeId): boolean;
}
