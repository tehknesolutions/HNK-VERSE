import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export type RemoteAuthState =
  | {
      mode: 'authenticated';
      userId: string;
      accessToken: string;
      isAnonymous: boolean;
    }
  | {
      mode: 'unavailable';
      reason: string;
    };

type PublicAuthConfig = {
  url?: string;
  publishableKey?: string;
};

export async function createRemoteAuth(
  config: PublicAuthConfig = {
    url: import.meta.env.VITE_SUPABASE_URL,
    publishableKey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
  },
  injectedClient?: SupabaseClient,
): Promise<RemoteAuthState> {
  if (!config.url || !config.publishableKey) {
    return { mode: 'unavailable', reason: 'REMOTE_AUTH_PUBLIC_CONFIG_MISSING' };
  }

  const client = injectedClient ?? createClient(config.url, config.publishableKey);

  try {
    const { data: sessionData, error: sessionError } = await client.auth.getSession();
    if (sessionError) {
      return { mode: 'unavailable', reason: `REMOTE_AUTH_SESSION_ERROR:${sessionError.message}` };
    }

    let session = sessionData.session;
    if (!session) {
      const { data, error } = await client.auth.signInAnonymously();
      if (error || !data.session || !data.user) {
        return {
          mode: 'unavailable',
          reason: `REMOTE_AUTH_ANONYMOUS_ERROR:${error?.message ?? 'SESSION_MISSING'}`,
        };
      }
      session = data.session;
    }

    const user = session.user;
    return {
      mode: 'authenticated',
      userId: user.id,
      accessToken: session.access_token,
      isAnonymous: user.is_anonymous === true,
    };
  } catch (error) {
    return {
      mode: 'unavailable',
      reason: `REMOTE_AUTH_UNEXPECTED:${error instanceof Error ? error.message : 'UNKNOWN'}`,
    };
  }
}
