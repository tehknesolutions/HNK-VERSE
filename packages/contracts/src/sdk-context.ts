export type ContractVersion = { name: string; version: string; };

export type VerseContext = {
  identityId: string;
  sessionId: string;
  presenceId: string;
  verseId: string;
  worldId: string;
  embodimentId?: string;
  roles: readonly string[];
  permissions: readonly string[];
  correlationId: string;
  contracts: readonly ContractVersion[];
};

export type ContextResolution = {
  context: VerseContext;
  authorityRef: string;
};