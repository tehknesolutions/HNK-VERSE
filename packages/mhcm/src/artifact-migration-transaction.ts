import type { MhcmProgram } from './program.ts';

export type ArtifactMigrationTransaction = {
  source: MhcmProgram;
  migrated: MhcmProgram;
  migrationId: string;
};

export function beginArtifactMigrationTransaction(
  source: MhcmProgram,
  migrated: MhcmProgram,
  migrationId: string,
): ArtifactMigrationTransaction {
  return Object.freeze({
    source,
    migrated,
    migrationId,
  });
}

export function commitArtifactMigrationTransaction(
  transaction: ArtifactMigrationTransaction,
): MhcmProgram {
  return transaction.migrated;
}
