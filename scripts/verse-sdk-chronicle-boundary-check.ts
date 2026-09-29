import { assertBoundaryChain, createChronicleBoundaryEvent } from '@hnk-verse/sdk';

const assert: (x: unknown, m: string) => asserts x = (x, m) => {if(!x)throw new Error('VERSE_SDK_CHRONICLE_CHECK_FAILED: '+m)};
const common={verseId:'VERSE-ZERO-HUB-001',worldId:'WORLD-ZERO-MALKUTH-001',actorId:'HNKID-ZERO-001',sessionId:'SESSION-TASK3-001',realTimestamp:'2026-09-27T23:00:00Z',worldTimestamp:'DAY-001T10:00:00',correlationId:'CORR-TASK3-001'};
const requested=createChronicleBoundaryEvent({...common,eventId:'EVT-T3-001',eventType:'VerseTransitionRequested',payload:{sourceVerseId:'VERSE-ZERO-HUB-001',targetVerseId:'VERSE-ZERO-A-001',sourceWorldId:'WORLD-ZERO-MALKUTH-001',targetWorldId:'WORLD-ZERO-A-001',requestedCapabilities:['embodiment.verse-native']}});
const negotiated=createChronicleBoundaryEvent({...common,eventId:'EVT-T3-002',eventType:'VerseCapabilityNegotiated',causationId:requested.eventId,payload:{sourceVerseId:'VERSE-ZERO-HUB-001',targetVerseId:'VERSE-ZERO-A-001',acceptedCapabilities:['embodiment.verse-native']}});
const entered=createChronicleBoundaryEvent({...common,eventId:'EVT-T3-003',eventType:'VerseEntered',causationId:negotiated.eventId,payload:{sourceVerseId:'VERSE-ZERO-HUB-001',targetVerseId:'VERSE-ZERO-A-001',targetWorldId:'WORLD-ZERO-A-001'}});
assertBoundaryChain([requested,negotiated,entered]);
assert(entered.causationId===negotiated.eventId,'causation must reference immediately preceding event');
let rejected=false;
try{assertBoundaryChain([requested,{...negotiated,correlationId:'CORR-OTHER'}]);}catch{rejected=true;}
assert(rejected,'split correlation chains must reject');
rejected=false;
try{assertBoundaryChain([requested,{...negotiated,causationId:'WRONG-EVENT'}]);}catch{rejected=true;}
assert(rejected,'broken causation chains must reject');
console.log('VERSE_SDK_CHRONICLE_BOUNDARY_CHECK_PASS');
