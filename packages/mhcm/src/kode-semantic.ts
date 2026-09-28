import type { KodeProgram, KodeSpan } from './kode.ts';
import { diagnostic, type KodeDiagnostic } from './kode-diagnostics.ts';

export type KodeType = 'Path' | 'OperatorResultPath';

export type KodeSymbol = {
  name: string;
  type: KodeType;
  declarationSpan: KodeSpan;
  origin: 'declaration' | 'operator';
};

export type KodeStaticPath = { start: string; end: string; nodes: string[] };

export type KodeSemanticModel = {
  program: KodeProgram;
  paths: Map<string, KodeStaticPath>;
  symbols: Map<string, KodeSymbol>;
};

export function analyzeKode(program: KodeProgram): { ok: true; model: KodeSemanticModel; diagnostics: [] } | { ok: false; model: null; diagnostics: KodeDiagnostic[] } {
  const diagnostics: KodeDiagnostic[] = [];
  const paths = new Map<string, KodeStaticPath>();
  const symbols = new Map<string, KodeSymbol>();
  const declared = new Set<string>();

  for (const statement of program.statements) {
    if (declared.has(statement.name)) {
      diagnostics.push(diagnostic('E_DUPLICATE', `Duplicate KODE symbol "${statement.name}".`, statement.nameSpan));
      continue;
    }

    const declaration = {
      name: statement.name,
      type: statement.kind === 'PathDeclaration' ? 'Path' as const : 'OperatorResultPath' as const,
      declarationSpan: statement.nameSpan,
      origin: statement.kind === 'PathDeclaration' ? 'declaration' as const : 'operator' as const,
    };

    if (statement.kind === 'PathDeclaration') {
      paths.set(statement.name, {
        start: statement.nodes[0].name,
        end: statement.nodes[statement.nodes.length - 1].name,
        nodes: statement.nodes.map((node) => node.name),
      });
      symbols.set(statement.name, declaration);
    } else if (statement.kind === 'ReverseStatement') {
      const input = symbols.get(statement.source.name);
      const path = paths.get(statement.source.name);
      if (!input || !path) {
        diagnostics.push(diagnostic('E_SYMBOL', `Unknown KODE symbol "${statement.source.name}".`, statement.source.span));
      } else if (input.type !== 'Path' && input.type !== 'OperatorResultPath') {
        diagnostics.push(diagnostic('E_SYMBOL', `KODE symbol "${statement.source.name}" is not a Path.`, statement.source.span));
      } else {
        paths.set(statement.name, { start: path.end, end: path.start, nodes: [...path.nodes].reverse() });
        symbols.set(statement.name, declaration);
      }
    } else {
      const left = symbols.get(statement.left.name);
      const right = symbols.get(statement.right.name);
      const leftPath = paths.get(statement.left.name);
      const rightPath = paths.get(statement.right.name);

      if (!left || !leftPath) {
        diagnostics.push(diagnostic('E_SYMBOL', `Unknown KODE symbol "${statement.left.name}".`, statement.left.span));
      } else if (!right || !rightPath) {
        diagnostics.push(diagnostic('E_SYMBOL', `Unknown KODE symbol "${statement.right.name}".`, statement.right.span));
      } else if (left.type !== 'Path' && left.type !== 'OperatorResultPath') {
        diagnostics.push(diagnostic('E_SYMBOL', `KODE symbol "${statement.left.name}" is not a Path.`, statement.left.span));
      } else if (right.type !== 'Path' && right.type !== 'OperatorResultPath') {
        diagnostics.push(diagnostic('E_SYMBOL', `KODE symbol "${statement.right.name}" is not a Path.`, statement.right.span));
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
        symbols.set(statement.name, declaration);
      }
    }

    declared.add(statement.name);
  }

  if (diagnostics.length) return { ok: false, model: null, diagnostics };
  return { ok: true, model: { program, paths, symbols }, diagnostics: [] };
}
