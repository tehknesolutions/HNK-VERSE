import { analyzeKode, compileKode, executeMhcmProgram, parseKode } from '../packages/mhcm/src/index.ts';

const source = [
  'path A = A -> B;',
  'path B = B -> C;',
  'compose C = A, B;',
  'reverse R = C;',
].join('\n');

const program = compileKode(source);
if (program.version !== '0.1') throw new Error('KODE program version changed.');
if (program.nodes.length !== 4) throw new Error('Unexpected KODE program node count.');

const composed = program.nodes.find((node) => node.id === 'C');
if (!composed || composed.kind !== 'OPERATOR' || composed.operator !== 'PATH_COMPOSE') {
  throw new Error('Compose did not lower to PATH_COMPOSE.');
}
if (composed.inputs.join(',') !== 'A,B') throw new Error('Compose inputs changed.');
if (composed.resultType !== 'OperatorResultPath' || composed.semanticPath.nodes.join(',') !== 'A,B,C') throw new Error('Compose semantic PathValue was not lowered.');

const reversed = program.nodes.find((node) => node.id === 'R');
if (!reversed || reversed.kind !== 'OPERATOR' || reversed.operator !== 'PATH_REVERSE') {
  throw new Error('Reverse did not lower to PATH_REVERSE.');
}
if (reversed.inputs[0] !== 'C') throw new Error('Reverse input changed.');
if (reversed.resultType !== 'OperatorResultPath' || reversed.semanticPath.nodes.join(',') !== 'C,B,A') throw new Error('Reverse semantic PathValue was not lowered.');

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

const semantic = analyzeKode(parseKode(source));
if (!semantic.ok) throw new Error('Semantic model failed for shared PathValue proof.');
const semanticC = semantic.model.paths.get('C');
if (!semanticC || semanticC.id !== 'PATH-C' || semanticC.nodes.join(',') !== 'A,B,C' || semanticC.edges.join(',') !== 'A->B,B->C') {
  throw new Error('Semantic PathValue diverged from canonical path representation.');
}
if (semanticC.provenance.source !== 'HNK-KODE') throw new Error('Semantic PathValue provenance mismatch.');
console.log('PASS semantic model uses shared PathValue');
