export type AuthorityStatus = 'approved' | 'candidate' | 'fixture';

export type CodexRef = {
  source: 'codex-hnk';
  canonicalId: string;
  version: string;
  hash?: string;
  status: AuthorityStatus;
};

export type LanguageRef = {
  source: 'hnk-idioma';
  canonicalId: string;
  surface: string;
  version: string;
  hash?: string;
  status: AuthorityStatus;
};

export type HnkEvent<T = unknown> = {
  eventId: string;
  eventType: string;
  schemaVersion: number;
  actorId?: string;
  worldId?: string;
  sessionId?: string;
  occurredAt: string;
  causationId?: string;
  correlationId?: string;
  payload: T;
};

export type PracticeEvent = {
  practiceId: string;
  actorId: string;
  worldId: string;
  action: unknown;
  observation: unknown;
  result: unknown;
  interpretation?: unknown;
  evidenceRefs: string[];
  canonRefs: string[];
  occurredAt: string;
};

export const LUCIDITY_INVARIANT =
  'EXPERIENCE != INTERPRETATION != EVIDENCE != CANON' as const;

export const PRACTICE_LUCIDITY_INVARIANT =
  'ACTION != OBSERVATION != RESULT != INTERPRETATION != EVIDENCE != CANON' as const;
