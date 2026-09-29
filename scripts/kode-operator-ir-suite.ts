import { analyzeKode, compileKode, executeMhcmProgram, parseKode, getCompatibilityAction, migrateArtifact, migrateArtifactByPath, InMemoryArtifactMigrationRegistry, validateArtifactMigrationGraph, validateProgramCompatibility, validateNodeCompatibility, validateIrCompatibility } from '../packages/mhcm/src/index.ts';

const source = [
  'path A = A -> B;',
  'path B = B -> C;',
  'compose C = A, B;',
  'reverse R = C;',
].join('\n');

const program = compileKode(source);
if (program.version !== '0.1') throw new Error('KODE program version changed.');
if (program.typeSystemVersion !== 'kode-types-v0.1.0') throw new Error('Compiled program lost type-system version provenance.');
if (program.nodes.length !== 4) throw new Error('Unexpected KODE program node count.');
if (program.nodes.some((node) => node.typeSystemVersion !== program.typeSystemVersion)) throw new Error('Program node type-system provenance mismatch.');
if (program.nodes.some((node) => node.kind === 'IR' && node.ir.metadata.typeSystemVersion !== node.typeSystemVersion)) throw new Error('IR type-system provenance mismatch.');

const composed = program.nodes.find((node) => node.id === 'C');
if (!composed || composed.kind !== 'OPERATOR' || composed.operator !== 'PATH_COMPOSE') {
  throw new Error('Compose did not lower to PATH_COMPOSE.');
}
if (composed.inputs.map((ref) => `${ref.namespace}:${ref.id}`).join(',') !== 'path:A,path:B') throw new Error('Compose inputs changed.');
if (composed.resultType !== 'OperatorResultPath' || program.semanticPaths.get(composed.semanticPathRef.id, composed.semanticPathRef.namespace)?.nodes.join(',') !== 'A,B,C') throw new Error('Compose semantic PathValue was not lowered.');

const reversed = program.nodes.find((node) => node.id === 'R');
if (!reversed || reversed.kind !== 'OPERATOR' || reversed.operator !== 'PATH_REVERSE') {
  throw new Error('Reverse did not lower to PATH_REVERSE.');
}
if (reversed.inputs[0].namespace !== 'path' || reversed.inputs[0].id !== 'C') throw new Error('Reverse input changed.');
if (reversed.resultType !== 'OperatorResultPath' || program.semanticPaths.get(reversed.semanticPathRef.id, reversed.semanticPathRef.namespace)?.nodes.join(',') !== 'C,B,A') throw new Error('Reverse semantic PathValue was not lowered.');

const result = executeMhcmProgram(program);
const output = result.outputs[0];
const nodes = output.value.nodes as string[];
const edges = output.value.edges as string[];

if (nodes.join(',') !== 'C,B,A') throw new Error(`Unexpected final nodes: ${nodes.join(',')}`);
if (edges.join(',') !== 'B->C,A->B') throw new Error(`Unexpected final edges: ${edges.join(',')}`);
if (output.value.start !== 'C' || output.value.end !== 'A') throw new Error('Final path endpoints mismatch.');
if (output.inputs.length !== 1 || output.inputs[0] !== 'IR-A-COMPOSE-IR-B') {
  throw new Error('Reverse IR input identity mismatch.');
}

console.log('KODE-0.2 operator IR suite: PASS');
console.log('PASS KODE compose → PATH_COMPOSE');
console.log('PASS KODE reverse → PATH_REVERSE');
console.log('PASS compile graph → MHCM program execution');
console.log('PASS final composed/reversed Path IR');

const ast = parseKode(source);
if (ast.statements[2].kind !== 'ComposeStatement' || ast.statements[2].left.ref.kind !== 'unresolved' || ast.statements[2].left.ref.namespace !== 'path' || ast.statements[2].left.ref.id !== 'A' || ast.statements[2].right.ref.id !== 'B') throw new Error('AST SemanticRef contract failed.');
const semantic = analyzeKode(ast);
if (!semantic.ok) throw new Error('Semantic model failed for shared PathValue proof.');
const semanticC = semantic.model.semanticPaths.get('PATH-C', 'path');
if (!semanticC || semanticC.id !== 'PATH-C' || semanticC.nodes.join(',') !== 'A,B,C' || semanticC.edges.join(',') !== 'A->B,B->C') {
  throw new Error('Semantic PathValue diverged from canonical path representation.');
}
if (semanticC.provenance.source !== 'HNK-KODE') throw new Error('Semantic PathValue provenance mismatch.');
if (semantic.model.semanticSymbols.get('C', 'path')?.ref.kind !== 'resolved') throw new Error('Semantic analyzer did not resolve declaration reference.');
console.log('PASS semantic model uses shared PathValue');

const registry = program.semanticPaths;
if (!registry.has('PATH-C', 'path') || !registry.has('PATH-R', 'path')) throw new Error('Semantic PathValue registry lookup failed.');
if (registry.get('PATH-C', 'path')?.nodes.join(',') !== 'A,B,C') throw new Error('Registry returned incorrect compose PathValue.');
console.log('PASS semantic PathValue registry API');

const incompatible = { ...program, typeSystemVersion: 'kode-types-v0.0.0' as typeof program.typeSystemVersion };
let rejectedVersion = false;
try { executeMhcmProgram(incompatible); } catch (error) { rejectedVersion = error instanceof Error && error.message.includes('Incompatible KODE type-system version'); }
if (!rejectedVersion) throw new Error('Runtime accepted an incompatible type-system version.');
console.log('PASS type-system version compatibility gate');

const mismatchedNodeProgram = { ...program, nodes: program.nodes.map((node, index) => index === 0 ? { ...node, typeSystemVersion: 'kode-types-v0.0.0' as typeof node.typeSystemVersion } : node) };
let rejectedNodeVersion = false;
try { executeMhcmProgram(mismatchedNodeProgram); } catch (error) { rejectedNodeVersion = error instanceof Error && error.message.includes('does not match program version'); }
if (!rejectedNodeVersion) throw new Error('Runtime accepted a node with incompatible type-system provenance.');
console.log('PASS per-node type-system provenance gate');

const mismatchedIrProgram = { ...program, nodes: program.nodes.map((node, index) => index === 0 && node.kind === 'IR' ? { ...node, ir: { ...node.ir, metadata: { ...node.ir.metadata, typeSystemVersion: 'kode-types-v0.0.0' as typeof node.ir.metadata.typeSystemVersion } } } : node) };
let rejectedIrVersion = false;
try { executeMhcmProgram(mismatchedIrProgram); } catch (error) { rejectedIrVersion = error instanceof Error && error.message.includes('IR') && error.message.includes('does not match node version'); }
if (!rejectedIrVersion) throw new Error('Runtime accepted IR with incompatible type-system provenance.');
console.log('PASS IR type-system provenance gate');

const compatibility = validateProgramCompatibility(program);
if (!compatibility.ok) throw new Error('Valid program failed centralized compatibility validation.');
const firstNode = program.nodes[0];
if (!validateNodeCompatibility(firstNode, program.typeSystemVersion).ok) throw new Error('Valid node failed centralized compatibility validation.');
if (firstNode.kind === 'IR' && !validateIrCompatibility(firstNode.ir, firstNode.typeSystemVersion).ok) throw new Error('Valid IR failed centralized compatibility validation.');
console.log('PASS centralized artifact compatibility validation');

const badProgram = { ...program, typeSystemVersion: 'kode-types-v0.0.0' as typeof program.typeSystemVersion };
const report = validateProgramCompatibility(badProgram);
if (report.ok || !report.issues.some((issue) => issue.code === 'PROGRAM_TYPE_SYSTEM_MISMATCH')) throw new Error('Structured program compatibility code missing.');
const badNode = { ...program.nodes[0], typeSystemVersion: 'kode-types-v0.0.0' as typeof program.nodes[0].typeSystemVersion };
const nodeReport = validateNodeCompatibility(badNode, program.typeSystemVersion);
if (nodeReport.ok || !nodeReport.issues.some((issue) => issue.code === 'NODE_TYPE_SYSTEM_MISMATCH')) throw new Error('Structured node compatibility code missing.');
if (badNode.kind === 'IR') {
  const irReport = validateIrCompatibility({ ...badNode.ir, irVersion: 'invalid' as typeof badNode.ir.irVersion }, badNode.typeSystemVersion);
  if (irReport.ok || !irReport.issues.some((issue) => issue.code === 'IR_SCHEMA_MISMATCH')) throw new Error('Structured IR schema compatibility code missing.');
}
console.log('PASS structured artifact compatibility report');

if (getCompatibilityAction(compatibility) !== 'warn') throw new Error('Valid compatibility result should not request rejection.');
if (getCompatibilityAction(report) !== 'reject') throw new Error('Program mismatch should request rejection.');
console.log('PASS compatibility severity/action classification');

const migrationRegistry = new InMemoryArtifactMigrationRegistry();
const migrated = { ...program, typeSystemVersion: 'kode-types-v0.2.0' as typeof program.typeSystemVersion };
migrationRegistry.register({ id: 'kode-types-0.1-to-0.2', fromVersion: program.typeSystemVersion, toVersion: migrated.typeSystemVersion, migrate: () => migrated });
const migrationResult = migrateArtifact(program, migrated.typeSystemVersion, migrationRegistry);
if (!migrationResult.ok || migrationResult.migrationId !== 'kode-types-0.1-to-0.2') throw new Error('Registered artifact migration did not execute.');
const noMigration = migrateArtifact(program, 'kode-types-v9.9.9', migrationRegistry);
if (noMigration.ok || noMigration.reason !== 'NO_MIGRATION') throw new Error('Missing artifact migration was not reported.');
let duplicateMigrationRejected = false;
try { migrationRegistry.register({ id: 'duplicate', fromVersion: program.typeSystemVersion, toVersion: migrated.typeSystemVersion, migrate: () => migrated }); } catch { duplicateMigrationRejected = true; }
if (!duplicateMigrationRejected) throw new Error('Duplicate artifact migration was accepted.');
console.log('PASS explicit artifact migration API');

const incompatibleMigrationRegistry = new InMemoryArtifactMigrationRegistry();
const brokenMigrated = { ...program, typeSystemVersion: 'kode-types-v0.2.0' as typeof program.typeSystemVersion, nodes: program.nodes.map((node) => ({ ...node, typeSystemVersion: 'kode-types-v0.0.0' as typeof node.typeSystemVersion })) };
incompatibleMigrationRegistry.register({ id: 'broken-0.1-to-0.2', fromVersion: program.typeSystemVersion, toVersion: brokenMigrated.typeSystemVersion, migrate: () => brokenMigrated });
const incompatibleMigration = migrateArtifact(program, brokenMigrated.typeSystemVersion, incompatibleMigrationRegistry);
if (incompatibleMigration.ok || incompatibleMigration.reason !== 'MIGRATED_ARTIFACT_INCOMPATIBLE') throw new Error('Incompatible migrated artifact was accepted.');
console.log('PASS migrate → validate → accept gate');

const sourceBeforeMigration = JSON.stringify(program);
const transactionRegistry = new InMemoryArtifactMigrationRegistry();
const transactionTarget = { ...program, typeSystemVersion: 'kode-types-v0.3.0' as typeof program.typeSystemVersion };
transactionRegistry.register({ id: 'transactional-0.1-to-0.3', fromVersion: program.typeSystemVersion, toVersion: transactionTarget.typeSystemVersion, migrate: (input) => ({ ...input, typeSystemVersion: transactionTarget.typeSystemVersion }) });
const transactionResult = migrateArtifact(program, transactionTarget.typeSystemVersion, transactionRegistry);
if (!transactionResult.ok) throw new Error('Transactional migration unexpectedly failed.');
if (JSON.stringify(program) !== sourceBeforeMigration) throw new Error('Migration mutated source artifact.');
if (transactionResult.program === program) throw new Error('Migration returned source artifact instead of migrated artifact.');
console.log('PASS transactional migration source preservation');

if (!transactionResult.ok) throw new Error('Expected migration result.');
if (!transactionResult.manifest || transactionResult.manifest.sourceVersion !== program.typeSystemVersion || transactionResult.manifest.targetVersion !== transactionTarget.typeSystemVersion || transactionResult.manifest.migrations.length !== 1) throw new Error('Migration manifest is incomplete.');
console.log('PASS migration audit manifest');

const composedRegistry = new InMemoryArtifactMigrationRegistry();
const v02 = { ...program, typeSystemVersion: 'kode-types-v0.2.0' as typeof program.typeSystemVersion };
const v03 = { ...v02, typeSystemVersion: 'kode-types-v0.3.0' as typeof program.typeSystemVersion };
composedRegistry.register({ id: 'MIG-001', fromVersion: program.typeSystemVersion, toVersion: v02.typeSystemVersion, migrate: () => v02 });
composedRegistry.register({ id: 'MIG-002', fromVersion: v02.typeSystemVersion, toVersion: v03.typeSystemVersion, migrate: () => v03 });
const composed = migrateArtifact(program, v03.typeSystemVersion, composedRegistry);
if (!composed.ok || composed.manifest.migrations.length !== 2 || composed.manifest.sourceVersion !== program.typeSystemVersion || composed.manifest.targetVersion !== v03.typeSystemVersion) throw new Error('Composed migration chain failed.');
if (composed.migrationId !== 'MIG-001 -> MIG-002') throw new Error('Composed migration audit chain is incorrect.');
console.log('PASS composed artifact migration chain');

const pathRegistry = new InMemoryArtifactMigrationRegistry();
pathRegistry.register({ id: 'Z-DIRECT-UNUSED', fromVersion: program.typeSystemVersion, toVersion: 'kode-types-v0.4.0', migrate: (input) => ({ ...input, typeSystemVersion: 'kode-types-v0.4.0' as typeof input.typeSystemVersion }) });
pathRegistry.register({ id: 'A-001', fromVersion: program.typeSystemVersion, toVersion: 'kode-types-v0.2.0', migrate: (input) => ({ ...input, typeSystemVersion: 'kode-types-v0.2.0' as typeof input.typeSystemVersion }) });
pathRegistry.register({ id: 'A-002', fromVersion: 'kode-types-v0.2.0', toVersion: 'kode-types-v0.3.0', migrate: (input) => ({ ...input, typeSystemVersion: 'kode-types-v0.3.0' as typeof input.typeSystemVersion }) });
const discoveredPath = pathRegistry.findPath(program.typeSystemVersion, 'kode-types-v0.3.0');
if (!discoveredPath || discoveredPath.map((step) => step.id).join(' -> ') !== 'A-001 -> A-002') throw new Error('Deterministic migration path discovery failed.');
console.log('PASS deterministic migration path discovery');

const graphValidation = validateArtifactMigrationGraph(pathRegistry);
if (!graphValidation.ok) throw new Error('Valid migration graph failed validation.');
const invalidGraphRegistry = new InMemoryArtifactMigrationRegistry();
invalidGraphRegistry.register({ id: 'CYCLE-A', fromVersion: 'vA', toVersion: 'vB', migrate: (input) => input });
invalidGraphRegistry.register({ id: 'CYCLE-B', fromVersion: 'vB', toVersion: 'vA', migrate: (input) => input });
const invalidGraph = validateArtifactMigrationGraph(invalidGraphRegistry);
if (invalidGraph.ok || !invalidGraph.issues.some((issue) => issue.code === 'MIGRATION_CYCLE')) throw new Error('Migration cycle was not detected.');
console.log('PASS migration graph validation');

const cycleObserved = validateArtifactMigrationGraph(invalidGraph, { allowCycles: true });
if (!cycleObserved.ok || cycleObserved.cycles.length !== 2) throw new Error('Cycle observation policy failed to separate detection from rejection.');
const cycleRejected = validateArtifactMigrationGraph(invalidGraph);
if (cycleRejected.ok || !cycleRejected.issues.some((issue) => issue.code === 'MIGRATION_CYCLE')) throw new Error('Default migration graph policy failed to reject cycles.');
console.log('PASS migration cycle detection vs policy');

const ambiguousRegistry = new InMemoryArtifactMigrationRegistry();
ambiguousRegistry.register({ id: 'PATH-A', fromVersion: 'v1', toVersion: 'v2', migrate: (input) => ({ ...input, typeSystemVersion: 'v2' as typeof input.typeSystemVersion }) });
ambiguousRegistry.register({ id: 'PATH-B', fromVersion: 'v1', toVersion: 'v3', migrate: (input) => ({ ...input, typeSystemVersion: 'v3' as typeof input.typeSystemVersion }) });
ambiguousRegistry.register({ id: 'PATH-C', fromVersion: 'v2', toVersion: 'v4', migrate: (input) => ({ ...input, typeSystemVersion: 'v4' as typeof input.typeSystemVersion }) });
ambiguousRegistry.register({ id: 'PATH-D', fromVersion: 'v3', toVersion: 'v4', migrate: (input) => ({ ...input, typeSystemVersion: 'v4' as typeof input.typeSystemVersion }) });
const ambiguous = ambiguousRegistry.resolvePath('v1', 'v4', 'reject-ambiguous');
if (ambiguous.ok || ambiguous.reason !== 'AMBIGUOUS_PATH' || ambiguous.candidates.length !== 2) throw new Error('Ambiguous migration paths were not rejected.');
const deterministic = ambiguousRegistry.resolvePath('v1', 'v4', 'deterministic-id');
if (!deterministic.ok || !deterministic.ambiguous || deterministic.path[0]?.id !== 'PATH-A') throw new Error('Deterministic migration policy failed.');
console.log('PASS migration path ambiguity policy');

const selectedPath = selectArtifactMigrationPath(ambiguousRegistry, 'v1', 'v4', ['PATH-B', 'PATH-D']);
if (!selectedPath.ok || selectedPath.path.map((step) => step.id).join(' -> ') !== 'PATH-B -> PATH-D') throw new Error('Explicit migration path selection failed.');
const discontinuousPath = selectArtifactMigrationPath(ambiguousRegistry, 'v1', 'v4', ['PATH-C', 'PATH-D']);
if (discontinuousPath.ok || discontinuousPath.reason !== 'DISCONTINUOUS_PATH') throw new Error('Discontinuous migration path was accepted.');
console.log('PASS explicit migration path selection');

const explicitExecution = migrateArtifactByPath(program, v03.typeSystemVersion, ['MIG-001', 'MIG-002'], composedRegistry);
if (!explicitExecution.ok || explicitExecution.migrationId !== 'MIG-001 -> MIG-002') throw new Error('Explicit migration path execution failed.');
console.log('PASS explicit migration path execution');
