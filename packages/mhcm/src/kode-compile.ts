import { KodeSyntaxError, parseKode, type KodeProgram } from './kode.ts';
import { pathToAst } from './ast.ts';
import { astToIr } from './ir.ts';
import type { MhcmProgram } from './program.ts';
import { createSemanticRef, SemanticRegistry, type PathValue } from './model.ts';
import { KodeCompileError, diagnostic, sortDiagnostics } from './kode-diagnostics.ts';
import { analyzeKode } from './kode-semantic.ts';
import { KODE_TYPE_SYSTEM_VERSION } from './kode-types.ts';
import type { KodeCompileResult } from './kode-result.ts';
import { createDiagnosticReport } from './kode-report.ts';

export function compileKode(source: string): MhcmProgram {
  let ast: KodeProgram;
  try {
    ast = parseKode(source);
  } catch (error) {
    throw new KodeCompileError([diagnostic('E_SYNTAX', error instanceof Error ? error.message : String(error), error instanceof KodeSyntaxError ? error.span : undefined)]);
  }

  const analysis = analyzeKode(ast);
  if (!analysis.ok) throw new KodeCompileError(sortDiagnostics(analysis.diagnostics));

  const nodes: MhcmProgram['nodes'] = [];
  const semanticPaths = new SemanticRegistry<PathValue>();
  for (const statement of ast.statements) {
    if (statement.kind === 'PathDeclaration') {
      const path = analysis.model.semanticPaths.get(`PATH-${statement.name}`, 'path');
      if (!path) throw new Error(`Semantic PathValue missing for "${statement.name}".`);
      semanticPaths.register(path, 'path');
      nodes.push({ id: statement.name, kind: 'IR', typeSystemVersion: KODE_TYPE_SYSTEM_VERSION, ir: astToIr(pathToAst(path)) });
    } else if (statement.kind === 'ReverseStatement') {
      const semanticPath = analysis.model.semanticPaths.get(`PATH-${statement.name}`, 'path');
      if (!semanticPath) throw new Error(`Semantic PathValue missing for operator result "${statement.name}".`);
      semanticPaths.register(semanticPath, 'path');
      nodes.push({ id: statement.name, kind: 'OPERATOR', typeSystemVersion: KODE_TYPE_SYSTEM_VERSION, operator: 'PATH_REVERSE', inputs: [createSemanticRef('path', statement.source.name)], resultType: 'OperatorResultPath', semanticPathRef: createSemanticRef('path', semanticPath.id) });
    } else {
      const semanticPath = analysis.model.semanticPaths.get(`PATH-${statement.name}`, 'path');
      if (!semanticPath) throw new Error(`Semantic PathValue missing for operator result "${statement.name}".`);
      semanticPaths.register(semanticPath, 'path');
      nodes.push({ id: statement.name, kind: 'OPERATOR', typeSystemVersion: KODE_TYPE_SYSTEM_VERSION, operator: 'PATH_COMPOSE', inputs: [createSemanticRef('path', statement.left.name), createSemanticRef('path', statement.right.name)], resultType: 'OperatorResultPath', semanticPathRef: createSemanticRef('path', semanticPath.id) });
    }
  }

  return {
    id: 'KODE-PROGRAM',
    version: '0.1',
    typeSystemVersion: KODE_TYPE_SYSTEM_VERSION,
    nodes,
    outputs: nodes.length ? [nodes[nodes.length - 1].id] : [],
    semanticPaths,
  };
}
export function tryCompileKode(source: string): KodeCompileResult {
  try {
    const program = compileKode(source);
    return { ok: true, program, diagnostics: [], report: createDiagnosticReport([]) };
  } catch (error) {
    if (error instanceof KodeCompileError) {
      const diagnostics = sortDiagnostics(error.diagnostics);
      return { ok: false, program: null, diagnostics, report: createDiagnosticReport(diagnostics) };
    }
    const diagnostics = [diagnostic('E_SYNTAX', error instanceof Error ? error.message : String(error), error instanceof KodeSyntaxError ? error.span : undefined)];
    return { ok: false, program: null, diagnostics, report: createDiagnosticReport(diagnostics) };
  }
}
