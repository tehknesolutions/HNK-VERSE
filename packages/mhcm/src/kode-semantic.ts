import type { KodeProgram, KodeStatement } from './kode.ts';
import type { KodeDiagnostic } from './kode-diagnostics.ts';

export type KodeStaticPath = { start: string; end: string; nodes: string[] };

export type KodeSemanticModel = {
  program: KodeProgram;
  paths: Map<string, KodeStaticPath>;
  symbols: Map<string, string>;
};

export function analyzeKode(program: KodeProgram): { ok: true; model: KodeSemanticModel; diagnostics: [] } | { ok: false; model: null; diagnostics: KodeDiagnostic[] } {
  const diagnostics: KodeDiagnostic[] = [];
  const paths = new Map<string, KodeStaticPath>();
  const symbols = new Map<string, string>();
  const declared = new Set<string>();

  for (const statement of program.statements) {
    if (declared.has(statement.name)) {
      diagnostics.push({ code: 'E_DUPLICATE', message: `Duplicate KODE symbol "${statement.name}".`, span: statement.span });
      continue;
    }

    if (statement.kind === 'PathDeclaration') {
      paths.set(statement.name, { start: statement.nodes[0], end: statement.nodes[statement.nodes.length - 1], nodes: [...statement.nodes] });
      symbols.set(statement.name, statement.name);
    } else if (statement.kind === 'ReverseStatement') {
      const input = symbols.get(statement.source);
      const path = paths.get(statement.source);
      if (!input || !path) {
        diagnostics.push({ code: 'E_SYMBOL', message: `Unknown KODE symbol "${statement.source}".`, span: statement.span });
      } else {
        paths.set(statement.name, { start: path.end, end: path.start, nodes: [...path.nodes].reverse() });
        symbols.set(statement.name, statement.name);
      }
    } else {
      const left = symbols.get(statement.left);
      const right = symbols.get(statement.right);
      const leftPath = paths.get(statement.left);
      const rightPath = paths.get(statement.right);
      if (!left || !right || !leftPath || !rightPath) {
        diagnostics.push({ code: 'E_SYMBOL', message: `Unknown KODE symbol in compose "${statement.name}".`, span: statement.span });
      } else if (leftPath.end !== rightPath.start) {
        diagnostics.push({ code: 'E_CONNECTIVITY', message: `Cannot compose "${statement.left}" ending at "${leftPath.end}" with "${statement.right}" starting at "${rightPath.start}".`, span: statement.span });
      } else {
        paths.set(statement.name, { start: leftPath.start, end: rightPath.end, nodes: [...leftPath.nodes, ...rightPath.nodes.slice(1)] });
        symbols.set(statement.name, statement.name);
      }
    }

    declared.add(statement.name);
  }

  if (diagnostics.length) return { ok: false, model: null, diagnostics };
  return { ok: true, model: { program, paths, symbols }, diagnostics: [] };
}
