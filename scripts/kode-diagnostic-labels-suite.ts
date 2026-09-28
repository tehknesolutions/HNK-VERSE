import { diagnostic } from '../packages/mhcm/src/index.ts';
import { parseKode } from '../packages/mhcm/src/index.ts';

const source = 'path A = A -> B;\npath Z = Z -> W;\ncompose C = A, Z;';
const ast = parseKode(source);
const statement = ast.statements[2];
if (statement.kind !== 'ComposeStatement') throw new Error('Expected compose statement.');

const result = diagnostic(
  'E_CONNECTIVITY',
  'test diagnostic',
  statement.left.span,
  [
    { label: 'left operand', span: statement.left.span },
    { label: 'right operand', span: statement.right.span },
  ],
);

if (result.relatedSpans?.length !== 2) throw new Error('Diagnostic labels were not preserved.');
if (result.relatedSpans[0].label !== 'left operand' || result.relatedSpans[1].label !== 'right operand') {
  throw new Error('Diagnostic label semantics mismatch.');
}
if (result.span?.start !== statement.left.span.start) throw new Error('Primary diagnostic span mismatch.');

console.log('KODE-0.2 diagnostic-label suite: PASS');
console.log('PASS generalized diagnostic labels');
console.log('PASS primary span');
console.log('PASS related spans');
