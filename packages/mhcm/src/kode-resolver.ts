import { diagnostic, type KodeDiagnostic } from './kode-diagnostics.ts';
import { SemanticRegistry, semanticRefKey, type PathValue, type SemanticRef, type UnresolvedSemanticRef } from './model.ts';
import type { KodeSpan } from './kode.ts';
import type { KodeSymbol } from './kode-semantic.ts';

export type SemanticResolution = {
  ref: SemanticRef;
  symbol: KodeSymbol;
};

export type PathResolution = SemanticResolution & {
  path: PathValue;
};

export class SemanticResolver {
  constructor(
    private readonly symbols: SemanticRegistry<KodeSymbol>,
    private readonly paths: SemanticRegistry<PathValue>,
    private readonly diagnostics: KodeDiagnostic[],
  ) {}

  resolve(ref: UnresolvedSemanticRef, span: KodeSpan, displayName: string): SemanticResolution | null {
    const symbol = this.symbols.get(ref.id, ref.namespace);
    if (!symbol) {
      this.diagnostics.push(diagnostic('E_SYMBOL', `Unknown KODE symbol "${displayName}".`, span));
      return null;
    }
    return {
      ref: { kind: 'resolved', namespace: ref.namespace, id: ref.id },
      symbol,
    };
  }

  resolvePath(ref: UnresolvedSemanticRef, span: KodeSpan, displayName: string): PathResolution | null {
    const resolved = this.resolve(ref, span, displayName);
    if (!resolved) return null;
    if (resolved.symbol.type !== 'Path' && resolved.symbol.type !== 'OperatorResultPath') {
      this.diagnostics.push(diagnostic('E_SYMBOL', `KODE symbol "${displayName}" is not a Path.`, span));
      return null;
    }
    const path = this.paths.get(resolved.ref.id, resolved.ref.namespace);
    if (!path) {
      this.diagnostics.push(diagnostic('E_SYMBOL', `KODE symbol "${displayName}" has no PathValue.`, span));
      return null;
    }
    return { ...resolved, path };
  }

  key(ref: SemanticRef): string {
    return semanticRefKey(ref);
  }
}
