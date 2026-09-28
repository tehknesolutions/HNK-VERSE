import type { KodeSpan } from './kode.ts';

export type KodeDiagnosticSeverity = 'error' | 'warning' | 'info';

export type KodeDiagnosticLabel = {
  label: string;
  span: KodeSpan;
};

export type KodeDiagnostic = {
  code: 'E_SYNTAX' | 'E_SYMBOL' | 'E_ARITY' | 'E_CONNECTIVITY' | 'E_DUPLICATE';
  severity: KodeDiagnosticSeverity;
  message: string;
  position?: number;
  span?: KodeSpan;
  relatedSpans?: KodeDiagnosticLabel[];
};

export function diagnostic(
  code: KodeDiagnostic['code'],
  message: string,
  span?: KodeSpan,
  relatedSpans: KodeDiagnosticLabel[] = [],
  severity: KodeDiagnosticSeverity = 'error',
): KodeDiagnostic {
  return { code, severity, message, span, relatedSpans };
}

function diagnosticOffset(d: KodeDiagnostic): number {
  return d.span?.start ?? d.position ?? Number.MAX_SAFE_INTEGER;
}

export function sortDiagnostics(diagnostics: KodeDiagnostic[]): KodeDiagnostic[] {
  return [...diagnostics].sort((a, b) =>
    diagnosticOffset(a) - diagnosticOffset(b) ||
    a.code.localeCompare(b.code) ||
    a.message.localeCompare(b.message),
  );
}

export class KodeCompileError extends Error {
  constructor(public readonly diagnostics: KodeDiagnostic[]) {
    super(diagnostics.map((d) => d.message).join('\n'));
    this.name = 'KodeCompileError';
  }
}
