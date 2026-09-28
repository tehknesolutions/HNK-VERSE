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

const unresolved = program.statements[1].kind === 'ReverseStatement' ? program.statements[1].source.ref : null;
if (!unresolved || unresolved.kind !== 'unresolved') throw new Error('AST reference should remain unresolved before semantic analysis.');
if (!r?.ref || r.ref.kind !== 'resolved' || r.ref.namespace !== 'path' || r.ref.id !== 'R') throw new Error('Declaration semantic reference was not resolved.');
console.log('PASS semantic identity resolution');
