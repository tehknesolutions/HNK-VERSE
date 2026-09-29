import { KODE_TYPE_SYSTEM_VERSION } from './kode-types.ts';
import { HNK_IR_SCHEMA_VERSION, type HnkIrNode } from './ir.ts';
import type { MhcmProgram, MhcmProgramNode } from './program.ts';

export type ArtifactCompatibilityResult =
  | { ok: true }
  | { ok: false; errors: string[] };

export function validateProgramCompatibility(program: MhcmProgram): ArtifactCompatibilityResult {
  const errors: string[] = [];
  if (program.typeSystemVersion !== KODE_TYPE_SYSTEM_VERSION) {
    errors.push(`Program type-system version ${program.typeSystemVersion} is incompatible with ${KODE_TYPE_SYSTEM_VERSION}.`);
  }

  for (const node of program.nodes) {
    const nodeResult = validateNodeCompatibility(node, program.typeSystemVersion);
    if (!nodeResult.ok) errors.push(...nodeResult.errors);
  }

  return errors.length ? { ok: false, errors } : { ok: true };
}

export function validateNodeCompatibility(
  node: MhcmProgramNode,
  programTypeSystemVersion: string,
): ArtifactCompatibilityResult {
  const errors: string[] = [];

  if (node.typeSystemVersion !== programTypeSystemVersion) {
    errors.push(`Node ${node.id} type-system version ${node.typeSystemVersion} does not match program version ${programTypeSystemVersion}.`);
  }

  if (node.kind === 'IR') {
    const irResult = validateIrCompatibility(node.ir, node.typeSystemVersion);
    if (!irResult.ok) errors.push(...irResult.errors);
  }

  return errors.length ? { ok: false, errors } : { ok: true };
}

export function validateIrCompatibility(ir: HnkIrNode, expectedTypeSystemVersion: string): ArtifactCompatibilityResult {
  const errors: string[] = [];
  if (ir.irVersion !== HNK_IR_SCHEMA_VERSION) {
    errors.push(`IR ${ir.id} schema version ${ir.irVersion} is incompatible with ${HNK_IR_SCHEMA_VERSION}.`);
  }
  if (ir.metadata.typeSystemVersion !== expectedTypeSystemVersion) {
    errors.push(`IR ${ir.id} type-system version ${ir.metadata.typeSystemVersion} does not match expected version ${expectedTypeSystemVersion}.`);
  }
  return errors.length ? { ok: false, errors } : { ok: true };
}

export function assertProgramCompatibility(program: MhcmProgram): void {
  const result = validateProgramCompatibility(program);
  if (!result.ok) throw new Error(`Incompatible MHCM artifact:\n${result.errors.join('\n')}`);
}
