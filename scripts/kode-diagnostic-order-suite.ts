import { diagnostic, sortDiagnostics } from '../packages/mhcm/src/index.ts';

const a = diagnostic('E_SYMBOL', 'b', { start: 20, end: 21, startPosition: { offset: 20, line: 2, column: 1 }, endPosition: { offset: 21, line: 2, column: 2 } });
const b = diagnostic('E_DUPLICATE', 'a', { start: 5, end: 6, startPosition: { offset: 5, line: 1, column: 6 }, endPosition: { offset: 6, line: 1, column: 7 } });
const c = diagnostic('E_SYNTAX', 'c', { start: 5, end: 7, startPosition: { offset: 5, line: 1, column: 6 }, endPosition: { offset: 7, line: 1, column: 8 } });

const sorted = sortDiagnostics([a, c, b]);
if (sorted[0].code !== 'E_DUPLICATE' || sorted[1].code !== 'E_SYNTAX' || sorted[2].code !== 'E_SYMBOL') {
  throw new Error('Diagnostic ordering is not deterministic by source position/code.');
}
if (sorted.some((item) => item.severity !== 'error')) throw new Error('Default diagnostic severity must be error.');

console.log('KODE-0.2 diagnostic ordering suite: PASS');
console.log('PASS source-position ordering');
console.log('PASS deterministic tie-break');
console.log('PASS default severity');
