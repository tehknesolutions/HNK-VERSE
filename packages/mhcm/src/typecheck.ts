import type { HnkIrNode } from './ir.ts';
import type { MhcmOperator } from './ops.ts';

export type MhcmTypeError = { code: string; message: string };

export function typeCheckOperator(
  operator: MhcmOperator,
  inputs: HnkIrNode[],
): { ok: true } | { ok: false; errors: MhcmTypeError[] } {
  if (operator === 'PATH_REVERSE') {
    if (inputs.length !== 1) return { ok: false, errors: [{ code: 'ARITY', message: 'PATH_REVERSE requires exactly one input.' }] };
    if (inputs[0].type !== 'Path' || inputs[0].op !== 'PATH_LITERAL') {
      return { ok: false, errors: [{ code: 'TYPE', message: 'PATH_REVERSE requires PATH_LITERAL.' }] };
    }
    return { ok: true };
  }

  if (inputs.length !== 2) return { ok: false, errors: [{ code: 'ARITY', message: 'PATH_COMPOSE requires exactly two inputs.' }] };
  const invalid = inputs.filter((input) => input.type !== 'Path' || input.op !== 'PATH_LITERAL');
  if (invalid.length) return { ok: false, errors: [{ code: 'TYPE', message: 'PATH_COMPOSE requires two PATH_LITERAL inputs.' }] };

  const left = inputs[0].value;
  const right = inputs[1].value;
  if (String(left.end) !== String(right.start)) {
    return { ok: false, errors: [{ code: 'CONNECTIVITY', message: 'PATH_COMPOSE requires contiguous paths.' }] };
  }

  return { ok: true };
}
