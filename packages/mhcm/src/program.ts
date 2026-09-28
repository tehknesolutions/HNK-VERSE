import type { HnkIrNode } from './ir.ts';
import { executeMhcmOperator } from './executor.ts';

export type MhcmProgramNode =
  | { id: string; kind: 'IR'; ir: HnkIrNode }
  | { id: string; kind: 'OPERATOR'; operator: 'PATH_REVERSE' | 'PATH_COMPOSE'; inputs: string[] };

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
    values.set(node.id, result);
  }

  const outputs = program.outputs.map((outputId) => {
    const value = values.get(outputId);
    if (!value) throw new Error(`Program output ${outputId} is unavailable.`);
    return value;
  });

  return { values, outputs };
}
