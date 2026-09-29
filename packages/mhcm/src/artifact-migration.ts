import type { MhcmProgram } from './program.ts';
import { validateProgramCompatibility } from './artifact-compatibility.ts';
import { beginArtifactMigrationTransaction, commitArtifactMigrationTransaction } from './artifact-migration-transaction.ts';
import { appendMigrationManifest, createMigrationManifest, type ArtifactMigrationManifest } from './artifact-migration-manifest.ts';

export type ArtifactMigration = {
  fromVersion: string;
  toVersion: string;
  id: string;
  migrate: (program: MhcmProgram) => MhcmProgram;
};

export type ArtifactMigrationPath = readonly ArtifactMigration[];

export type ArtifactMigrationGraphIssueCode =
  | 'INVALID_MIGRATION_ID'
  | 'INVALID_SOURCE_VERSION'
  | 'INVALID_TARGET_VERSION'
  | 'SELF_MIGRATION'
  | 'DUPLICATE_MIGRATION_ID'
  | 'DUPLICATE_VERSION_EDGE'
  | 'MIGRATION_FUNCTION_MISSING'
  | 'MIGRATION_CYCLE';

export type ArtifactMigrationGraphIssue = {
  code: ArtifactMigrationGraphIssueCode;
  message: string;
  migrationId?: string;
};

export type ArtifactMigrationGraphPolicy = {
  allowCycles?: boolean;
};

export type ArtifactMigrationGraphValidation = {
  ok: boolean;
  issues: readonly ArtifactMigrationGraphIssue[];
  cycles: readonly string[];
};

export function validateArtifactMigrationGraph(registry: ArtifactMigrationRegistry, policy: ArtifactMigrationGraphPolicy = {}): ArtifactMigrationGraphValidation {
  const issues: ArtifactMigrationGraphIssue[] = [];
  const cycles: string[] = [];
  const migrations = registry.list();
  const ids = new Set<string>();
  const edges = new Set<string>();
  const adjacency = new Map<string, string[]>();

  for (const migration of migrations) {
    if (!migration.id.trim()) issues.push({ code: 'INVALID_MIGRATION_ID', message: 'Migration id must not be empty.' });
    if (ids.has(migration.id)) issues.push({ code: 'DUPLICATE_MIGRATION_ID', migrationId: migration.id, message: `Duplicate migration id: ${migration.id}.` });
    ids.add(migration.id);
    if (!migration.fromVersion.trim()) issues.push({ code: 'INVALID_SOURCE_VERSION', migrationId: migration.id, message: `Migration ${migration.id} has an empty source version.` });
    if (!migration.toVersion.trim()) issues.push({ code: 'INVALID_TARGET_VERSION', migrationId: migration.id, message: `Migration ${migration.id} has an empty target version.` });
    if (migration.fromVersion === migration.toVersion) issues.push({ code: 'SELF_MIGRATION', migrationId: migration.id, message: `Migration ${migration.id} points to the same source and target version.` });
    if (typeof migration.migrate !== 'function') issues.push({ code: 'MIGRATION_FUNCTION_MISSING', migrationId: migration.id, message: `Migration ${migration.id} has no callable migration function.` });
    const edge = `${migration.fromVersion}->${migration.toVersion}`;
    if (edges.has(edge)) issues.push({ code: 'DUPLICATE_VERSION_EDGE', migrationId: migration.id, message: `Duplicate migration edge: ${edge}.` });
    edges.add(edge);
    const targets = adjacency.get(migration.fromVersion) ?? [];
    targets.push(migration.toVersion);
    adjacency.set(migration.fromVersion, targets);
  }

  const visiting = new Set<string>();
  const visited = new Set<string>();
  const walk = (version: string): void => {
    if (visiting.has(version)) {
      cycles.push(version);
      if (!policy.allowCycles) issues.push({ code: 'MIGRATION_CYCLE', message: `Migration graph contains a cycle involving version ${version}.` });
      return;
    }
    if (visited.has(version)) return;
    visiting.add(version);
    for (const target of adjacency.get(version) ?? []) walk(target);
    visiting.delete(version);
    visited.add(version);
  };
  for (const version of adjacency.keys()) walk(version);
  return { ok: issues.length === 0, issues: Object.freeze(issues), cycles: Object.freeze([...new Set(cycles)]) };
}

export interface ArtifactMigrationRegistry {
  register(migration: ArtifactMigration): void;
  find(fromVersion: string, toVersion: string): ArtifactMigration | null;
  list(): readonly ArtifactMigration[];
  findPath(fromVersion: string, toVersion: string): ArtifactMigrationPath | null;
}

export class InMemoryArtifactMigrationRegistry implements ArtifactMigrationRegistry {
  private readonly migrations = new Map<string, ArtifactMigration>();

  register(migration: ArtifactMigration): void {
    const key = `${migration.fromVersion}->${migration.toVersion}`;
    if (this.migrations.has(key)) throw new Error(`Artifact migration already registered: ${key}.`);
    if (migration.fromVersion === migration.toVersion) throw new Error('Artifact migration must change version.');
    this.migrations.set(key, migration);
  }

  find(fromVersion: string, toVersion: string): ArtifactMigration | null {
    return this.migrations.get(`${fromVersion}->${toVersion}`) ?? null;
  }

  list(): readonly ArtifactMigration[] {
    return Object.freeze([...this.migrations.values()]);
  }

  findPath(fromVersion: string, toVersion: string): ArtifactMigrationPath | null {
    if (fromVersion === toVersion) return Object.freeze([]);
    const migrations = [...this.migrations.values()].sort((a, b) => a.id.localeCompare(b.id));
    const queue: Array<{ version: string; path: ArtifactMigration[] }> = [{ version: fromVersion, path: [] }];
    const visited = new Set<string>([fromVersion]);
    while (queue.length) {
      const current = queue.shift()!;
      for (const candidate of migrations) {
        if (candidate.fromVersion !== current.version || visited.has(candidate.toVersion)) continue;
        const nextPath = [...current.path, candidate];
        if (candidate.toVersion === toVersion) return Object.freeze(nextPath);
        visited.add(candidate.toVersion);
        queue.push({ version: candidate.toVersion, path: nextPath });
      }
    }
    return null;
  }
}

export type ArtifactMigrationResult =
  | { ok: true; program: MhcmProgram; migrationId: string; manifest: ArtifactMigrationManifest }
  | { ok: false; reason: 'NO_MIGRATION' | 'MIGRATION_FAILED' | 'MIGRATED_ARTIFACT_INCOMPATIBLE'; message: string };

function applyMigrationStep(program: MhcmProgram, migration: ArtifactMigration): ArtifactMigrationResult {
  try {
    const migrated = migration.migrate(program);
    if (migrated.typeSystemVersion !== migration.toVersion) return { ok: false, reason: 'MIGRATION_FAILED', message: `Migration ${migration.id} did not produce target version ${migration.toVersion}.` };
    const compatibility = validateProgramCompatibility(migrated);
    if (!compatibility.ok) return { ok: false, reason: 'MIGRATED_ARTIFACT_INCOMPATIBLE', message: `Migration ${migration.id} produced an incompatible artifact: ${compatibility.issues.map((issue) => `[${issue.code}] ${issue.message}`).join('; ')}` };
    const transaction = beginArtifactMigrationTransaction(program, migrated, migration.id);
    return { ok: true, program: commitArtifactMigrationTransaction(transaction), migrationId: migration.id, manifest: createMigrationManifest(program.typeSystemVersion, migration.toVersion, migration.id) };
  } catch (error) {
    return { ok: false, reason: 'MIGRATION_FAILED', message: `Migration ${migration.id} failed: ${error instanceof Error ? error.message : String(error)}` };
  }
}

export function migrateArtifact(program: MhcmProgram, targetVersion: string, registry: ArtifactMigrationRegistry): ArtifactMigrationResult {
  if (program.typeSystemVersion === targetVersion) return { ok: true, program, migrationId: 'identity', manifest: Object.freeze({ sourceVersion: targetVersion, targetVersion, migrations: Object.freeze([]) }) };
  const direct = registry.find(program.typeSystemVersion, targetVersion);
  if (direct) return applyMigrationStep(program, direct);
  const path = registry.findPath(program.typeSystemVersion, targetVersion);
  if (!path) return { ok: false, reason: 'NO_MIGRATION', message: `No migration chain registered from ${program.typeSystemVersion} to ${targetVersion}.` };
  let currentProgram = program;
  let manifest: ArtifactMigrationManifest | null = null;
  for (const step of path) {
    const result = applyMigrationStep(currentProgram, step);
    if (!result.ok) return result;
    currentProgram = result.program;
    manifest = manifest ? appendMigrationManifest(manifest, step.id, step.fromVersion, step.toVersion) : result.manifest;
  }
  return { ok: true, program: currentProgram, migrationId: path.map((step) => step.id).join(' -> '), manifest: manifest! };
}
