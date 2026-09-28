import { parseKode, type KodeProgram } from './kode.ts';
import { astToIr, pathToAst } from './ast.ts';
import { createProvenance, type Path } from './model.ts';
import type { MhcmProgram } from './program.ts';
import { KodeCompileError, type KodeDiagnostic } from './kode-diagnostics.ts';
import type { KodeCompileResult } from './kode-result.ts';

type StaticPath = { start: string; end: string; nodes: string[] };

export function compileKode(source: string): MhcmProgram {
  const diagnostics: KodeDiagnostic[] = [];
  let ast: KodeProgram;
  try {
    ast = parseKode(source);
  } catch (error) {
    throw new KodeCompileError([{ code: 'E_SYNTAX', message: error instanceof Error ? error.message : String(error) }]);
  }

  const nodes: MhcmProgram['nodes'] = [];
  const symbols = new Map<string, string>();
  const paths = new Map<string, StaticPath>();
  const declared = new Set<string>();

  for (const statement of ast.statements) {
    if (declared.has(statement.name)) {
      diagnostics.push({ code: 'E_DUPLICATE', message: `Duplicate KODE symbol "${statement.name}".` });
      continue;
    }

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
      paths.set(statement.name, { start: path.start, end: path.end, nodes: [...path.nodes] });
      symbols.set(statement.name, statement.name);
    } else if (statement.kind === 'ReverseStatement') {
      const input = symbols.get(statement.source);
      const staticPath = paths.get(statement.source);
      if (!input || !staticPath) {
        diagnostics.push({ code: 'E_SYMBOL', message: `Unknown KODE symbol "${statement.source}".` });
      } else {
        nodes.push({ id: statement.name, kind: 'OPERATOR', operator: 'PATH_REVERSE', inputs: [input] });
        paths.set(statement.name, {
          start: staticPath.end,
          end: staticPath.start,
          nodes: [...staticPath.nodes].reverse(),
        });
      }
      symbols.set(statement.name, statement.name);
    } else {
      const left = symbols.get(statement.left);
      const right = symbols.get(statement.right);
      const leftPath = paths.get(statement.left);
      const rightPath = paths.get(statement.right);

      if (!left || !right || !leftPath || !rightPath) {
        diagnostics.push({ code: 'E_SYMBOL', message: `Unknown KODE symbol in compose "${statement.name}".` });
      } else if (leftPath.end !== rightPath.start) {
        diagnostics.push({
          code: 'E_CONNECTIVITY',
          message: `Cannot compose "${statement.left}" ending at "${leftPath.end}" with "${statement.right}" starting at "${rightPath.start}".`,
        });
      } else {
        nodes.push({ id: statement.name, kind: 'OPERATOR', operator: 'PATH_COMPOSE', inputs: [left, right] });
        paths.set(statement.name, {
          start: leftPath.start,
          end: rightPath.end,
          nodes: [...leftPath.nodes, ...rightPath.nodes.slice(1)],
        });
      }
      symbols.set(statement.name, statement.name);
    }

    declared.add(statement.name);
  }

  if (diagnostics.length) throw new KodeCompileError(diagnostics);

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
      diagnostics: [{ code: 'E_SYNTAX', message: error instanceof Error ? error.message : String(error) }],
    };
  }
}
