import test from 'node:test';
import assert from 'node:assert/strict';
import { compileKode, executeMhcmProgram } from '@hnk-verse/mhcm';
import { projectZeroChronicle } from '@hnk-verse/chronicle';
import { createPresence } from './identity-presence.ts';
import { evaluateMhcmWorldOperation } from './mhcm-world-gate.ts';
import { createWorldGraph } from './world-graph.ts';
import { applyMhcmWorldProposal } from './index.ts';

const presence=createPresence({id:'p:e2e',identityId:'i:e2e',sessionId:'s:e2e',state:'ACTIVE',address:{verseId:'ZERO'},visibility:{online:true,verse:true,preciseLocation:false}});
function proposal(){const program=compileKode('path route = malkuth -> tiferet;');const executed=executeMhcmProgram(program);return evaluateMhcmWorldOperation('PATH_REVERSE',[executed.outputs[0]],presence);}
const event={eventId:'evt:e2e:1',worldId:'world:e2e',realTimestamp:'2026-09-29T19:00:00Z',worldTimestamp:'W-E2E-1',correlationId:'corr:e2e:1'};

test('KODE/MHCM proposal crosses authority into World and Chronicle',()=>{const p=proposal();const r=applyMhcmWorldProposal({proposal:p,graph:createWorldGraph(),presence,targetVerseId:'ZERO',entityId:'entity:e2e:1',event});assert.equal(r.status,'APPLIED');if(r.status!=='APPLIED')return;assert.ok(r.graph.entities.has('entity:e2e:1'));assert.equal(r.event.eventType,'MhcmProposalApplied');assert.deepEqual((r.event.provenance as any).mhcm,p.ir.metadata.provenance);assert.deepEqual((r.event.provenance as any).authority,p.authority);const history=projectZeroChronicle([{sequenceNo:1,event:r.event}]);assert.equal(history.length,1);assert.equal(history[0].category,'CREATION');assert.deepEqual(history[0].sourceEventRefs,[r.event.eventId]);});
test('authority mismatch cannot create World state or Chronicle history',()=>{const p=proposal();const graph=createWorldGraph();const other=createPresence({...presence,identityId:'i:other'});const r=applyMhcmWorldProposal({proposal:p,graph,presence:other,targetVerseId:'ZERO',entityId:'entity:e2e:2',event:{...event,eventId:'evt:e2e:2'}});assert.equal(r.status,'REJECTED');assert.equal(r.graph,graph);assert.equal(r.event,undefined);assert.deepEqual(projectZeroChronicle([]),[]);});