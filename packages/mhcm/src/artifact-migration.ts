import type { MhcmProgram } from './program.ts';
import { validateProgramCompatibility } from './artifact-compatibility.ts';

export type ArtifactMigration = {
  fromVersion: string;
  toVersion: string;
  id: string;
  migrate: (program: MhcmProgram) => MhcmProgram;
};

export interface ArtifactMigrationRegistry {
  register(migration: ArtifactMigration): void;
  find(fromVersion: string, toVersion: string): ArtifactMigration | null;
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
}

export type ArtifactMigrationResult =
  | { ok: true; program: MhcmProgram; migrationId: string }
  | { ok: false; reason: 'NO_MIGRATION' | 'MIGRATION_FAILED' | 'MIGRATED_ARTIFACT_INCOMPATIBLE'; message: string };

export function migrateArtifact(
  program: MhcmProgram,
  targetVersion: string,
  registry: ArtifactMigrationRegistry,
): ArtifactMigrationResult {
  const migration = registry.find(program.typeSystemVersion, targetVersion);
  if (!migration) {
    return {
      ok: false,
      reason: 'NO_MIGRATION',
      message: `No migration registered from ${program.typeSystemVersion} to ${targetVersion}.`,
    };
  }

  try {
    const migrated = migration.migrate(program);
    if (migrated.typeSystemVersion !== targetVersion) {
      return {
        ok: false,
        reason: 'MIGRATION_FAILED',
        message: `Migration ${migration.id} did not produce target version ${targetVersion}.`,
      };
    }
    const compatibility = validateProgramCompatibility(migrated);
    if (!compatibility.ok) {
      return {
        ok: false,
        reason: 'MIGRATED_ARTIFACT_INCOMPATIBLE',
        message: `Migration ${migration.id} produced an incompatible artifact: ${compatibility.issues.map((issue) => `[${issue.code}] ${issue.message}`).join('; ')}`,
      };
    }
    return { ok: true, program: migrated, migrationId: migration.id };
  } catch (error) {
    return {
      ok: false,
      reason: 'MIGRATION_FAILED',
      message: `Migration ${migration.id} failed: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}
