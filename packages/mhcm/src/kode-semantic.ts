import type { KodeProgram } from './kode.ts';
import { diagnostic, type KodeDiagnostic } from './kode-diagnostics.ts';

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
      diagnostics.push({ code: 'E_DUPLICATE', message: `Duplicate KODE symbol "${statement.name}".`, span: statement.nameSpan });
      continue;
    }

    if (statement.kind === 'PathDeclaration') {
      paths.set(statement.name, {
        start: statement.nodes[0].name,
        end: statement.nodes[statement.nodes.length - 1].name,
        nodes: statement.nodes.map((node) => node.name),
      });
      symbols.set(statement.name, statement.name);
    } else if (statement.kind === 'ReverseStatement') {
      const input = symbols.get(statement.source.name);
      const path = paths.get(statement.source.name);
      if (!input || !path) {
        diagnostics.push({
          code: 'E_SYMBOL',
          message: `Unknown KODE symbol "${statement.source.name}".`,
          span: statement.source.span,
        });
      } else {
        paths.set(statement.name, { start: path.end, end: path.start, nodes: [...path.nodes].reverse() });
        symbols.set(statement.name, statement.name);
      }
    } else {
      const left = symbols.get(statement.left.name);
      const right = symbols.get(statement.right.name);
      const leftPath = paths.get(statement.left.name);
      const rightPath = paths.get(statement.right.name);

      if (!left || !leftPath) {
        diagnostics.push({
          code: 'E_SYMBOL',
          message: `Unknown KODE symbol "${statement.left.name}".`,
          span: statement.left.span,
        });
      } else if (!right || !rightPath) {
        diagnostics.push({
          code: 'E_SYMBOL',
          message: `Unknown KODE symbol "${statement.right.name}".`,
          span: statement.right.span,
        });
      } else if (leftPath.end !== rightPath.start) {
        diagnostics.push(diagnostic(
          'E_CONNECTIVITY',
          `Cannot compose "${statement.left.name}" ending at "${leftPath.end}" with "${statement.right.name}" starting at "${rightPath.start}".`,
          statement.left.span,
          [
            { label: 'left operand', span: statement.left.span },
            { label: 'right operand', span: statement.right.span },
          ],
        ));
      } else {
        paths.set(statement.name, {
          start: leftPath.start,
          end: rightPath.end,
          nodes: [...leftPath.nodes, ...rightPath.nodes.slice(1)],
        });
        symbols.set(statement.name, statement.name);
      }
    }

    declared.add(statement.name);
  }

  if (diagnostics.length) return { ok: false, model: null, diagnostics };
  return { ok: true, model: { program, paths, symbols }, diagnostics: [] };
}
