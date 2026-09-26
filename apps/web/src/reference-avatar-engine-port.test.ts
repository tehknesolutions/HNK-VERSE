import { describe, expect, it, vi } from 'vitest';
import { createThreeReferenceAvatarEnginePort } from './reference-avatar-engine-port.ts';

describe('Three reference avatar engine port', () => {
  it('delegates asset loading, state transitions and frame updates to a controller factory', async () => {
    const load = vi.fn().mockResolvedValue(true);
    const update = vi.fn();
    const pulse = vi.fn();
    const root = { kind: 'three-group' };
    const controller = { root, load, update, pulse };
    const factory = vi.fn(() => controller);

    const port = createThreeReferenceAvatarEnginePort(factory);
    const handle = await port.load('/hero.glb');
    port.setState('RUN');
    port.update(0.016);

    expect(factory).toHaveBeenCalledTimes(1);
    expect(load).toHaveBeenCalledWith('/hero.glb');
    expect(handle).toBe(root);
    expect(update).toHaveBeenCalledWith(0.016, 'RUN');
  });

  it('throws on failed controller load so the engine-neutral adapter can try its next asset', async () => {
    const controller = {
      root: {},
      load: vi.fn().mockResolvedValue(false),
      update: vi.fn(),
      pulse: vi.fn(),
    };
    const port = createThreeReferenceAvatarEnginePort(() => controller);

    await expect(port.load('/missing.glb')).rejects.toThrow('Reference avatar asset failed');
  });

  it('provides a procedural handle without importing campaign identity into the port', () => {
    const procedural = { kind: 'procedural-avatar' };
    const port = createThreeReferenceAvatarEnginePort(
      () => ({ root: {}, load: vi.fn(), update: vi.fn(), pulse: vi.fn() }),
      () => procedural,
    );

    expect(port.procedural()).toBe(procedural);
  });
});
