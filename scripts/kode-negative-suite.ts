import { tryCompileKode } from '../packages/mhcm/src/index.ts';

function assertDiagnostic(source: string, code: string, label: string) {
  const result = tryCompileKode(source);
  if (result.ok) throw new Error(`${label}: expected compilation failure.`);
  if (!result.diagnostics.some((diagnostic) => diagnostic.code === code)) {
    throw new Error(`${label}: expected ${code}, got ${JSON.stringify(result.diagnostics)}`);
  }
}

assertDiagnostic('path A = A -> B', 'E_SYNTAX', 'missing semicolon');
assertDiagnostic('path A = A -> B; path A = B -> C;', 'E_DUPLICATE', 'duplicate symbol');
assertDiagnostic('reverse R = UNKNOWN;', 'E_SYMBOL', 'unknown reverse symbol');
assertDiagnostic('compose C = LEFT, RIGHT;', 'E_SYMBOL', 'unknown compose symbols');
assertDiagnostic('path A = A -> B; path Z = Z -> W; compose C = A, Z;', 'E_CONNECTIVITY', 'non-contiguous compose');

console.log('KODE-0 negative suite: PASS');
console.log('PASS syntax diagnostic');
console.log('PASS duplicate symbol diagnostic');
console.log('PASS unknown symbol diagnostic');
console.log('PASS compose symbol diagnostic');
console.log('PASS connectivity diagnostic');
