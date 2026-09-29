import test from 'node:test';
import assert from 'node:assert/strict';
import type { HnkIrNode } from '@hnk-verse/mhcm';
import { createPresence } from './identity-presence.ts';
import { createWorldGraph } from './world-graph.ts';
import { applyMhcmWorldProposal } from './mhcm-world-runtime.ts';
import type { MhcmWorldProposal } from './mhcm-world-gate.ts';

const ir: HnkIrNode = { irVersion:1,id:'IR-OP-PATH_REVERSE-A',type:'Path',op:'MHCM_OPERATOR',inputs:['A'],value:{operator:'PATH_REVERSE'},metadata:{typeSystemVersion:'1',sourceAstKind:'PathExpression',provenance:{source:'hv-01.6-test'}} };
const presence=createPresence({id:'p:tw',identityId:'i:tw',sessionId:'s:tw',state:'ACTIVE',address:{verseId:'ZERO'},visibility:{online:true,verse:true,preciseLocation:false}});
const proposal: MhcmWorldProposal={effect:'PROPOSAL_ONLY',ir,presence,authority:{identityId:'i:tw',sessionId:'s:tw',presenceId:'p:tw'}};
const base=()=>({proposal,graph:createWorldGraph(),presence,targetVerseId:'ZERO',entityId:'entity:mhcm:1',event:{eventId:'evt:1',worldId:'world:1',realTimestamp:'2026-09-29T18:00:00Z',worldTimestamp:'W1',correlationId:'corr:1'}} as const);

test('authorized path proposal materializes and emits authoritative event',()=>{ const r=applyMhcmWorldProposal(base()); assert.equal(r.status,'APPLIED'); if(r.status==='APPLIED'){assert.ok(r.graph.entities.has('entity:mhcm:1'));assert.equal(r.event.eventType,'MhcmProposalApplied');} });
test('authority mismatch rejects without mutation',()=>{const b=base();const r=applyMhcmWorldProposal({...b,presence:createPresence({...presence,identityId:'other'})});assert.equal(r.status,'REJECTED');assert.equal(r.graph,b.graph);assert.equal(r.event,undefined);});
test('inactive presence rejects without mutation',()=>{const b=base();const r=applyMhcmWorldProposal({...b,presence:createPresence({...presence,state:'IDLE'})});assert.equal(r.status,'REJECTED');assert.equal(r.graph,b.graph);});
test('verse mismatch rejects without mutation',()=>{const b=base();const r=applyMhcmWorldProposal({...b,targetVerseId:'OTHER'});assert.equal(r.status,'REJECTED');assert.equal(r.graph,b.graph);});
test('non Path proposal rejects without mutation',()=>{const b=base();const bad={...proposal,ir:{...ir,type:'Glyph' as const}};const r=applyMhcmWorldProposal({...b,proposal:bad});assert.equal(r.status,'REJECTED');assert.equal(r.graph,b.graph);});