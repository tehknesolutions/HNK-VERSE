import type { VerseContext, TransitionRequest, TransitionResult, InteropOutcome } from '@hnk-verse/contracts';
import { negotiateCapabilities, type VerseCapabilityManifest } from '@hnk-verse/sdk';
import { assertBoundaryChain, createChronicleBoundaryEvent, type ChronicleBoundaryEvent } from './chronicle-boundary.ts';

export type TransitionCoordinatorDeps = {
  resolveTargetManifest(targetVerseId: string): VerseCapabilityManifest | undefined;
  resolveTargetContext(request: TransitionRequest): VerseContext;
  prepareInterop(request: TransitionRequest): Promise<InteropOutcome[]>;
  now(): { realTimestamp: string; worldTimestamp: string };
  nextEventId(): string;
};

export class TransitionCoordinator {
  constructor(private readonly deps: TransitionCoordinatorDeps) {}

  async transition(request: TransitionRequest): Promise<TransitionResult> {
    const events: ChronicleBoundaryEvent[] = [];
    const correlationId = request.correlationId;

    const emit = (
      eventType: ChronicleBoundaryEvent['eventType'],
      causationId: string | undefined,
      payload: ChronicleBoundaryEvent['payload'],
    ) => {
      const time = this.deps.now();
      const event = createChronicleBoundaryEvent({
        eventId: this.deps.nextEventId(),
        eventType,
        verseId: request.source.verseId,
        worldId: request.source.worldId,
        actorId: request.source.identityId,
        sessionId: request.source.sessionId,
        realTimestamp: time.realTimestamp,
        worldTimestamp: time.worldTimestamp,
        correlationId,
        causationId,
        payload,
      });
      events.push(event);
      assertBoundaryChain(events);
      return event;
    };

    let last = emit('VerseTransitionRequested', undefined, {
      sourceVerseId: request.source.verseId,
      targetVerseId: request.targetVerseId,
      sourceWorldId: request.source.worldId,
      targetWorldId: request.targetWorldId,
      requestedCapabilities: request.requestedInterop,
    });

    try {
      const manifest = this.deps.resolveTargetManifest(request.targetVerseId);
      if (!manifest) throw Object.assign(new Error('VERSE_UNAVAILABLE'), { code: 'VERSE_UNAVAILABLE' });

      const negotiation = negotiateCapabilities(manifest, {
        verseId: request.targetVerseId,
        requiredContracts: request.source.contracts,
        requestedCapabilities: request.requestedInterop,
        grantedPermissions: request.source.permissions,
        correlationId,
      });

      if (!negotiation.accepted) {
        emit('VerseTransitionFailed', last.eventId, {
          sourceVerseId: request.source.verseId,
          targetVerseId: request.targetVerseId,
          errorCode: negotiation.code,
          reason: negotiation.rejectedCapabilities.join(','),
        });
        return { ok: false, state: 'FAILED', code: negotiation.code, message: negotiation.code, outcomes: [], correlationId };
      }

      last = emit('VerseCapabilityNegotiated', last.eventId, {
        sourceVerseId: request.source.verseId,
        targetVerseId: request.targetVerseId,
        acceptedCapabilities: negotiation.acceptedCapabilities,
      });

      last = emit('VerseTransitionPrepared', last.eventId, {
        sourceVerseId: request.source.verseId,
        targetVerseId: request.targetVerseId,
      });

      const outcomes = await this.deps.prepareInterop(request);
      const target = this.deps.resolveTargetContext(request);
      last = emit('VerseEntered', last.eventId, {
        sourceVerseId: request.source.verseId,
        targetVerseId: target.verseId,
        targetWorldId: target.worldId,
        outcomeRefs: outcomes.map((outcome) => outcome.kind),
      });

      emit('VerseTransitionCompleted', last.eventId, {
        sourceVerseId: request.source.verseId,
        targetVerseId: target.verseId,
        outcomeRefs: outcomes.map((outcome) => outcome.kind),
      });

      return { ok: true, state: 'COMPLETED', target, outcomes, correlationId };
    } catch (error) {
      const code = (error as { code?: string }).code ?? 'INTERNAL_VERSE_ERROR';
      emit('VerseTransitionFailed', last.eventId, {
        sourceVerseId: request.source.verseId,
        targetVerseId: request.targetVerseId,
        errorCode: code,
        reason: error instanceof Error ? error.message : String(error),
      });
      return { ok: false, state: 'FAILED', code: code as TransitionResult extends infer _T ? any : never, message: error instanceof Error ? error.message : String(error), outcomes: [], correlationId };
    }
  }
}