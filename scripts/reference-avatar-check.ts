import {
  TECNOMAGE_PRIME_V28,
  createReferenceAvatarDescriptor,
  createReferenceAvatarRuntimePlan,
  resolveReferenceAvatarAsset,
} from '@hnk-verse/renderer';

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function equal<T>(actual: T, expected: T, message: string): void {
  if (!Object.is(actual, expected)) {
    throw new Error(`${message}: expected ${String(expected)}, got ${String(actual)}`);
  }
}

const descriptor = createReferenceAvatarDescriptor(TECNOMAGE_PRIME_V28);
const asset = resolveReferenceAvatarAsset(TECNOMAGE_PRIME_V28);
const runtime = createReferenceAvatarRuntimePlan(TECNOMAGE_PRIME_V28);

equal(descriptor.characterId, 'tecnomage-prime', 'Wrong reference avatar character');
equal(descriptor.verseId, 'strangeverse', 'Reference avatar escaped Strangeverse namespace');
equal(descriptor.campaignId, 'alakazam-and-the-strangeverse', 'Wrong campaign binding');
equal(descriptor.role, 'reference-avatar', 'Wrong avatar role');
equal(descriptor.playerIdentity, 'independent', 'Reference avatar must not become player identity');
equal(asset.primary, '/assets/characters/tecnomage-prime-v2.8-runtime-q.glb', 'Wrong primary runtime asset');
equal(asset.fallback, '/assets/characters/tecnomage-prime-v2.8-runtime-optimized.glb', 'Wrong fallback runtime asset');
assert(descriptor.visualEvolution === 'ANATOMY27 → HERO39', 'Visual evolution line changed unexpectedly');

equal(runtime.characterId, 'tecnomage-prime', 'Runtime plan bound to wrong character');
equal(runtime.states.length, 8, 'Runtime state surface changed');
equal(runtime.clipByState.IDLE, 'UAL1_Idle_Loop', 'Wrong IDLE clip');
equal(runtime.clipByState.WALK, 'UAL1_Walk_Loop', 'Wrong WALK clip');
equal(runtime.clipByState.RUN, 'UAL1_Jog_Fwd_Loop', 'Wrong RUN clip');
equal(runtime.clipByState.SPRINT, 'UAL1_Sprint_Loop', 'Wrong SPRINT clip');
equal(runtime.clipByState.DODGE, 'UAL1_Roll', 'Wrong DODGE clip');
equal(runtime.clipByState.PULSE, 'UAL1_Spell_Simple_Shoot', 'Wrong PULSE clip');
equal(runtime.clipByState.ATTACK_LIGHT, 'UAL1_Sword_Attack', 'Wrong light attack clip');
equal(runtime.clipByState.ATTACK_HEAVY, 'UAL2_Sword_Heavy_Combo', 'Wrong heavy attack clip');
equal(runtime.oneShotStates.join(','), 'DODGE,PULSE,ATTACK_LIGHT,ATTACK_HEAVY', 'Wrong one-shot state policy');
equal(runtime.assetAttempts.join(','), [asset.primary, asset.fallback].join(','), 'Runtime asset policy diverged from avatar definition');
equal(runtime.finalFallback, 'procedural', 'Runtime must fail gracefully to procedural avatar');

console.log('REFERENCE_AVATAR_GATE_PASS');
console.log('REFERENCE_AVATAR_RUNTIME_GATE_PASS');
