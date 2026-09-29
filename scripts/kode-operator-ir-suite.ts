import { analyzeKode, compileKode, executeMhcmProgram, parseKode } from '../packages/mhcm/src/index.ts';

const source = [
  'path A = A -> B;',
  'path B = B -> C;',
  'compose C = A, B;',
  'reverse R = C;',
].join('\n');

const program = compileKode(source);
if (program.version !== '0.1') throw new Error('KODE program version changed.');
if (program.typeSystemVersion !== 'kode-types-v0.1.0') throw new Error('Compiled program lost type-system version provenance.');
if (program.nodes.length !== 4) throw new Error('Unexpected KODE program node count.');

const composed = program.nodes.find((node) => node.id === 'C');
if (!composed || composed.kind !== 'OPERATOR' || composed.operator !== 'PATH_COMPOSE') {
  throw new Error('Compose did not lower to PATH_COMPOSE.');
}
if (composed.inputs.map((ref) => `${ref.namespace}:${ref.id}`).join(',') !== 'path:A,path:B') throw new Error('Compose inputs changed.');
if (composed.resultType !== 'OperatorResultPath' || program.semanticPaths.get(composed.semanticPathRef.id, composed.semanticPathRef.namespace)?.nodes.join(',') !== 'A,B,C') throw new Error('Compose semantic PathValue was not lowered.');

const reversed = program.nodes.find((node) => node.id === 'R');
if (!reversed || reversed.kind !== 'OPERATOR' || reversed.operator !== 'PATH_REVERSE') {
  throw new Error('Reverse did not lower to PATH_REVERSE.');
}
if (reversed.inputs[0].namespace !== 'path' || reversed.inputs[0].id !== 'C') throw new Error('Reverse input changed.');
if (reversed.resultType !== 'OperatorResultPath' || program.semanticPaths.get(reversed.semanticPathRef.id, reversed.semanticPathRef.namespace)?.nodes.join(',') !== 'C,B,A') throw new Error('Reverse semantic PathValue was not lowered.');

const result = executeMhcmProgram(program);
const output = result.outputs[0];
const nodes = output.value.nodes as string[];
const edges = output.value.edges as string[];

if (nodes.join(',') !== 'C,B,A') throw new Error(`Unexpected final nodes: ${nodes.join(',')}`);
if (edges.join(',') !== 'B->C,A->B') throw new Error(`Unexpected final edges: ${edges.join(',')}`);
if (output.value.start !== 'C' || output.value.end !== 'A') throw new Error('Final path endpoints mismatch.');
if (output.inputs.length !== 1 || output.inputs[0] !== 'IR-A-COMPOSE-IR-B') {
  throw new Error('Reverse IR input identity mismatch.');
}

console.log('KODE-0.2 operator IR suite: PASS');
console.log('PASS KODE compose → PATH_COMPOSE');
console.log('PASS KODE reverse → PATH_REVERSE');
console.log('PASS compile graph → MHCM program execution');
console.log('PASS final composed/reversed Path IR');

const ast = parseKode(source);
if (ast.statements[2].kind !== 'ComposeStatement' || ast.statements[2].left.ref.kind !== 'unresolved' || ast.statements[2].left.ref.namespace !== 'path' || ast.statements[2].left.ref.id !== 'A' || ast.statements[2].right.ref.id !== 'B') throw new Error('AST SemanticRef contract failed.');
const semantic = analyzeKode(ast);
if (!semantic.ok) throw new Error('Semantic model failed for shared PathValue proof.');
const semanticC = semantic.model.semanticPaths.get('PATH-C', 'path');
if (!semanticC || semanticC.id !== 'PATH-C' || semanticC.nodes.join(',') !== 'A,B,C' || semanticC.edges.join(',') !== 'A->B,B->C') {
  throw new Error('Semantic PathValue diverged from canonical path representation.');
}
if (semanticC.provenance.source !== 'HNK-KODE') throw new Error('Semantic PathValue provenance mismatch.');
if (semantic.model.semanticSymbols.get('C', 'path')?.ref.kind !== 'resolved') throw new Error('Semantic analyzer did not resolve declaration reference.');
console.log('PASS semantic model uses shared PathValue');

const registry = program.semanticPaths;
if (!registry.has('PATH-C', 'path') || !registry.has('PATH-R', 'path')) throw new Error('Semantic PathValue registry lookup failed.');
if (registry.get('PATH-C', 'path')?.nodes.join(',') !== 'A,B,C') throw new Error('Registry returned incorrect compose PathValue.');
console.log('PASS semantic PathValue registry API');

const incompatible = { ...program, typeSystemVersion: 'kode-types-v0.0.0' as typeof program.typeSystemVersion };
let rejectedVersion = false;
try { executeMhcmProgram(incompatible); } catch (error) { rejectedVersion = error instanceof Error && error.message.includes('Incompatible KODE type-system version'); }
if (!rejectedVersion) throw new Error('Runtime accepted an incompatible type-system version.');
console.log('PASS type-system version compatibility gate');
