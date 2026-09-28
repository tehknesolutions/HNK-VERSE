import type { VerseContext } from './sdk-context.ts';
import type { InteropOutcome } from './sdk-interop.ts';

export const TRANSITION_STATES = [
  'REQUESTED',
  'RESOLVING',
  'NEGOTIATING',
  'PREPARING',
  'EXITING_SOURCE',
  'ENTERING_TARGET',
  'COMPLETED',
  'FAILED',
] as const;
export type TransitionState = (typeof TRANSITION_STATES)[number];

export const SDK_ERROR_CODES = [
  'UNSUPPORTED_CAPABILITY',
  'INCOMPATIBLE_VERSION',
  'PERMISSION_DENIED',
  'INVALID_CONTEXT',
  'IDENTITY_RESOLUTION_FAILED',
  'ENTITY_NOT_FOUND',
  'INVALID_ADDRESS',
  'TRANSITION_REJECTED',
  'TRANSFER_REJECTED',
  'TRANSLATION_FAILED',
  'PROJECTION_FAILED',
  'VERSE_UNAVAILABLE',
  'VALIDATION_FAILED',
  'CONFLICT',
  'TIMEOUT',
  'INTERNAL_VERSE_ERROR',
  'PLATFORM_BOUNDARY_ERROR',
] as const;
export type SdkErrorCode = (typeof SDK_ERROR_CODES)[number];

export type TransitionRequest = {
  source: VerseContext;
  targetVerseId: string;
  targetWorldId: string;
  requestedInterop: readonly string[];
  correlationId: string;
};

export type TransitionResult =
  | { ok: true; state: 'COMPLETED'; target: VerseContext; outcomes: readonly InteropOutcome[]; correlationId: string }
  | { ok: false; state: 'FAILED'; code: SdkErrorCode; message: string; outcomes: readonly InteropOutcome[]; correlationId: string };

export type VerseRuntimeResult =
  | { ok: true }
  | { ok: false; code: SdkErrorCode; message: string };

export type VerseRuntime = {
  initialize(context: VerseContext): Promise<VerseRuntimeResult>;
  enter(context: VerseContext): Promise<VerseRuntimeResult>;
  suspend(context: VerseContext): Promise<VerseRuntimeResult>;
  resume(context: VerseContext): Promise<VerseRuntimeResult>;
  exit(context: VerseContext): Promise<VerseRuntimeResult>;
  dispose(context: VerseContext): Promise<VerseRuntimeResult>;
};