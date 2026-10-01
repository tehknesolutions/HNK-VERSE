import type { HnkEvent, MhcmProposalAppliedPayload } from '@hnk-verse/contracts';
import type { PlatformPresence } from './identity-presence.ts';
import type { MhcmWorldProposal } from './mhcm-world-gate.ts';
import { upsertWorldEntity, type WorldGraph } from './world-graph.ts';

export type MhcmWorldRuntimeRequest = { proposal: MhcmWorldProposal; graph: WorldGraph; presence: PlatformPresence; targetVerseId: string; entityId: string; event: { eventId:string; worldId:string; realTimestamp:string; worldTimestamp:string; correlationId:string } };
export type MhcmWorldRuntimeResult = { status:'APPLIED'; graph:WorldGraph; event:HnkEvent<MhcmProposalAppliedPayload> } | { status:'REJECTED'; graph:WorldGraph; event?:undefined; reason:string };
const reject=(graph:WorldGraph,reason:string):MhcmWorldRuntimeResult=>({status:'REJECTED',graph,reason});

export function applyMhcmWorldProposal(request: MhcmWorldRuntimeRequest): MhcmWorldRuntimeResult {
  const {proposal,presence,graph}=request;
  if(proposal.authority.identityId!==presence.identityId || proposal.authority.sessionId!==presence.sessionId || proposal.authority.presenceId!==presence.id) return reject(graph,'AUTHORITY_MISMATCH');
  if(presence.state!=='ACTIVE') return reject(graph,'PRESENCE_INACTIVE');
  if(presence.address.verseId!==request.targetVerseId) return reject(graph,'VERSE_MISMATCH');
  if(proposal.ir.type!=='Path') return reject(graph,'INVALID_PATH_IR');
  const operator=typeof proposal.ir.value.operator==='string'?proposal.ir.value.operator:proposal.ir.op;
  const authority={...proposal.authority};
  const next=upsertWorldEntity(graph,{id:request.entityId,kind:'OBJECT',address:{verseId:request.targetVerseId},data:{mhcmIr:structuredClone(proposal.ir),provenance:structuredClone(proposal.ir.metadata.provenance),authority}});
  const payload:MhcmProposalAppliedPayload={entityInstanceId:request.entityId,proposalIrId:proposal.ir.id,operator,authority};
  const event:HnkEvent<MhcmProposalAppliedPayload>={...request.event,eventType:'MhcmProposalApplied',schemaVersion:1,verseId:request.targetVerseId,actorId:presence.identityId,sessionId:presence.sessionId,targetId:request.entityId,payload,provenance:{mhcm:structuredClone(proposal.ir.metadata.provenance),authority}};
  return {status:'APPLIED',graph:next,event};
}