import type { HnkEvent } from '@hnk-verse/contracts';

export type VerseBoundaryEventType =
  | 'VerseTransitionRequested'
  | 'VerseCapabilityNegotiated'
  | 'VerseTransitionPrepared'
  | 'VerseEntered'
  | 'VerseExited'
  | 'VerseTransitionCompleted'
  | 'VerseTransitionFailed';

export type VerseBoundaryEventPayload = {
  sourceVerseId: string;
  targetVerseId?: string;
  sourceWorldId?: string;
  targetWorldId?: string;
  requestedCapabilities?: readonly string[];
  acceptedCapabilities?: readonly string[];
  outcomeRefs?: readonly string[];
  errorCode?: string;
  reason?: string;
};

export type ChronicleBoundaryEvent = HnkEvent<VerseBoundaryEventPayload> & { eventType: VerseBoundaryEventType };

export type BoundaryEventInput = {
  eventId: string;
  eventType: VerseBoundaryEventType;
  schemaVersion?: number;
  verseId: string;
  worldId: string;
  actorId?: string;
  targetId?: string;
  sessionId?: string;
  realTimestamp: string;
  worldTimestamp: string;
  correlationId: string;
  causationId?: string;
  payload: VerseBoundaryEventPayload;
  provenance?: Record<string, unknown>;
};

export function createChronicleBoundaryEvent(input: BoundaryEventInput): ChronicleBoundaryEvent {
  return { ...input, schemaVersion: input.schemaVersion ?? 1 };
}

export function assertBoundaryChain(events: readonly ChronicleBoundaryEvent[]): void {
  const correlations = new Set(events.map((event) => event.correlationId));
  if (events.some((event) => !event.correlationId)) throw new Error('CHRONICLE_BOUNDARY_MISSING_CORRELATION_ID');
  if (events.length > 1 && correlations.size !== 1) throw new Error('CHRONICLE_BOUNDARY_CORRELATION_SPLIT');
  for (let index = 1; index < events.length; index += 1) {
    if (!events[index].causationId) throw new Error(`CHRONICLE_BOUNDARY_MISSING_CAUSATION_ID:${events[index].eventId}`);
    if (events[index].causationId !== events[index - 1].eventId) throw new Error(`CHRONICLE_BOUNDARY_CAUSATION_BREAK:${events[index].eventId}`);
  }
}

export function appendBoundaryEvent(stream: readonly ChronicleBoundaryEvent[], event: ChronicleBoundaryEvent): ChronicleBoundaryEvent[] {
  const next = [...stream, event];
  assertBoundaryChain(next);
  return next;
}
