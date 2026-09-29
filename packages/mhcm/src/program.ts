import type { HnkIrNode } from './ir.ts';
import { SemanticRegistry, type PathValue, type SemanticRef } from './model.ts';
import { KODE_TYPE_SYSTEM_VERSION } from './kode-types.ts';
import { executeMhcmOperator } from './executor.ts';

export type MhcmProgramNode =
  | { id: string; kind: 'IR'; typeSystemVersion: typeof KODE_TYPE_SYSTEM_VERSION; ir: HnkIrNode }
  | { id: string; kind: 'OPERATOR'; typeSystemVersion: typeof KODE_TYPE_SYSTEM_VERSION; operator: 'PATH_REVERSE' | 'PATH_COMPOSE'; inputs: SemanticRef[]; resultType: 'OperatorResultPath'; semanticPathRef: SemanticRef };




export type MhcmProgram = {
  id: string;
  version: '0.1';
  typeSystemVersion: typeof KODE_TYPE_SYSTEM_VERSION;
  nodes: MhcmProgramNode[];
  outputs: string[];
  semanticPaths: SemanticRegistry<PathValue>;
};

export type MhcmProgramResult = {
  values: Map<string, HnkIrNode>;
  outputs: HnkIrNode[];
};

export function executeMhcmProgram(program: MhcmProgram): MhcmProgramResult {
  if (program.typeSystemVersion !== KODE_TYPE_SYSTEM_VERSION) throw new Error(`Incompatible KODE type-system version: ${program.typeSystemVersion}. Expected ${KODE_TYPE_SYSTEM_VERSION}.`);
  const values = new Map<string, HnkIrNode>();

  for (const node of program.nodes) {
    if (node.typeSystemVersion !== program.typeSystemVersion) throw new Error(`Node ${node.id} type-system version ${node.typeSystemVersion} does not match program version ${program.typeSystemVersion}.`);
    if (node.kind === 'IR' && node.ir.metadata.typeSystemVersion !== node.typeSystemVersion) throw new Error(`IR ${node.ir.id} type-system version ${node.ir.metadata.typeSystemVersion} does not match node version ${node.typeSystemVersion}.`);
    if (values.has(node.id)) throw new Error(`Duplicate program node id: ${node.id}`);

    if (node.kind === 'IR') {
      values.set(node.id, node.ir);
      continue;
    }

    const inputs = node.inputs.map((inputRef) => {
      const value = values.get(inputRef.id);
      if (!value) throw new Error(`Program input ${inputRef.namespace}:${inputRef.id} is unavailable.`);
      return value;
    });

    const result = executeMhcmOperator(node.operator, inputs).result;
    if (result.type !== 'Path' || result.op !== 'PATH_LITERAL') throw new Error(`Operator ${node.id} did not produce a Path literal.`);
    const expected = program.semanticPaths.get(node.semanticPathRef.id, node.semanticPathRef.namespace);
    if (!expected) throw new Error(`Semantic PathValue ${node.semanticPathRef.namespace}:${node.semanticPathRef.id} is unavailable.`);
    const actual = result.value;
    const actualNodes = Array.isArray(actual.nodes) ? actual.nodes.map(String) : [];
    const actualEdges = Array.isArray(actual.edges) ? actual.edges.map(String) : [];
    if (actualNodes.join('\u0000') !== expected.nodes.join('\u0000') || actualEdges.join('\u0000') !== expected.edges.join('\u0000') || String(actual.start) !== expected.start || String(actual.end) !== expected.end) {
      throw new Error(`Operator ${node.id} result diverged from semantic PathValue.`);
    }
    values.set(node.id, result);
  }

  const outputs = program.outputs.map((outputId) => {
    const value = values.get(outputId);
    if (!value) throw new Error(`Program output ${outputId} is unavailable.`);
    return value;
  });

  return { values, outputs };
}
