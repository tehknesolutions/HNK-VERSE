import assert from 'node:assert/strict';
import test from 'node:test';
import { createPresence } from './identity-presence.ts';
import { connectPresence, createPresenceRegistry, disconnectSession, getIdentityPresences, reconnectPresence } from './presence-registry.ts';

test('one identity can hold multiple presences through distinct sessions', () => {
  let r = createPresenceRegistry();
  r = connectPresence(r, createPresence({ id:'p:d', identityId:'i:tw', sessionId:'s:d', state:'ACTIVE', address:{verseId:'ZERO'}, visibility:{online:true,verse:true,preciseLocation:false} }));
  r = connectPresence(r, createPresence({ id:'p:m', identityId:'i:tw', sessionId:'s:m', state:'IDLE', address:{verseId:'ALAKAZAM'}, visibility:{online:true,verse:true,preciseLocation:false} }));
  assert.equal(getIdentityPresences(r, 'i:tw').length, 2);
});

test('duplicate presence IDs are rejected instead of silently replacing ownership', () => {
  let r = createPresenceRegistry();
  r = connectPresence(r, createPresence({ id:'p:1', identityId:'i:a', sessionId:'s:a', state:'ACTIVE', address:{verseId:'ZERO'}, visibility:{online:true,verse:true,preciseLocation:false} }));
  assert.throws(() => connectPresence(r, createPresence({ id:'p:1', identityId:'i:b', sessionId:'s:b', state:'ACTIVE', address:{verseId:'ZERO'}, visibility:{online:true,verse:true,preciseLocation:false} })), /already registered/);
});

test('disconnect and reconnect preserve ownership while changing only lifecycle/context', () => {
  let r = createPresenceRegistry();
  r = connectPresence(r, createPresence({ id:'p:d', identityId:'i:tw', sessionId:'s:d', state:'ACTIVE', address:{verseId:'ZERO'}, visibility:{online:true,verse:true,preciseLocation:false} }));
  r = disconnectSession(r, 's:d');
  assert.equal(r.presences.get('p:d')?.state, 'OFFLINE');
  r = reconnectPresence(r, 'p:d', {verseId:'ALAKAZAM'});
  assert.equal(r.presences.get('p:d')?.identityId, 'i:tw');
  assert.equal(r.presences.get('p:d')?.sessionId, 's:d');
  assert.equal(r.presences.get('p:d')?.state, 'ACTIVE');
});
