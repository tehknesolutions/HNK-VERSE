import { tryCompileKode } from '../packages/mhcm/src/index.ts';

const invalidLeft = 'path A = A -> B;\npath Z = Z -> W;\ncompose C = MISSING, Z;';
const leftResult = tryCompileKode(invalidLeft);
if (leftResult.ok) throw new Error('Expected left symbol failure.');
const leftDiagnostic = leftResult.diagnostics.find((item) => item.code === 'E_SYMBOL');
if (!leftDiagnostic?.span || leftDiagnostic.message.indexOf('MISSING') < 0) throw new Error('Left E_SYMBOL was not pinpointed.');

const invalidRight = 'path A = A -> B;\ncompose C = A, MISSING;';
const rightResult = tryCompileKode(invalidRight);
if (rightResult.ok) throw new Error('Expected right symbol failure.');
const rightDiagnostic = rightResult.diagnostics.find((item) => item.code === 'E_SYMBOL');
if (!rightDiagnostic?.span || rightDiagnostic.message.indexOf('MISSING') < 0) throw new Error('Right E_SYMBOL was not pinpointed.');

const disconnected = 'path A = A -> B;\npath Z = Z -> W;\ncompose C = A, Z;';
const connectivity = tryCompileKode(disconnected);
if (connectivity.ok) throw new Error('Expected connectivity failure.');
const diagnostic = connectivity.diagnostics.find((item) => item.code === 'E_CONNECTIVITY');
if (!diagnostic?.relatedSpans || diagnostic.relatedSpans.length !== 2) throw new Error('Connectivity diagnostic missing operand spans.');
if (diagnostic.relatedSpans[0].label !== 'left operand' || diagnostic.relatedSpans[1].label !== 'right operand') {
  throw new Error('Connectivity operand labels mismatch.');
}
if (diagnostic.span?.start !== diagnostic.relatedSpans[0].span.start) throw new Error('Primary connectivity span must target left operand.');

console.log('KODE-0.2 operand diagnostic suite: PASS');
console.log('PASS left operand symbol span');
console.log('PASS right operand symbol span');
console.log('PASS connectivity left/right related spans');
