import type { HnkIrNode } from './ir.ts';
import { executeMhcmOperator, type MhcmExecutionResult } from './executor.ts';

export type MhcmStep =
  | { kind: 'IR'; node: HnkIrNode }
  | { kind: 'OPERATOR'; operator: 'PATH_REVERSE' | 'PATH_COMPOSE'; inputs: number[] };

export type MhcmPipelineResult = {
  nodes: HnkIrNode[];
  results: HnkIrNode[];
};

export function executeMhcmPipeline(steps: MhcmStep[]): MhcmPipelineResult {
  const nodes: HnkIrNode[] = [];
  const results: HnkIrNode[] = [];

  for (const step of steps) {
    if (step.kind === 'IR') {
      nodes.push(step.node);
      continue;
    }

    const inputs = step.inputs.map((index) => {
      const node = nodes[index];
      if (!node) throw new Error(`Pipeline input ${index} does not exist.`);
      return node;
    });

    const execution: MhcmExecutionResult = executeMhcmOperator(step.operator, inputs);
    nodes.push(execution.result);
    results.push(execution.result);
  }

  return { nodes, results };
}
