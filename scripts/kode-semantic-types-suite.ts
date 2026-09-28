import { analyzeKode, parseKode } from '../packages/mhcm/src/index.ts';

const program = parseKode(
  'path A = A -> B;\nreverse R = A;\ncompose C = A, R;',
);
const result = analyzeKode(program);
if (!result.ok) throw new Error('Expected typed semantic model to succeed.');

const a = result.model.symbols.get('A');
const r = result.model.symbols.get('R');
const c = result.model.symbols.get('C');

if (!a || a.type !== 'Path' || a.origin !== 'declaration') throw new Error('Path declaration type mismatch.');
if (!r || r.type !== 'OperatorResultPath' || r.origin !== 'operator') throw new Error('Reverse operator result type mismatch.');
if (!c || c.type !== 'OperatorResultPath' || c.origin !== 'operator') throw new Error('Compose operator result type mismatch.');

console.log('KODE-0.2 semantic-type suite: PASS');
console.log('PASS Path declaration type');
console.log('PASS reverse OperatorResultPath');
console.log('PASS compose OperatorResultPath');
