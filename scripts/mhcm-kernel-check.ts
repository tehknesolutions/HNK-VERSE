import {
  createProvenance,
  deserializePath,
  projectPathToGlyph,
  serializePath,
  validatePath,
  MHCM_SCHEMA_VERSION,
  type Cell,
  type Edge,
  type Path,
} from '../packages/mhcm/src/index.ts';

const provenance = createProvenance(
  'MHCM-KERNEL-CHECK',
  ['HNK-MHCM-V0.1'],
  'EXPERIMENTAL',
  'mhcm-kernel-check@0.1.0',
);

const cells: Cell[] = ['A', 'B', 'C'].map((id, index) => ({
  id,
  address: { namespace: 'fixture', coordinate: String(index), version: '0.1.0' },
  provenance,
}));

const edges: Edge[] = [
  { id: 'AB', source: 'A', target: 'B', relation: 'adjacent', directed: true, provenance },
  { id: 'BC', source: 'B', target: 'C', relation: 'adjacent', directed: true, provenance },
];

const path: Path = {
  id: 'PATH-ABC',
  start: 'A',
  nodes: ['A', 'B', 'C'],
  edges: ['AB', 'BC'],
  end: 'C',
  directed: true,
  provenance,
};

const valid = validatePath(cells, edges, path);
if (valid.status !== 'PASS') throw new Error(JSON.stringify(valid));

const invalid = validatePath(cells, edges, { ...path, edges: ['BC', 'AB'] });
if (invalid.status !== 'FAIL') throw new Error('Expected invalid topology to fail.');

const serialized = serializePath(path);
const roundTrip = deserializePath(serialized);
if (serializePath(roundTrip) !== serialized) throw new Error('Canonical serialization is not stable.');

const glyph = projectPathToGlyph(path);
if (glyph.id !== 'GLYPH-PATH-ABC') throw new Error('Unexpected glyph id.');
if (glyph.path !== serialized) throw new Error('Glyph path projection is not deterministic.');
if (glyph.encoding !== 'MHCM-PATH-JSON-V1') throw new Error('Unexpected glyph encoding.');

if (MHCM_SCHEMA_VERSION !== 1) throw new Error('Unexpected MHCM schema version.');

console.log('MHCM kernel check: PASS');
console.log('PASS valid topology');
console.log('PASS invalid topology rejection');
console.log('PASS canonical serialization round-trip');
console.log('PASS deterministic glyph projection');
console.log('PASS schema version');
