import type { Path } from './model.ts';
import { serializePath } from './serialization.ts';

export type Glyph = {
  id: string;
  kind: 'PATH_GLYPH';
  anchor: string;
  path: string;
  transform: 'IDENTITY';
  encoding: string;
  provenance: Path['provenance'];
};

export function projectPathToGlyph(path: Path): Glyph {
  return {
    id: `GLYPH-${path.id}`,
    kind: 'PATH_GLYPH',
    anchor: path.start,
    path: serializePath(path),
    transform: 'IDENTITY',
    encoding: 'MHCM-PATH-JSON-V1',
    provenance: path.provenance,
  };
}
