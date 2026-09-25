import type { ReferenceAvatarDefinition } from './reference-avatar.ts';

export type ReferenceAvatarRuntimeState =
  | 'IDLE'
  | 'WALK'
  | 'RUN'
  | 'SPRINT'
  | 'DODGE'
  | 'PULSE'
  | 'ATTACK_LIGHT'
  | 'ATTACK_HEAVY';

export type ReferenceAvatarRuntimePlan = {
  characterId: string;
  states: readonly ReferenceAvatarRuntimeState[];
  clipByState: Readonly<Record<ReferenceAvatarRuntimeState, string>>;
  oneShotStates: readonly ReferenceAvatarRuntimeState[];
  assetAttempts: readonly string[];
  finalFallback: 'procedural';
};

const STATES = [
  'IDLE',
  'WALK',
  'RUN',
  'SPRINT',
  'DODGE',
  'PULSE',
  'ATTACK_LIGHT',
  'ATTACK_HEAVY',
] as const satisfies readonly ReferenceAvatarRuntimeState[];

const CLIP_BY_STATE: Readonly<Record<ReferenceAvatarRuntimeState, string>> = {
  IDLE: 'UAL1_Idle_Loop',
  WALK: 'UAL1_Walk_Loop',
  RUN: 'UAL1_Jog_Fwd_Loop',
  SPRINT: 'UAL1_Sprint_Loop',
  DODGE: 'UAL1_Roll',
  PULSE: 'UAL1_Spell_Simple_Shoot',
  ATTACK_LIGHT: 'UAL1_Sword_Attack',
  ATTACK_HEAVY: 'UAL2_Sword_Heavy_Combo',
};

const ONE_SHOT_STATES = [
  'DODGE',
  'PULSE',
  'ATTACK_LIGHT',
  'ATTACK_HEAVY',
] as const satisfies readonly ReferenceAvatarRuntimeState[];

export function createReferenceAvatarRuntimePlan(
  definition: ReferenceAvatarDefinition,
): ReferenceAvatarRuntimePlan {
  const assetAttempts = [definition.asset.primary, definition.asset.fallback]
    .filter((asset): asset is string => Boolean(asset));

  return {
    characterId: definition.characterId,
    states: STATES,
    clipByState: CLIP_BY_STATE,
    oneShotStates: ONE_SHOT_STATES,
    assetAttempts,
    finalFallback: 'procedural',
  };
}
