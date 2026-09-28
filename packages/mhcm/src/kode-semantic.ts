import type { KodeProgram, KodeSpan } from './kode.ts';
import { createProvenance, createSemanticRef, SemanticRegistry, type PathValue, type SemanticRef } from './model.ts';
import { diagnostic, type KodeDiagnostic } from './kode-diagnostics.ts';
import { SemanticResolver } from './kode-resolver.ts';

export type KodeType = 'Path' | 'OperatorResultPath';

export type KodeSymbol = {
  name: string;
  type: KodeType;
  declarationSpan: KodeSpan;
  origin: 'declaration' | 'operator';
  ref: SemanticRef;
};

export type KodeStaticPath = PathValue;

export type KodeSemanticModel = {
  program: KodeProgram;
  semanticPaths: SemanticRegistry<PathValue>;
  semanticSymbols: SemanticRegistry<KodeSymbol>;
};

function createKodePath(name: string, nodes: string[], operation: 'declaration' | 'reverse' | 'compose'): PathValue {
  const edges = nodes.slice(0, -1).map((node, index) => `${node}->${nodes[index + 1]}`);
  return {
    id: `PATH-${name}`,
    start: nodes[0],
    nodes: [...nodes],
    edges,
    end: nodes[nodes.length - 1],
    directed: true,
    provenance: createProvenance('HNK-KODE', ['KODE-0'], 'EXPERIMENTAL', `kode-0.2-${operation}`),
  };
}

export function analyzeKode(program: KodeProgram): { ok: true; model: KodeSemanticModel; diagnostics: [] } | { ok: false; model: null; diagnostics: KodeDiagnostic[] } {
  const diagnostics: KodeDiagnostic[] = [];
  const semanticPaths = new SemanticRegistry<PathValue>();
  const semanticSymbols = new SemanticRegistry<KodeSymbol>();
  const resolver = new SemanticResolver(semanticSymbols, diagnostics);
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
      ref: createSemanticRef('path', statement.name),
    };

    if (statement.kind === 'PathDeclaration') {
      const path = createKodePath(statement.name, statement.nodes.map((node) => node.name), 'declaration');
      semanticPaths.register(path, 'path');
      semanticSymbols.register(declaration, 'path');
      declared.add(statement.name);
      continue;
    }

    const resolvedInput = statement.kind === 'ReverseStatement'
      ? resolver.resolve(statement.source.ref, statement.source.span, statement.source.name)
      : null;

    if (statement.kind === 'ReverseStatement') {
      if (!resolvedInput) continue;
      if (resolvedInput.symbol.type !== 'Path' && resolvedInput.symbol.type !== 'OperatorResultPath') {
        diagnostics.push(diagnostic('E_SYMBOL', `KODE symbol "${statement.source.name}" is not a Path.`, statement.source.span));
        continue;
      }
      const path = semanticPaths.get(resolvedInput.ref.id, resolvedInput.ref.namespace);
      if (!path) {
        diagnostics.push(diagnostic('E_SYMBOL', `Unknown KODE symbol "${statement.source.name}".`, statement.source.span));
        continue;
      }
      const resultPath = createKodePath(statement.name, [...path.nodes].reverse(), 'reverse');
      semanticPaths.register(resultPath, 'path');
      semanticSymbols.register(declaration, 'path');
      declared.add(statement.name);
      continue;
    }

    const left = resolver.resolve(statement.left.ref, statement.left.span, statement.left.name);
    const right = resolver.resolve(statement.right.ref, statement.right.span, statement.right.name);
    if (!left || !right) continue;

    if (left.symbol.type !== 'Path' && left.symbol.type !== 'OperatorResultPath') {
      diagnostics.push(diagnostic('E_SYMBOL', `KODE symbol "${statement.left.name}" is not a Path.`, statement.left.span));
      continue;
    }
    if (right.symbol.type !== 'Path' && right.symbol.type !== 'OperatorResultPath') {
      diagnostics.push(diagnostic('E_SYMBOL', `KODE symbol "${statement.right.name}" is not a Path.`, statement.right.span));
      continue;
    }

    const leftPath = semanticPaths.get(left.ref.id, left.ref.namespace);
    const rightPath = semanticPaths.get(right.ref.id, right.ref.namespace);
    if (!leftPath || !rightPath) {
      diagnostics.push(diagnostic('E_SYMBOL', 'Resolved KODE symbol has no PathValue.', statement.left.span));
      continue;
    }

    if (leftPath.end !== rightPath.start) {
      diagnostics.push(diagnostic(
        'E_CONNECTIVITY',
        `Cannot compose "${statement.left.name}" ending at "${leftPath.end}" with "${statement.right.name}" starting at "${rightPath.start}".`,
        statement.left.span,
        [
          { label: 'left operand', span: statement.left.span },
          { label: 'right operand', span: statement.right.span },
        ],
      ));
      continue;
    }

    const resultPath = createKodePath(statement.name, [...leftPath.nodes, ...rightPath.nodes.slice(1)], 'compose');
    semanticPaths.register(resultPath, 'path');
    semanticSymbols.register(declaration, 'path');
    declared.add(statement.name);
  }

  if (diagnostics.length) return { ok: false, model: null, diagnostics };
  return { ok: true, model: { program, semanticPaths, semanticSymbols }, diagnostics: [] };
}
