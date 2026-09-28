import type { HnkAstNode } from './ast.ts';

export const HNK_IR_SCHEMA_VERSION = 1 as const;

export type HnkIrNode = {
  irVersion: typeof HNK_IR_SCHEMA_VERSION;
  id: string;
  type: 'Path' | 'Glyph';
  op: 'PATH_LITERAL' | 'GLYPH_LITERAL';
  inputs: string[];
  value: Record<string, unknown>;
  metadata: {
    sourceAstKind: HnkAstNode['kind'];
    provenance: HnkAstNode['provenance'];
  };
};

export function astToIr(node: HnkAstNode): HnkIrNode {
  if (node.kind === 'PathExpression') {
    return {
      irVersion: HNK_IR_SCHEMA_VERSION,
      id: `IR-${node.id}`,
      type: 'Path',
      op: 'PATH_LITERAL',
      inputs: [],
      value: {
        id: node.id,
        start: node.start,
        nodes: [...node.nodes],
        edges: [...node.edges],
        end: node.end,
        directed: node.directed,
      },
      metadata: {
        sourceAstKind: node.kind,
        provenance: node.provenance,
      },
    };
  }

  return {
    irVersion: HNK_IR_SCHEMA_VERSION,
    id: `IR-${node.id}`,
    type: 'Glyph',
    op: 'GLYPH_LITERAL',
    inputs: [node.path],
    value: {
      id: node.id,
      anchor: node.anchor,
      path: node.path,
      transform: node.transform,
      encoding: node.encoding,
    },
    metadata: {
      sourceAstKind: node.kind,
      provenance: node.provenance,
    },
  };
}
