import { KodeSyntaxError, parseKode, type KodeProgram } from './kode.ts';
import { pathToAst } from './ast.ts';
import { astToIr } from './ir.ts';
import type { MhcmProgram } from './program.ts';
import { SemanticRegistry, createSemanticRef, type PathValue } from './model.ts';
import { KodeCompileError, diagnostic, sortDiagnostics } from './kode-diagnostics.ts';
import { analyzeKode } from './kode-semantic.ts';
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

  const semanticPaths = new SemanticRegistry<PathValue>();
  const nodes: MhcmProgram['nodes'] = [];
  const outputs: string[] = [];

  for (const statement of ast.statements) {
    const astPath = pathToAst({
      id: statement.name,
      start: statement.expression.nodes[0],
      nodes: statement.expression.nodes,
      edges: statement.expression.edges,
      end: statement.expression.nodes.at(-1) ?? statement.expression.nodes[0],
      directed: true,
      provenance: { source: 'HNK-KODE' },
    });
    const ir = astToIr(astPath);
    semanticPaths.register({
      namespace: 'kode', id: statement.name, kind: 'Path', version: '0.1',
      value: { start: astPath.start, nodes: [...astPath.nodes], edges: [...astPath.edges], end: astPath.end, directed: astPath.directed },
    });
    nodes.push({ id: statement.name, kind: 'IR', ir });
    outputs.push(statement.name);
  }

  return { id: 'KODE-PROGRAM', version: '0.1', nodes, outputs, semanticPaths };
}

export function compileKodeWithReport(source: string): KodeCompileResult {
  try {
    const program = compileKode(source);
    return { ok: true, program, report: createDiagnosticReport([]) };
  } catch (error) {
    if (error instanceof KodeCompileError) return { ok: false, diagnostics: error.diagnostics, report: createDiagnosticReport(error.diagnostics) };
    throw error;
  }
}

export function resolveKodePath(program: MhcmProgram, id: string) {
  return program.semanticPaths.get(id, 'kode');
}

export function kodePathRef(id: string) {
  return createSemanticRef('kode', id, 'Path', '0.1');
}
