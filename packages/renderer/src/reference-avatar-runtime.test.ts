import { describe, expect, it } from 'vitest';
import {
  TECNOMAGE_PRIME_V28,
  createReferenceAvatarRuntimePlan,
} from './reference-avatar-runtime.ts';

describe('reference avatar runtime adapter', () => {
  it('maps Tecnomage locomotion and actions without importing Three.js', () => {
    const plan = createReferenceAvatarRuntimePlan(TECNOMAGE_PRIME_V28);

    expect(plan.states).toEqual([
      'IDLE', 'WALK', 'RUN', 'SPRINT',
      'DODGE', 'PULSE', 'ATTACK_LIGHT', 'ATTACK_HEAVY',
    ]);
    expect(plan.clipByState.IDLE).toBe('UAL1_Idle_Loop');
    expect(plan.clipByState.SPRINT).toBe('UAL1_Sprint_Loop');
    expect(plan.clipByState.ATTACK_HEAVY).toBe('UAL2_Sword_Heavy_Combo');
    expect(plan.oneShotStates).toEqual([
      'DODGE', 'PULSE', 'ATTACK_LIGHT', 'ATTACK_HEAVY',
    ]);
  });

  it('preserves primary, float fallback and procedural fallback policy', () => {
    const plan = createReferenceAvatarRuntimePlan(TECNOMAGE_PRIME_V28);

    expect(plan.assetAttempts).toEqual([
      '/assets/characters/tecnomage-prime-v2.8-runtime-q.glb',
      '/assets/characters/tecnomage-prime-v2.8-runtime-optimized.glb',
    ]);
    expect(plan.finalFallback).toBe('procedural');
  });
});
