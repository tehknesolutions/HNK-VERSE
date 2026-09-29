import { KODE_TYPE_SYSTEM_VERSION } from './kode-types.ts';
import { HNK_IR_SCHEMA_VERSION, type HnkIrNode } from './ir.ts';
import type { MhcmProgram, MhcmProgramNode } from './program.ts';

export type ArtifactCompatibilityCode =
  | 'PROGRAM_TYPE_SYSTEM_MISMATCH'
  | 'NODE_TYPE_SYSTEM_MISMATCH'
  | 'IR_SCHEMA_MISMATCH'
  | 'IR_TYPE_SYSTEM_MISMATCH';

export type ArtifactCompatibilityAction = 'reject' | 'warn' | 'migrate';

export type ArtifactCompatibilitySeverity = 'error' | 'warning' | 'info';

export type ArtifactCompatibilityIssue = {
  code: ArtifactCompatibilityCode;
  artifactId: string;
  severity: ArtifactCompatibilitySeverity;
  action: ArtifactCompatibilityAction;
  message: string;
};

export type ArtifactCompatibilityResult =
  | { ok: true; issues: readonly [] }
  | { ok: false; issues: readonly ArtifactCompatibilityIssue[] };

export function validateProgramCompatibility(program: MhcmProgram): ArtifactCompatibilityResult {
  const issues: ArtifactCompatibilityIssue[] = [];
  if (program.typeSystemVersion !== KODE_TYPE_SYSTEM_VERSION) {
    issues.push({
      code: 'PROGRAM_TYPE_SYSTEM_MISMATCH',
      severity: 'error',
      action: 'reject',
      artifactId: program.id,
      message: `Program type-system version ${program.typeSystemVersion} is incompatible with ${KODE_TYPE_SYSTEM_VERSION}.`,
    });
  }

  for (const node of program.nodes) {
    const nodeResult = validateNodeCompatibility(node, program.typeSystemVersion);
    if (!nodeResult.ok) issues.push(...nodeResult.issues);
  }

  return issues.length ? { ok: false, issues } : { ok: true, issues: [] };
}

export function validateNodeCompatibility(
  node: MhcmProgramNode,
  programTypeSystemVersion: string,
): ArtifactCompatibilityResult {
  const issues: ArtifactCompatibilityIssue[] = [];

  if (node.typeSystemVersion !== programTypeSystemVersion) {
    issues.push({
      code: 'NODE_TYPE_SYSTEM_MISMATCH',
      severity: 'error',
      action: 'reject',
      artifactId: node.id,
      message: `Node ${node.id} type-system version ${node.typeSystemVersion} does not match program version ${programTypeSystemVersion}.`,
    });
  }

  if (node.kind === 'IR') {
    const irResult = validateIrCompatibility(node.ir, node.typeSystemVersion);
    if (!irResult.ok) issues.push(...irResult.issues);
  }

  return issues.length ? { ok: false, issues } : { ok: true, issues: [] };
}

export function validateIrCompatibility(ir: HnkIrNode, expectedTypeSystemVersion: string): ArtifactCompatibilityResult {
  const issues: ArtifactCompatibilityIssue[] = [];
  if (ir.irVersion !== HNK_IR_SCHEMA_VERSION) {
    issues.push({
      code: 'IR_SCHEMA_MISMATCH',
      severity: 'error',
      action: 'reject',
      artifactId: ir.id,
      message: `IR ${ir.id} schema version ${ir.irVersion} is incompatible with ${HNK_IR_SCHEMA_VERSION}.`,
    });
  }
  if (ir.metadata.typeSystemVersion !== expectedTypeSystemVersion) {
    issues.push({
      code: 'IR_TYPE_SYSTEM_MISMATCH',
      severity: 'error',
      action: 'reject',
      artifactId: ir.id,
      message: `IR ${ir.id} type-system version ${ir.metadata.typeSystemVersion} does not match expected version ${expectedTypeSystemVersion}.`,
    });
  }
  return issues.length ? { ok: false, issues } : { ok: true, issues: [] };
}

export function getCompatibilityAction(result: ArtifactCompatibilityResult): ArtifactCompatibilityAction {
  if (result.ok) return 'warn';
  if (result.issues.some((issue) => issue.action === 'reject')) return 'reject';
  if (result.issues.some((issue) => issue.action === 'migrate')) return 'migrate';
  return 'warn';
}

export function assertProgramCompatibility(program: MhcmProgram): void {
  const result = validateProgramCompatibility(program);
  if (!result.ok) throw new Error(`Incompatible MHCM artifact:\n${result.issues.map((issue) => `[${issue.code}] ${issue.message}`).join('\n')}`);
}
