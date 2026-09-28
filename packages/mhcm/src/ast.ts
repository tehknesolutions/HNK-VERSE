import type { Glyph } from './glyph.ts';
import type { Path } from './model.ts';

export type HnkAstNode = HnkAstPath | HnkAstGlyph;

export type HnkAstPath = {
  kind: 'PathExpression';
  id: string;
  start: string;
  nodes: string[];
  edges: string[];
  end: string;
  directed: boolean;
  provenance: Path['provenance'];
};

export type HnkAstGlyph = {
  kind: 'GlyphExpression';
  id: string;
  anchor: string;
  path: string;
  transform: Glyph['transform'];
  encoding: string;
  provenance: Glyph['provenance'];
};

export function pathToAst(path: Path): HnkAstPath {
  return {
    kind: 'PathExpression',
    id: path.id,
    start: path.start,
    nodes: [...path.nodes],
    edges: [...path.edges],
    end: path.end,
    directed: path.directed,
    provenance: path.provenance,
  };
}

export function glyphToAst(glyph: Glyph): HnkAstGlyph {
  return {
    kind: 'GlyphExpression',
    id: glyph.id,
    anchor: glyph.anchor,
    path: glyph.path,
    transform: glyph.transform,
    encoding: glyph.encoding,
    provenance: glyph.provenance,
  };
}
