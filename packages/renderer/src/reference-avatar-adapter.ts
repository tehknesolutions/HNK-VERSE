import type {
  ReferenceAvatarRuntimePlan,
  ReferenceAvatarRuntimeState,
} from './reference-avatar-runtime.ts';

export type ReferenceAvatarHandle = unknown;

export type ReferenceAvatarEnginePort = {
  load(asset: string): Promise<ReferenceAvatarHandle>;
  procedural(): ReferenceAvatarHandle;
  setState(state: ReferenceAvatarRuntimeState): void;
  update(deltaSeconds: number): void;
};

export type MountedReferenceAvatar = {
  handle: ReferenceAvatarHandle;
  source: 'asset' | 'procedural';
  asset?: string;
};

export function createReferenceAvatarAdapter(
  plan: ReferenceAvatarRuntimePlan,
  engine: ReferenceAvatarEnginePort,
) {
  let mounted: MountedReferenceAvatar | undefined;

  return {
    async mount(): Promise<MountedReferenceAvatar> {
      if (mounted) return mounted;

      for (const asset of plan.assetAttempts) {
        try {
          const handle = await engine.load(asset);
          mounted = { handle, source: 'asset', asset };
          return mounted;
        } catch {
          // Asset failure is expected to degrade to the next policy candidate.
        }
      }

      const handle = engine.procedural();
      mounted = { handle, source: 'procedural' };
      return mounted;
    },

    setState(state: ReferenceAvatarRuntimeState): void {
      if (!plan.states.includes(state)) {
        throw new Error(`Unsupported reference avatar state: ${state}`);
      }
      engine.setState(state);
    },

    update(deltaSeconds: number): void {
      if (!Number.isFinite(deltaSeconds) || deltaSeconds < 0) {
        throw new Error('Reference avatar deltaSeconds must be a finite non-negative number');
      }
      engine.update(deltaSeconds);
    },
  };
}
