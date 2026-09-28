import { tryCompileKode } from '../packages/mhcm/src/index.ts';

const valid = tryCompileKode('path A = A -> B;');
if (!valid.ok || valid.report.errorCount !== 0 || valid.report.diagnostics.length !== 0) {
  throw new Error('Valid compile report contract failed.');
}

const invalid = tryCompileKode('path A = A -> ;');
if (invalid.ok || invalid.report.errorCount !== 1 || invalid.report.diagnostics.length !== 1) {
  throw new Error('Invalid compile report contract failed.');
}
if (invalid.report.diagnostics[0].code !== 'E_SYNTAX') throw new Error('Report diagnostic code mismatch.');
if (!invalid.report.diagnostics[0].span) throw new Error('Report lost syntax span.');

console.log('KODE-0.2 compile-report API suite: PASS');
console.log('PASS valid compile report');
console.log('PASS invalid compile report');
console.log('PASS report preserves diagnostic span');
