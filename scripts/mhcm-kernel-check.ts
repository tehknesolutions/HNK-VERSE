import {
  createProvenance,
  deserializePath,
  projectPathToGlyph,
  serializePath,
  validatePath,
  pathToAst,
  glyphToAst,
  astToIr,
  MHCM_SCHEMA_VERSION,
  HNK_IR_SCHEMA_VERSION,
  irToRuntimeManifestation,
  reversePathIr,
  composePathIr,
  operatorToIr,
  typeCheckOperator,
  executeMhcmOperator,
  type Cell,
  type Edge,
  type Path,
} from '../packages/mhcm/src/index.ts';

const provenance = createProvenance(
  'MHCM-KERNEL-CHECK',
  ['HNK-MHCM-V0.1'],
  'EXPERIMENTAL',
  'mhcm-kernel-check@0.1.0',
);

const cells: Cell[] = ['A', 'B', 'C'].map((id, index) => ({
  id,
  address: { namespace: 'fixture', coordinate: String(index), version: '0.1.0' },
  provenance,
}));

const edges: Edge[] = [
  { id: 'AB', source: 'A', target: 'B', relation: 'adjacent', directed: true, provenance },
  { id: 'BC', source: 'B', target: 'C', relation: 'adjacent', directed: true, provenance },
];

const path: Path = {
  id: 'PATH-ABC',
  start: 'A',
  nodes: ['A', 'B', 'C'],
  edges: ['AB', 'BC'],
  end: 'C',
  directed: true,
  provenance,
};

const valid = validatePath(cells, edges, path);
if (valid.status !== 'PASS') throw new Error(JSON.stringify(valid));

const invalid = validatePath(cells, edges, { ...path, edges: ['BC', 'AB'] });
if (invalid.status !== 'FAIL') throw new Error('Expected invalid topology to fail.');

const serialized = serializePath(path);
const roundTrip = deserializePath(serialized);
if (serializePath(roundTrip) !== serialized) throw new Error('Canonical serialization is not stable.');

const glyph = projectPathToGlyph(path);
if (glyph.id !== 'GLYPH-PATH-ABC') throw new Error('Unexpected glyph id.');
if (glyph.path !== serialized) throw new Error('Glyph path projection is not deterministic.');
if (glyph.encoding !== 'MHCM-PATH-JSON-V1') throw new Error('Unexpected glyph encoding.');

const pathAst = pathToAst(path);
if (pathAst.kind !== 'PathExpression') throw new Error('Path AST kind mismatch.');

const pathIr = astToIr(pathAst);
if (pathIr.type !== 'Path' || pathIr.op !== 'PATH_LITERAL') throw new Error('Path IR lowering mismatch.');
if (pathIr.id !== 'IR-PATH-ABC') throw new Error('Path IR id mismatch.');

const glyphAst = glyphToAst(glyph);
if (glyphAst.kind !== 'GlyphExpression') throw new Error('Glyph AST kind mismatch.');

const glyphIr = astToIr(glyphAst);
if (glyphIr.type !== 'Glyph' || glyphIr.op !== 'GLYPH_LITERAL') throw new Error('Glyph IR lowering mismatch.');
if (glyphIr.inputs[0] !== serialized) throw new Error('Glyph IR input mismatch.');

if (MHCM_SCHEMA_VERSION !== 1) throw new Error('Unexpected MHCM schema version.');
if (HNK_IR_SCHEMA_VERSION !== 1) throw new Error('Unexpected HNK-IR schema version.');

const reversed = reversePathIr(pathIr);
if (reversed.value.start !== 'C' || reversed.value.end !== 'A') throw new Error('Path reverse operator mismatch.');

const secondPath: Path = {
  ...path,
  id: 'PATH-CDE',
  start: 'C',
  nodes: ['C', 'D', 'E'],
  edges: ['CD', 'DE'],
  end: 'E',
};
const secondIr = astToIr(pathToAst(secondPath));
const composed = composePathIr(pathIr, secondIr);
if (JSON.stringify(composed.value.nodes) !== JSON.stringify(['A', 'B', 'C', 'D', 'E'])) {
  throw new Error('Path composition nodes mismatch.');
}
if (composed.inputs.length !== 2) throw new Error('Path composition inputs mismatch.');

const typeCheckedReverse = typeCheckOperator('PATH_REVERSE', [pathIr]);
if (!typeCheckedReverse.ok) throw new Error('PATH_REVERSE type check failed.');
const typeCheckedCompose = typeCheckOperator('PATH_COMPOSE', [pathIr, secondIr]);
if (!typeCheckedCompose.ok) throw new Error('PATH_COMPOSE type check failed.');
const invalidTypeCheck = typeCheckOperator('PATH_COMPOSE', [pathIr]);
if (invalidTypeCheck.ok) throw new Error('Invalid operator arity was accepted.');

const operatorIr = operatorToIr('PATH_COMPOSE', [pathIr, secondIr], pathIr.metadata.provenance);
if (operatorIr.op !== 'MHCM_OPERATOR' || operatorIr.inputs.length !== 2) throw new Error('Operator IR lowering mismatch.');

const executedCompose = executeMhcmOperator('PATH_COMPOSE', [pathIr, secondIr]);
if (executedCompose.result.value.end !== 'E') throw new Error('Operator executor result mismatch.');
if (executedCompose.result.inputs.length !== 2) throw new Error('Operator executor lost input provenance.');

const manifestation = irToRuntimeManifestation(glyphIr);
if (manifestation.commandType !== 'StartSession') throw new Error('Runtime boundary command mismatch.');
if (manifestation.irId !== glyphIr.id) throw new Error('Runtime boundary lost IR identity.');
if (manifestation.payload.irOp !== glyphIr.op) throw new Error('Runtime boundary lost IR operation.');

console.log('MHCM kernel check: PASS');
console.log('PASS valid topology');
console.log('PASS invalid topology rejection');
console.log('PASS canonical serialization round-trip');
console.log('PASS deterministic glyph projection');
console.log('PASS Path → AST');
console.log('PASS AST → HNK-IR');
console.log('PASS Glyph → AST → HNK-IR');
console.log('PASS schema versions');
console.log('PASS HNK-IR → HNK-VERSE runtime boundary');
console.log('PASS PATH_REVERSE operator');
console.log('PASS PATH_COMPOSE operator');
console.log('PASS operator type checking');
console.log('PASS operator → HNK-IR lowering');
console.log('PASS operator executor produces result IR');
