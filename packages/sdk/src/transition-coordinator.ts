import type { VerseContext, TransitionRequest, TransitionResult, InteropOutcome, VerseCapabilityManifest, SdkErrorCode } from '@hnk-verse/contracts';
import { negotiateCapabilities } from './capability-negotiator.ts';
import { assertBoundaryChain, createChronicleBoundaryEvent, type ChronicleBoundaryEvent } from './chronicle-boundary.ts';

export type TransitionCoordinatorDeps = {
  resolveTargetManifest(targetVerseId: string): VerseCapabilityManifest | undefined;
  resolveTargetContext(request: TransitionRequest): VerseContext;
  prepareInterop(request: TransitionRequest): Promise<InteropOutcome[]>;
  now(): { realTimestamp: string; worldTimestamp: string };
  nextEventId(): string;
};

const SDK_ERROR_CODES: readonly SdkErrorCode[] = ['UNSUPPORTED_CAPABILITY','INCOMPATIBLE_VERSION','PERMISSION_DENIED','INVALID_CONTEXT','IDENTITY_RESOLUTION_FAILED','ENTITY_NOT_FOUND','INVALID_ADDRESS','TRANSITION_REJECTED','TRANSFER_REJECTED','TRANSLATION_FAILED','PROJECTION_FAILED','VERSE_UNAVAILABLE','VALIDATION_FAILED','CONFLICT','TIMEOUT','INTERNAL_VERSE_ERROR','PLATFORM_BOUNDARY_ERROR'];
const normalizeError=(error:unknown):SdkErrorCode=>{const code=(error as {code?:unknown})?.code;return typeof code==='string'&&SDK_ERROR_CODES.includes(code as SdkErrorCode)?code as SdkErrorCode:'INTERNAL_VERSE_ERROR';};

export class TransitionCoordinator {
  private readonly deps: TransitionCoordinatorDeps;
  constructor(deps: TransitionCoordinatorDeps) { this.deps = deps; }
  async transition(request: TransitionRequest): Promise<TransitionResult> {
    const events: ChronicleBoundaryEvent[]=[]; let last: ChronicleBoundaryEvent|undefined;
    const emit=(eventType:ChronicleBoundaryEvent['eventType'],payload:ChronicleBoundaryEvent['payload'])=>{const time=this.deps.now();const event=createChronicleBoundaryEvent({eventId:this.deps.nextEventId(),eventType,verseId:request.source.verseId,worldId:request.source.worldId,actorId:request.source.identityId,sessionId:request.source.sessionId,realTimestamp:time.realTimestamp,worldTimestamp:time.worldTimestamp,correlationId:request.correlationId,causationId:last?.eventId,payload});events.push(event);assertBoundaryChain(events);last=event;return event;};
    emit('VerseTransitionRequested',{sourceVerseId:request.source.verseId,targetVerseId:request.targetVerseId,sourceWorldId:request.source.worldId,targetWorldId:request.targetWorldId,requestedCapabilities:request.requestedInterop});
    try {
      const manifest=this.deps.resolveTargetManifest(request.targetVerseId); if(!manifest) throw Object.assign(new Error('VERSE_UNAVAILABLE'),{code:'VERSE_UNAVAILABLE'});
      const negotiation=negotiateCapabilities(manifest,{verseId:request.targetVerseId,requiredContracts:request.source.contracts,requestedCapabilities:request.requestedInterop,grantedPermissions:request.source.permissions,correlationId:request.correlationId});
      if(!negotiation.accepted){emit('VerseTransitionFailed',{sourceVerseId:request.source.verseId,targetVerseId:request.targetVerseId,errorCode:negotiation.code,reason:negotiation.rejectedCapabilities.join(',')});return {ok:false,state:'FAILED',code:negotiation.code,message:negotiation.code,outcomes:[],correlationId:request.correlationId};}
      emit('VerseCapabilityNegotiated',{sourceVerseId:request.source.verseId,targetVerseId:request.targetVerseId,acceptedCapabilities:negotiation.acceptedCapabilities});
      emit('VerseTransitionPrepared',{sourceVerseId:request.source.verseId,targetVerseId:request.targetVerseId});
      const outcomes=await this.deps.prepareInterop(request); const target=this.deps.resolveTargetContext(request);
      emit('VerseEntered',{sourceVerseId:request.source.verseId,targetVerseId:target.verseId,targetWorldId:target.worldId,outcomeRefs:outcomes.map(o=>o.kind)});
      emit('VerseTransitionCompleted',{sourceVerseId:request.source.verseId,targetVerseId:target.verseId,outcomeRefs:outcomes.map(o=>o.kind)});
      return {ok:true,state:'COMPLETED',target,outcomes,correlationId:request.correlationId};
    } catch(error) {const code=normalizeError(error);emit('VerseTransitionFailed',{sourceVerseId:request.source.verseId,targetVerseId:request.targetVerseId,errorCode:code,reason:error instanceof Error?error.message:String(error)});return {ok:false,state:'FAILED',code,message:error instanceof Error?error.message:String(error),outcomes:[],correlationId:request.correlationId};}
  }
}
