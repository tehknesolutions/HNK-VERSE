import type {
  ReferenceAvatarEnginePort,
  ReferenceAvatarHandle,
  ReferenceAvatarRuntimeState,
} from '@hnk-verse/renderer';

export type TecnomageControllerPort = {
  readonly root: ReferenceAvatarHandle;
  load(asset: string): Promise<boolean>;
  update(deltaSeconds: number, state: ReferenceAvatarRuntimeState): void;
  pulse(): void;
};

export type TecnomageControllerFactory = () => TecnomageControllerPort;
export type ProceduralAvatarFactory = () => ReferenceAvatarHandle;

export function createThreeReferenceAvatarEnginePort(
  createController: TecnomageControllerFactory,
  createProcedural: ProceduralAvatarFactory = () => ({ kind: 'reference-avatar-procedural' }),
): ReferenceAvatarEnginePort {
  let controller: TecnomageControllerPort | undefined;
  let state: ReferenceAvatarRuntimeState = 'IDLE';

  const ensureController = (): TecnomageControllerPort => {
    controller ??= createController();
    return controller;
  };

  return {
    async load(asset: string): Promise<ReferenceAvatarHandle> {
      const active = ensureController();
      const loaded = await active.load(asset);
      if (!loaded) {
        throw new Error(`Reference avatar asset failed: ${asset}`);
      }
      return active.root;
    },

    procedural(): ReferenceAvatarHandle {
      return createProcedural();
    },

    setState(next: ReferenceAvatarRuntimeState): void {
      state = next;
    },

    update(deltaSeconds: number): void {
      ensureController().update(deltaSeconds, state);
    },
  };
}
