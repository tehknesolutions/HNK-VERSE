import {
  ZERO_IDS,
  type HnkCommand,
} from '@hnk-verse/contracts';
import {
  ZERO_FIXTURE_V1_INITIAL_STATE,
  assertZeroFixtureGoldenState,
} from '@hnk-verse/fixtures';
import { InMemoryPersistence } from '@hnk-verse/persistence';
import { ZeroCommandRuntime } from '@hnk-verse/simulation';
import {
  createProvenance,
  pathToAst,
  astToIr,
  projectPathToGlyph,
  type Cell,
  type Edge,
  type Path,
  irToRuntimeManifestation,
  validatePath,
} from '../packages/mhcm/src/index.ts';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const provenance = createProvenance(
  'MHCM-RUNTIME-PROOF',
  ['HNK-MHCM-V0.1'],
  'EXPERIMENTAL',
  'mhcm-runtime-proof@0.1.0',
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
  id: 'PATH-RUNTIME-001',
  start: 'A',
  nodes: ['A', 'B', 'C'],
  edges: ['AB', 'BC'],
  end: 'C',
  directed: true,
  provenance,
};

assert(validatePath(cells, edges, path).status === 'PASS', 'MHCM path validation failed.');

const glyph = projectPathToGlyph(path);
const ir = astToIr(pathToAst(path));
const glyphIr = astToIr({
  kind: 'GlyphExpression',
  id: glyph.id,
  anchor: glyph.anchor,
  path: glyph.path,
  transform: glyph.transform,
  encoding: glyph.encoding,
  provenance: glyph.provenance,
});

assert(ir.id === 'IR-PATH-RUNTIME-001', 'Path IR identity mismatch.');
assert(glyphIr.type === 'Glyph', 'Glyph IR type mismatch.');

const manifestation = irToRuntimeManifestation(glyphIr);
assert(manifestation.commandType === 'ExecuteMhcmIr', 'Wrong MHCM runtime command.');

const store = new InMemoryPersistence<typeof ZERO_FIXTURE_V1_INITIAL_STATE>();
const runtime = await ZeroCommandRuntime.create(
  { events: store, snapshots: store, receipts: store },
  ZERO_FIXTURE_V1_INITIAL_STATE,
);

const command: HnkCommand<Record<string, unknown>> = {
  commandId: 'MHCM-RUNTIME-001',
  commandType: manifestation.commandType,
  schemaVersion: 1,
  actorId: ZERO_IDS.avatar,
  verseId: ZERO_IDS.verse,
  worldId: ZERO_IDS.world,
  sessionId: 'SESSION-MHCM-RUNTIME-001',
  issuedAtReal: '2026-09-28T00:00:00Z',
  issuedAtWorld: ZERO_FIXTURE_V1_INITIAL_STATE.worldTime,
  correlationId: 'CORR:MHCM-RUNTIME-001',
  idempotencyKey: 'IDEMP:MHCM-RUNTIME-001',
  payload: manifestation.payload,
};

const result = await runtime.execute(command);

assert(result.accepted, `MHCM IR execution rejected: ${result.rejectionCode}`);
assert(result.eventIds.length === 2, 'MHCM IR execution must emit execution + semantic event.');
assert(result.data?.irId === glyphIr.id, 'Runtime result lost IR identity.');
assert(result.state.mhcmExecutionIds?.includes(glyphIr.id), 'Runtime state did not record MHCM execution.');

const events = await store.allEvents(ZERO_IDS.world);
const executed = events.find((event) => event.eventType === 'MhcmIrExecuted');
const semantic = events.find((event) => event.eventType === 'MhcmGlyphExecuted');
const resultProduced = events.find((event) => event.eventType === 'MhcmOperatorResultProduced');
assert(executed, 'Missing MhcmIrExecuted event.');
assert((executed.payload as Record<string, unknown>).irId === glyphIr.id, 'Event lost IR identity.');
assert(semantic, 'Missing semantic MHCM execution event.');
assert(result.data?.executionMode === 'MHCM-GLYPH-V1', 'Runtime did not select Glyph semantics.');
assert(result.state.mhcmGlyphExecutions?.includes(glyphIr.id), 'Runtime state did not record Glyph execution.');
assert(resultProduced === undefined, 'Glyph execution unexpectedly produced an operator result.');

const program = {
  id: 'PROGRAM-MHCM-RUNTIME-001',
  version: '0.1' as const,
  nodes: [
    { id: 'P-A', kind: 'IR' as const, ir: ir },
    { id: 'P-B', kind: 'IR' as const, ir: astToIr(pathToAst({ ...path, id: 'PATH-CDE', start: 'C', nodes: ['C', 'D', 'E'], edges: ['CD', 'DE'], end: 'E' })) },
    { id: 'P-COMPOSE', kind: 'OPERATOR' as const, operator: 'PATH_COMPOSE' as const, inputs: ['P-A', 'P-B'] },
    { id: 'P-REV', kind: 'OPERATOR' as const, operator: 'PATH_REVERSE' as const, inputs: ['P-COMPOSE'] },
  ],
  outputs: ['P-REV'],
};

const programCommand: HnkCommand<Record<string, unknown>> = {
  commandId: 'MHCM-PROGRAM-RUNTIME-001',
  commandType: 'ExecuteMhcmProgram',
  schemaVersion: 1,
  actorId: ZERO_IDS.avatar,
  verseId: ZERO_IDS.verse,
  worldId: ZERO_IDS.world,
  sessionId: 'SESSION-MHCM-PROGRAM-001',
  issuedAtReal: '2026-09-28T00:00:01Z',
  issuedAtWorld: ZERO_FIXTURE_V1_INITIAL_STATE.worldTime,
  correlationId: 'CORR:MHCM-PROGRAM-RUNTIME-001',
  idempotencyKey: 'IDEMP:MHCM-PROGRAM-RUNTIME-001',
  payload: { programId: program.id, nodes: program.nodes, outputs: program.outputs },
};

const programResult = await runtime.execute(programCommand);
assert(programResult.accepted, `MHCM program execution rejected: ${programResult.rejectionCode}`);
assert(programResult.data?.programId === program.id, 'Program execution lost identity.');
assert(programResult.data?.executionMode === 'MHCM-PROGRAM-V2', 'Program executor did not run semantic nodes.');
assert(Array.isArray(programResult.data?.resultIrIds) && programResult.data.resultIrIds.length >= program.nodes.length, 'Program executor did not produce node results.');
assert(programResult.state.mhcmProgramExecutions?.some((entry) => entry.programId === program.id), 'World state did not record program execution.');

const programEvents = await store.allEvents(ZERO_IDS.world);
const programExecuted = programEvents.find((event) => event.eventType === 'MhcmProgramExecuted');
assert(programExecuted, 'Missing MhcmProgramExecuted event.');
const nodeEvents = programEvents.filter((event) => event.eventType === 'MhcmProgramNodeExecuted');
assert(nodeEvents.length === program.nodes.length, 'Program did not execute every node.');
assert(programResult.state.mhcmProgramNodeExecutions?.length === program.nodes.length, 'World state did not persist every program node.');

console.log('MHCM runtime proof: PASS');
console.log('PASS MHCM Path â†’ Glyph â†’ AST â†’ HNK-IR');
console.log('PASS HNK-IR â†’ ExecuteMhcmIr command');
console.log('PASS runtime accepted IR');
console.log('PASS MhcmIrExecuted event emitted');
console.log('PASS semantic Glyph execution');
console.log('PASS world state recorded MHCM execution');
console.log('PASS complete MHCM program executed as one runtime unit');
