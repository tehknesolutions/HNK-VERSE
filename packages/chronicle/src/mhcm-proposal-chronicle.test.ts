import test from 'node:test';
import assert from 'node:assert/strict';
import type { HnkEvent, MhcmProposalAppliedPayload } from '@hnk-verse/contracts';
import { projectZeroChronicle } from './zero-chronicle.ts';

const event:HnkEvent<MhcmProposalAppliedPayload>={eventId:'evt:mhcm:1',eventType:'MhcmProposalApplied',schemaVersion:1,verseId:'ZERO',worldId:'world:1',actorId:'i:tw',sessionId:'s:tw',targetId:'entity:mhcm:1',realTimestamp:'2026-09-29T18:00:00Z',worldTimestamp:'W1',correlationId:'corr:1',payload:{entityInstanceId:'entity:mhcm:1',proposalIrId:'IR-1',operator:'PATH_REVERSE',authority:{identityId:'i:tw',sessionId:'s:tw',presenceId:'p:tw'}}};

test('authorized MHCM world event projects one Chronicle creation entry',()=>{
  const entries=projectZeroChronicle([{sequenceNo:1,event}]);
  assert.equal(entries.length,1);
  assert.equal(entries[0].category,'CREATION');
  assert.equal(entries[0].authority,'WORLD_EVENT_DERIVED');
  assert.deepEqual(entries[0].sourceEventRefs,[event.eventId]);
});