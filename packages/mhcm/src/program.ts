import type { HnkIrNode } from './ir.ts';
import type { PathValue } from './model.ts';
import { executeMhcmOperator } from './executor.ts';

export type MhcmProgramNode =
  | { id: string; kind: 'IR'; ir: HnkIrNode }
  | { id: string; kind: 'OPERATOR'; operator: 'PATH_REVERSE' | 'PATH_COMPOSE'; inputs: string[]; resultType: 'OperatorResultPath'; semanticPath: PathValue };

export type MhcmProgram = {
  id: string;
  version: '0.1';
  nodes: MhcmProgramNode[];
  outputs: string[];
};

export type MhcmProgramResult = {
  values: Map<string, HnkIrNode>;
  outputs: HnkIrNode[];
};

export function executeMhcmProgram(program: MhcmProgram): MhcmProgramResult {
  const values = new Map<string, HnkIrNode>();

  for (const node of program.nodes) {
    if (values.has(node.id)) throw new Error(`Duplicate program node id: ${node.id}`);

    if (node.kind === 'IR') {
      values.set(node.id, node.ir);
      continue;
    }

    const inputs = node.inputs.map((inputId) => {
      const value = values.get(inputId);
      if (!value) throw new Error(`Program input ${inputId} is unavailable.`);
      return value;
    });

    const result = executeMhcmOperator(node.operator, inputs).result;
    if (result.type !== 'Path' || result.op !== 'PATH_LITERAL') throw new Error(`Operator ${node.id} did not produce a Path literal.`);
    const expected = node.semanticPath;
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
