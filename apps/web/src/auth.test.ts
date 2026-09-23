import { describe, expect, it, vi } from 'vitest';

import { createRemoteAuth } from './auth';

const config = { url: 'https://example.supabase.co', publishableKey: 'sb_publishable_test' };

function clientWith(auth: Record<string, unknown>) {
  return { auth } as never;
}

describe('createRemoteAuth', () => {
  it('fails closed when public configuration is missing', async () => {
    await expect(createRemoteAuth({}, clientWith({}))).resolves.toEqual({
      mode: 'unavailable',
      reason: 'REMOTE_AUTH_PUBLIC_CONFIG_MISSING',
    });
  });

  it('reuses an existing authenticated anonymous session', async () => {
    const signInAnonymously = vi.fn();
    const client = clientWith({
      getSession: vi.fn().mockResolvedValue({
        data: { session: { access_token: 'secret-token', user: { id: 'user-a', is_anonymous: true } } },
        error: null,
      }),
      signInAnonymously,
    });

    await expect(createRemoteAuth(config, client)).resolves.toEqual({
      mode: 'authenticated', userId: 'user-a', accessToken: 'secret-token', isAnonymous: true,
    });
    expect(signInAnonymously).not.toHaveBeenCalled();
  });

  it('creates an anonymous session when none exists', async () => {
    const client = clientWith({
      getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
      signInAnonymously: vi.fn().mockResolvedValue({
        data: {
          session: { access_token: 'new-token', user: { id: 'user-b', is_anonymous: true } },
          user: { id: 'user-b', is_anonymous: true },
        },
        error: null,
      }),
    });

    await expect(createRemoteAuth(config, client)).resolves.toEqual({
      mode: 'authenticated', userId: 'user-b', accessToken: 'new-token', isAnonymous: true,
    });
  });

  it('keeps Web local when anonymous sign-in is unavailable', async () => {
    const client = clientWith({
      getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
      signInAnonymously: vi.fn().mockResolvedValue({
        data: { session: null, user: null },
        error: { message: 'anonymous_provider_disabled' },
      }),
    });

    const result = await createRemoteAuth(config, client);
    expect(result.mode).toBe('unavailable');
    if (result.mode === 'unavailable') expect(result.reason).toContain('anonymous_provider_disabled');
  });
});
