import assert from 'node:assert/strict';
import test from 'node:test';
import type { HnkIrNode } from '@hnk-verse/mhcm';
import { createPresence } from './identity-presence.ts';
import { evaluateMhcmWorldOperation } from './mhcm-world-gate.ts';

const path = (id: string, nodes: string[]): HnkIrNode => ({
  irVersion: 1, id, type: 'Path', op: 'PATH_LITERAL', inputs: [],
  value: { id, start: nodes[0], nodes, edges: nodes.slice(0, -1).map((_, i) => `e:${i}`), end: nodes.at(-1), directed: true },
  metadata: { sourceAstKind: 'PathExpression', provenance: { source: 'hv-01.4-test', schemaVersion: 1, authorityStatus: 'EXPERIMENTAL', sourceRefs: ['HV-01.4'] } },
});

test('MHCM can transform path IR without mutating Presence authority', () => {
  const presence = createPresence({ id:'p:tw', identityId:'i:tw', sessionId:'s:tw', state:'ACTIVE', address:{verseId:'ZERO', spaceId:'malkuth'}, visibility:{online:true,verse:true,preciseLocation:false} });
  const result = evaluateMhcmWorldOperation('PATH_REVERSE', [path('route:a', ['malkuth','tiferet'])], presence);
  assert.equal(result.ir.type, 'Path');
  assert.equal(result.presence, presence);
  assert.equal(presence.address.spaceId, 'malkuth');
});

test('MHCM result is proposal data and never changes Identity, Session or Presence IDs', () => {
  const presence = createPresence({ id:'p:tw', identityId:'i:tw', sessionId:'s:tw', state:'ACTIVE', address:{verseId:'ZERO'}, visibility:{online:true,verse:true,preciseLocation:false} });
  const result = evaluateMhcmWorldOperation('PATH_COMPOSE', [path('a',['x','y']), path('b',['y','z'])], presence);
  assert.deepEqual(result.authority, { identityId:'i:tw', sessionId:'s:tw', presenceId:'p:tw' });
  assert.equal(result.effect, 'PROPOSAL_ONLY');
});

test('invalid MHCM operations fail before any World state transition is produced', () => {
  const presence = createPresence({ id:'p:tw', identityId:'i:tw', sessionId:'s:tw', state:'ACTIVE', address:{verseId:'ZERO'}, visibility:{online:true,verse:true,preciseLocation:false} });
  assert.throws(() => evaluateMhcmWorldOperation('PATH_COMPOSE', [path('a',['x','y'])], presence));
  assert.equal(presence.state, 'ACTIVE');
});
