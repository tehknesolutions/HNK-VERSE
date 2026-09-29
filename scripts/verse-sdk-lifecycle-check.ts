import { VerseLifecycleRuntime } from '@hnk-verse/sdk';
import type { VerseContext, VerseRuntime } from '@hnk-verse/contracts';

const assert = (x: unknown, m: string) => {if(!x)throw new Error('VERSE_SDK_LIFECYCLE_CHECK_FAILED: '+m)};
const context:VerseContext={identityId:'HNKID-ZERO-001',sessionId:'SESSION-T6-001',presenceId:'PRESENCE-T6-001',verseId:'VERSE-ZERO-A-001',worldId:'WORLD-ZERO-A-001',roles:['player'],permissions:[],correlationId:'CORR-T6-001',contracts:[{name:'verse-sdk',version:'0.1'}]};
const ok=async()=>({ok:true} as const);
const runtime:VerseRuntime={initialize:ok,enter:ok,suspend:ok,resume:ok,exit:ok,dispose:ok};
const lifecycle=new VerseLifecycleRuntime(runtime);
assert(lifecycle.state==='UNINITIALIZED','initial state');
const invalidEnter=await lifecycle.enter(context); assert(!invalidEnter.ok&&lifecycle.state==='UNINITIALIZED','cannot enter before initialize');
assert((await lifecycle.initialize(context)).ok&&lifecycle.state==='READY','initialize -> ready');
assert((await lifecycle.enter(context)).ok&&lifecycle.state==='ACTIVE','enter -> active');
assert((await lifecycle.suspend(context)).ok&&lifecycle.state==='SUSPENDED','suspend -> suspended');
assert((await lifecycle.resume(context)).ok&&lifecycle.state==='ACTIVE','resume -> active');
assert((await lifecycle.exit(context)).ok&&lifecycle.state==='READY','exit -> ready');
const invalidResume=await lifecycle.resume(context); assert(!invalidResume.ok&&lifecycle.state==='READY','cannot resume from ready');
assert((await lifecycle.dispose(context)).ok&&lifecycle.state==='DISPOSED','dispose -> disposed');
const afterDispose=await lifecycle.initialize(context); assert(!afterDispose.ok&&lifecycle.state==='DISPOSED','disposed is terminal');
console.log('VERSE_SDK_LIFECYCLE_CHECK_PASS');
