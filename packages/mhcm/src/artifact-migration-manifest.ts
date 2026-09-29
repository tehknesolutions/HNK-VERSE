export type ArtifactMigrationManifestEntry = {
  migrationId: string;
  fromVersion: string;
  toVersion: string;
};

export type ArtifactMigrationManifest = {
  sourceVersion: string;
  targetVersion: string;
  migrations: readonly ArtifactMigrationManifestEntry[];
};

export function createMigrationManifest(
  sourceVersion: string,
  targetVersion: string,
  migrationId: string,
): ArtifactMigrationManifest {
  return Object.freeze({
    sourceVersion,
    targetVersion,
    migrations: Object.freeze([Object.freeze({
      migrationId,
      fromVersion: sourceVersion,
      toVersion: targetVersion,
    })]),
  });
}

export function appendMigrationManifest(
  manifest: ArtifactMigrationManifest,
  migrationId: string,
  fromVersion: string,
  toVersion: string,
): ArtifactMigrationManifest {
  const last = manifest.migrations[manifest.migrations.length - 1];
  const expectedFromVersion = last?.toVersion ?? manifest.targetVersion;
  if (expectedFromVersion !== fromVersion) {
    throw new Error(`Migration chain discontinuity: expected ${expectedFromVersion}, received ${fromVersion}.`);
  }
  if (toVersion === fromVersion) throw new Error('Migration manifest entry must change version.');
  return Object.freeze({
    sourceVersion: manifest.sourceVersion,
    targetVersion: toVersion,
    migrations: Object.freeze([
      ...manifest.migrations,
      Object.freeze({ migrationId, fromVersion, toVersion }),
    ]),
  });
}

export function validateMigrationManifest(manifest: ArtifactMigrationManifest): boolean {
  if (!manifest.sourceVersion.trim() || !manifest.targetVersion.trim()) return false;
  if (manifest.migrations.length === 0) return manifest.sourceVersion === manifest.targetVersion;
  if (manifest.migrations[0].fromVersion !== manifest.sourceVersion) return false;
  if (manifest.migrations[manifest.migrations.length - 1].toVersion !== manifest.targetVersion) return false;
  for (const entry of manifest.migrations) {
    if (!entry.migrationId.trim()) return false;
    if (!entry.fromVersion.trim() || !entry.toVersion.trim()) return false;
    if (entry.fromVersion === entry.toVersion) return false;
  }
  for (let i = 1; i < manifest.migrations.length; i += 1) {
    if (manifest.migrations[i - 1].toVersion !== manifest.migrations[i].fromVersion) return false;
  }
  return true;
}
