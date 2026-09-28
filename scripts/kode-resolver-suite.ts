import { SemanticRegistry, createUnresolvedSemanticRef, type KodeSymbol, type SemanticRef } from '../packages/mhcm/src/model.ts';
import { SemanticResolver } from '../packages/mhcm/src/kode-resolver.ts';
import { KodeTypeSystem } from '../packages/mhcm/src/kode-types.ts';
import type { KodeTypeSystemPort } from '../packages/mhcm/src/kode-type-port.ts';
import { KodeDiagnostic } from '../packages/mhcm/src/kode-diagnostics.ts';

const span = { start: 0, end: 1, line: 1, column: 1 };
const symbol = {
  name: 'A',
  type: 'Path',
  declarationSpan: span,
  origin: 'declaration',
  ref: { kind: 'resolved', namespace: 'path', id: 'A' },
} satisfies KodeSymbol;

const diagnostics: KodeDiagnostic[] = [];
const registry = new SemanticRegistry<KodeSymbol>();
registry.register(symbol, 'path');
const paths = new SemanticRegistry<{ id: string; start: string; nodes: string[]; edges: string[]; end: string; directed: boolean; provenance: { source: string; schemaVersion: number; authorityStatus: 'EXPERIMENTAL'; sourceRefs: string[] } }>();
const path = { id: 'PATH-A', start: 'A', nodes: ['A','B'], edges: ['A->B'], end: 'B', directed: true, provenance: { source: 'HNK-KODE', schemaVersion: 1, authorityStatus: 'EXPERIMENTAL' as const, sourceRefs: ['KODE-0'] } };
paths.register(path, 'path');
const resolver = new SemanticResolver(registry, paths, diagnostics);

const resolved = resolver.resolve(createUnresolvedSemanticRef('path', 'A'), span, 'A');
const pathResolved = resolver.resolvePath(createUnresolvedSemanticRef('path', 'A'), span, 'A');
if (!pathResolved || pathResolved.path.id !== 'PATH-A') throw new Error('Atomic PathResolution failed.');
if (!resolved || resolved.ref.kind !== 'resolved' || resolved.ref.namespace !== 'path' || resolved.ref.id !== 'A') {
  throw new Error('Valid semantic reference was not resolved.');
}
if (diagnostics.length !== 0) throw new Error('Valid resolution emitted diagnostics.');

const missing = resolver.resolve(createUnresolvedSemanticRef('path', 'MISSING'), span, 'MISSING');
if (missing !== null || diagnostics.at(-1)?.code !== 'E_SYMBOL') {
  throw new Error('Missing symbol did not produce E_SYMBOL.');
}

const wrongNamespace = resolver.resolve(createUnresolvedSemanticRef('cell', 'A'), span, 'A');
if (wrongNamespace !== null || diagnostics.at(-1)?.code !== 'E_SYMBOL') {
  throw new Error('Wrong namespace did not remain unresolved.');
}

console.log('SemanticResolver suite: PASS');
console.log('PASS valid resolution');
console.log('PASS missing symbol → E_SYMBOL');
console.log('PASS wrong namespace → E_SYMBOL');

console.log('PASS symbol + PathValue atomic resolution');

const duplicateRegistry = new SemanticRegistry<KodeSymbol>();
duplicateRegistry.register(symbol, 'path');
if (!duplicateRegistry.has('A', 'path')) throw new Error('Registry duplicate precondition failed.');
let duplicateRejected = false;
try { duplicateRegistry.register(symbol, 'path'); } catch { duplicateRejected = true; }
if (!duplicateRejected) throw new Error('SemanticRegistry accepted duplicate semantic symbol.');
console.log('PASS registry owns duplicate identity');

const nonPathSymbol = { ...symbol, name: 'NOT_PATH', type: 'OperatorResultPath' as const };
const typeRegistry = new SemanticRegistry<KodeSymbol>();
typeRegistry.register(nonPathSymbol, 'path');
const typeResolver = new SemanticResolver(typeRegistry, paths, diagnostics);
const nonPath = typeResolver.resolvePath(createUnresolvedSemanticRef('path', 'NOT_PATH'), span, 'NOT_PATH');
if (!nonPath) throw new Error('OperatorResultPath should be accepted as a Path-compatible type.');
console.log('PASS Path-compatible type validation');

const typeSystem = new KodeTypeSystem();
if (!typeSystem.isPathType('Path') || !typeSystem.isPathType('OperatorResultPath') || !typeSystem.isPathType('SpecialPath')) throw new Error('Path-compatible predicate rejected a valid type.');
console.log('PASS isPathType predicate');
if (!typeSystem.isCompatible('Path', 'Path')) throw new Error('Path should be compatible with Path.');
if (!typeSystem.isCompatible('OperatorResultPath', 'Path')) throw new Error('OperatorResultPath should be Path-compatible.');
if (typeSystem.isCompatible('Path', 'OperatorResultPath')) throw new Error('Path should not satisfy OperatorResultPath.');
if (!typeSystem.isSubtypeOf('SpecialPath', 'OperatorResultPath')) throw new Error('SpecialPath should subtype OperatorResultPath.');
if (!typeSystem.isSubtypeOf('SpecialPath', 'Path')) throw new Error('Recursive subtype resolution failed.');
const resolvedAsPath = resolver.resolveAs(createUnresolvedSemanticRef('path', 'A'), 'Path', span, 'A');
if (!resolvedAsPath || resolvedAsPath.ref.kind !== 'resolved') throw new Error('resolveAs(Path) failed.');
console.log('PASS generalized type compatibility');

const port: KodeTypeSystemPort = typeSystem;
if (!port.isSubtypeOf('SpecialPath', 'Path')) throw new Error('Type-system port contract failed.');
console.log('PASS type-system port contract');
