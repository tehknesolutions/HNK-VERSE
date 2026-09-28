import { tryCompileKode, parseKode } from '../packages/mhcm/src/index.ts';

const source = 'path A = A -> B;\nreverse R = MISSING;';
const ast = parseKode(source);
if (ast.statements[1].kind !== 'ReverseStatement') throw new Error('Unexpected AST statement.');
if (ast.statements[1].source.span.startPosition.line !== 2) throw new Error('Reference symbol line mismatch.');
if (ast.statements[1].source.span.startPosition.column !== 14) throw new Error(`Reference symbol column mismatch: ${ast.statements[1].source.span.startPosition.column}`);

const result = tryCompileKode(source);
if (result.ok) throw new Error('Expected semantic failure.');
const diagnostic = result.diagnostics.find((item) => item.code === 'E_SYMBOL');
if (!diagnostic?.span || diagnostic.span.start !== ast.statements[1].source.span.start) throw new Error('E_SYMBOL did not point to exact reference.');

const duplicate = tryCompileKode('path A = A -> B;\npath A = C -> D;');
if (duplicate.ok) throw new Error('Expected duplicate failure.');
const duplicateDiagnostic = duplicate.diagnostics.find((item) => item.code === 'E_DUPLICATE');
if (!duplicateDiagnostic?.span || duplicateDiagnostic.span.start !== parseKode('path A = A -> B;\npath A = C -> D;').statements[1].nameSpan.start) throw new Error('E_DUPLICATE did not point to declaration identifier.');

console.log('KODE-0.2 identifier-span suite: PASS');
console.log('PASS reference identifier span');
console.log('PASS E_SYMBOL exact span');
console.log('PASS E_DUPLICATE declaration span');
