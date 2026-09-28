import {
  ZERO_IDS,
  ZERO_PENDING_MALKUTH_CODEX_REF,
  ZERO_VALI_LANGUAGE_REF,
} from '@hnk-verse/contracts';
import { TECNOMAGE_PRIME_V28 } from '@hnk-verse/renderer';

const requiredZeroIds = [
  'hnkIdentity',
  'verse',
  'world',
  'land',
  'home',
  'avatar',
  'metatron',
  'bed',
  'workbench',
  'valiSurface',
  'cartographyTable',
  'woodNode',
  'storageZone',
  'homeThreshold',
  'woodenBox',
  'playerInventory',
  'metatronInventory',
  'relationship',
  'skillRecord',
  'eventStream',
  'fixture',
] as const;

for (const id of requiredZeroIds) {
  if (!ZERO_IDS[id]) throw new Error(`ZERO_ID_MISSING:${id}`);
}

if (ZERO_PENDING_MALKUTH_CODEX_REF.internalRef !== 'ZERO-KNOWLEDGE-MALKUTH-MANIFESTATION-V0') {
  throw new Error('ZERO_PENDING_MALKUTH_CODEX_REF_REGRESSION');
}

if (ZERO_VALI_LANGUAGE_REF.canonicalId !== 'LEX-013') {
  throw new Error('ZERO_VALI_LANGUAGE_REF_REGRESSION');
}

if (TECNOMAGE_PRIME_V28.characterId !== 'tecnomage-prime') {
  throw new Error('TECNOMAGE_PRIME_V28_EXPORT_REGRESSION');
}

console.log('BASELINE_CONTRACT_REGRESSION_PASS');
