import { compileKode, parseKode, tryCompileKode } from '../packages/mhcm/src/index.ts';

const fixtures = [
  'path A = A -> B;',
  'path A = A -> B; path B = B -> C; compose C = A, B;',
  'path A = A -> B; reverse R = A;',
  'path A = A -> B; path B = B -> C; compose C = A, B; reverse R = C;',
];

for (const source of fixtures) {
  const parsed = parseKode(source);
  const compiled = compileKode(source);
  const result = tryCompileKode(source);
  if (parsed.kind !== 'Program') throw new Error('KODE-0.1 parse compatibility failed.');
  if (compiled.id !== 'KODE-PROGRAM' || compiled.version !== '0.1') throw new Error('KODE-0.1 compiler contract changed.');
  if (!result.ok || result.report.errorCount !== 0 || result.diagnostics.length !== 0) {
    throw new Error('KODE-0.1 valid source no longer compiles cleanly.');
  }
}

const invalid = tryCompileKode('path A = A -> B; path Z = Z -> W; compose C = A, Z;');
if (invalid.ok || invalid.report.errorCount !== 1 || invalid.diagnostics[0].code !== 'E_CONNECTIVITY') {
  throw new Error('KODE-0.1 negative compatibility changed.');
}

console.log('KODE-0.2 compatibility suite: PASS');
console.log('PASS KODE-0.1 valid programs');
console.log('PASS KODE-0.1 compiler contract');
console.log('PASS KODE-0.1 invalid connectivity semantics');
