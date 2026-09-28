import { tryCompileKode } from '../packages/mhcm/src/index.ts';

const invalid = 'path A = A -> ;';
const result = tryCompileKode(invalid);
if (result.ok) throw new Error('Expected syntax failure.');
const diagnostic = result.diagnostics.find((item) => item.code === 'E_SYNTAX');
if (!diagnostic?.span) throw new Error('Syntax diagnostic missing source span.');
if (diagnostic.span.startPosition.line !== 1) throw new Error('Syntax diagnostic line mismatch.');
if (diagnostic.span.startPosition.column < 1) throw new Error('Syntax diagnostic column mismatch.');

const unknown = 'path A = A -> B;\nreverse R = MISSING;';
const unknownResult = tryCompileKode(unknown);
if (unknownResult.ok) throw new Error('Expected semantic failure.');
const semantic = unknownResult.diagnostics.find((item) => item.code === 'E_SYMBOL');
if (!semantic?.span || semantic.span.startPosition.line !== 2) throw new Error('Semantic diagnostic span mismatch.');

console.log('KODE-0.2 diagnostic location suite: PASS');
console.log('PASS syntax diagnostic span');
console.log('PASS semantic diagnostic span');
