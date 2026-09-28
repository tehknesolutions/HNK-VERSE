import type { VerseContext } from './sdk-context.ts';
import type { VerseRuntimeResult } from './sdk-transition.ts';

export const VERSE_LIFECYCLE_STATES = [
  'UNINITIALIZED',
  'INITIALIZING',
  'READY',
  'ENTERING',
  'ACTIVE',
  'SUSPENDED',
  'EXITING',
  'DISPOSED',
] as const;
export type VerseLifecycleState = (typeof VERSE_LIFECYCLE_STATES)[number];

export type VerseLifecycle = {
  state: VerseLifecycleState;
  initialize(context: VerseContext): Promise<VerseRuntimeResult>;
  enter(context: VerseContext): Promise<VerseRuntimeResult>;
  suspend(context: VerseContext): Promise<VerseRuntimeResult>;
  resume(context: VerseContext): Promise<VerseRuntimeResult>;
  exit(context: VerseContext): Promise<VerseRuntimeResult>;
  dispose(context: VerseContext): Promise<VerseRuntimeResult>;
};