import { composePathIr, reversePathIr } from './ops.ts';
import type { HnkIrNode } from './ir.ts';
import { typeCheckOperator } from './typecheck.ts';

export type MhcmExecutionResult = {
  result: HnkIrNode;
  operator: 'PATH_REVERSE' | 'PATH_COMPOSE';
};

export function executeMhcmOperator(
  operator: 'PATH_REVERSE' | 'PATH_COMPOSE',
  inputs: HnkIrNode[],
): MhcmExecutionResult {
  const checked = typeCheckOperator(operator, inputs);
  if (!checked.ok) throw new Error(checked.errors.map((error) => error.message).join('; '));

  if (operator === 'PATH_REVERSE') {
    return { operator, result: reversePathIr(inputs[0]) };
  }

  return { operator, result: composePathIr(inputs[0], inputs[1]) };
}
