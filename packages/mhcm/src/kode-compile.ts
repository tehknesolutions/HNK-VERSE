import { KodeSyntaxError, parseKode, type KodeProgram } from './kode.ts';
import { astToIr, pathToAst } from './ast.ts';
import { createProvenance, type Path } from './model.ts';
import type { MhcmProgram } from './program.ts';
import { KodeCompileError } from './kode-diagnostics.ts';
import { analyzeKode } from './kode-semantic.ts';
import type { KodeCompileResult } from './kode-result.ts';

type StaticPath = { start: string; end: string; nodes: string[] };

export function compileKode(source: string): MhcmProgram {
  let ast: KodeProgram;
  try {
    ast = parseKode(source);
  } catch (error) {
    throw new KodeCompileError([{
      code: 'E_SYNTAX',
      message: error instanceof Error ? error.message : String(error),
      span: error instanceof KodeSyntaxError ? error.span : undefined,
    }]);
  }

  const analysis = analyzeKode(ast);
  if (!analysis.ok) throw new KodeCompileError(analysis.diagnostics);

  const nodes: MhcmProgram['nodes'] = [];
  for (const statement of ast.statements) {
    if (statement.kind === 'PathDeclaration') {
      const provenance = createProvenance('HNK-KODE-KODE0', ['KODE-0'], 'EXPERIMENTAL', 'kode-0@0.1.0');
      const path: Path = {
        id: `PATH-${statement.name}`,
        start: statement.nodes[0],
        nodes: statement.nodes,
        edges: statement.nodes.slice(0, -1).map((_, i) => `${statement.nodes[i]}->${statement.nodes[i + 1]}`),
        end: statement.nodes[statement.nodes.length - 1],
        directed: true,
        provenance,
      };
      nodes.push({ id: statement.name, kind: 'IR', ir: astToIr(pathToAst(path)) });
    } else if (statement.kind === 'ReverseStatement') {
      nodes.push({ id: statement.name, kind: 'OPERATOR', operator: 'PATH_REVERSE', inputs: [statement.source] });
    } else {
      nodes.push({ id: statement.name, kind: 'OPERATOR', operator: 'PATH_COMPOSE', inputs: [statement.left, statement.right] });
    }
  }

  return {
    id: 'KODE-PROGRAM',
    version: '0.1',
    nodes,
    outputs: nodes.length ? [nodes[nodes.length - 1].id] : [],
  };
}
export function tryCompileKode(source: string): KodeCompileResult {
  try {
    return { ok: true, program: compileKode(source), diagnostics: [] };
  } catch (error) {
    if (error instanceof KodeCompileError) return { ok: false, program: null, diagnostics: error.diagnostics };
    return {
      ok: false,
      program: null,
      diagnostics: [{ code: 'E_SYNTAX', message: error instanceof Error ? error.message : String(error), span: error instanceof KodeSyntaxError ? error.span : undefined }],
    };
  }
}
