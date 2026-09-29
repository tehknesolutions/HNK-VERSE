import { parseKode, KodeSyntaxError } from './kode.ts';
import { analyzeKode } from './kode-semantic.ts';
import { KodeCompileError, sortDiagnostics, type KodeDiagnostic } from './kode-diagnostics.ts';
import { createDiagnosticReport } from './kode-report.ts';
import type { KodeCompileResult } from './kode-result.ts';
import type { MhcmProgram, MhcmProgramNode } from './program.ts';
import { pathToAst } from './ast.ts';
import { astToIr } from './ir.ts';

function compileAnalyzedKode(source: string): MhcmProgram {
  const ast = parseKode(source);
  const semantic = analyzeKode(ast);
  if (!semantic.ok) throw new KodeCompileError(sortDiagnostics(semantic.diagnostics));
  const nodes: MhcmProgramNode[] = [];
  for (const statement of ast.statements) {
    const semanticPath = semantic.model.semanticPaths.get(`PATH-${statement.name}`, 'path');
    if (!semanticPath) throw new Error(`Missing semantic path for ${statement.name}.`);
    nodes.push({ id: statement.name, kind: 'IR', ir: astToIr(pathToAst(semanticPath)) });
  }
  return { id: 'KODE-PROGRAM', version: '0.1', nodes, outputs: ast.statements.length ? [ast.statements.at(-1)!.name] : [] };
}

export function compileKode(source: string): MhcmProgram { return compileAnalyzedKode(source); }

export function tryCompileKode(source: string): KodeCompileResult {
  try {
    const program = compileAnalyzedKode(source);
    const report = createDiagnosticReport([]);
    return { ok: true, program, diagnostics: [], report };
  } catch (error) {
    const diagnostics: KodeDiagnostic[] = error instanceof KodeCompileError
      ? sortDiagnostics(error.diagnostics)
      : error instanceof KodeSyntaxError
        ? [{ code: 'E_SYNTAX', severity: 'error', message: error.message, span: error.span, relatedSpans: [] }]
        : (() => { throw error; })();
    return { ok: false, program: null, diagnostics, report: createDiagnosticReport(diagnostics) };
  }
}

export function compileKodeWithReport(source: string): KodeCompileResult { return tryCompileKode(source); }
