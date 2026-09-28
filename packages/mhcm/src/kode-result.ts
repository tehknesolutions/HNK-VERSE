import type { MhcmProgram } from './program.ts';
import type { KodeDiagnostic } from './kode-diagnostics.ts';

export type KodeCompileSuccess = {
  ok: true;
  program: MhcmProgram;
  diagnostics: [];
};

export type KodeCompileFailure = {
  ok: false;
  program: null;
  diagnostics: KodeDiagnostic[];
};

export type KodeCompileResult = KodeCompileSuccess | KodeCompileFailure;
