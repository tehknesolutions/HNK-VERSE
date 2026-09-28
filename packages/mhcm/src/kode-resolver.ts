import { diagnostic, type KodeDiagnostic } from './kode-diagnostics.ts';
import { SemanticRegistry, semanticRefKey, type SemanticRef, type UnresolvedSemanticRef } from './model.ts';
import type { KodeSpan } from './kode.ts';
import type { KodeSymbol } from './kode-semantic.ts';

export type SemanticResolution = {
  ref: SemanticRef;
  symbol: KodeSymbol;
};

export class SemanticResolver {
  constructor(
    private readonly symbols: SemanticRegistry<KodeSymbol>,
    private readonly diagnostics: KodeDiagnostic[],
  ) {}

  resolve(ref: UnresolvedSemanticRef, span: KodeSpan, displayName: string): SemanticResolution | null {
    const symbol = this.symbols.get(ref.id, ref.namespace);
    if (!symbol) {
      this.diagnostics.push(
        diagnostic('E_SYMBOL', `Unknown KODE symbol "${displayName}".`, span),
      );
      return null;
    }
    const resolved: SemanticRef = {
      kind: 'resolved',
      namespace: ref.namespace,
      id: ref.id,
    };
    return { ref: resolved, symbol };
  }

  key(ref: SemanticRef): string {
    return semanticRefKey(ref);
  }
}
