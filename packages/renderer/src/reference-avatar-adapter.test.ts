import { describe, expect, it, vi } from 'vitest';
import { TECNOMAGE_PRIME_V28 } from './reference-avatar.ts';
import { createReferenceAvatarRuntimePlan } from './reference-avatar-runtime.ts';
import { createReferenceAvatarAdapter } from './reference-avatar-adapter.ts';

describe('reference avatar engine adapter', () => {
  it('loads assets in policy order and stops at first success', async () => {
    const load = vi.fn()
      .mockRejectedValueOnce(new Error('quantized unavailable'))
      .mockResolvedValueOnce({ handle: 'float-model' });
    const procedural = vi.fn(() => ({ handle: 'procedural-model' }));
    const setState = vi.fn();
    const update = vi.fn();

    const adapter = createReferenceAvatarAdapter(
      createReferenceAvatarRuntimePlan(TECNOMAGE_PRIME_V28),
      { load, procedural, setState, update },
    );

    const result = await adapter.mount();

    expect(load).toHaveBeenCalledTimes(2);
    expect(load.mock.calls.map(([asset]) => asset)).toEqual([
      '/assets/characters/tecnomage-prime-v2.8-runtime-q.glb',
      '/assets/characters/tecnomage-prime-v2.8-runtime-optimized.glb',
    ]);
    expect(procedural).not.toHaveBeenCalled();
    expect(result.source).toBe('asset');
  });

  it('falls back procedurally and forwards state/update without engine knowledge', async () => {
    const load = vi.fn().mockRejectedValue(new Error('offline'));
    const procedural = vi.fn(() => ({ handle: 'procedural-model' }));
    const setState = vi.fn();
    const update = vi.fn();

    const adapter = createReferenceAvatarAdapter(
      createReferenceAvatarRuntimePlan(TECNOMAGE_PRIME_V28),
      { load, procedural, setState, update },
    );

    const mounted = await adapter.mount();
    adapter.setState('RUN');
    adapter.update(0.016);

    expect(mounted.source).toBe('procedural');
    expect(procedural).toHaveBeenCalledTimes(1);
    expect(setState).toHaveBeenCalledWith('RUN');
    expect(update).toHaveBeenCalledWith(0.016);
  });
});
