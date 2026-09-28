export type KodeDiagnostic = {
  code: 'E_SYNTAX' | 'E_SYMBOL' | 'E_ARITY' | 'E_CONNECTIVITY' | 'E_DUPLICATE';
  message: string;
  position?: number;
  span?: { start: number; end: number };
};

export class KodeCompileError extends Error {
  constructor(public readonly diagnostics: KodeDiagnostic[]) {
    super(diagnostics.map((d) => d.message).join('\n'));
    this.name = 'KodeCompileError';
  }
}
