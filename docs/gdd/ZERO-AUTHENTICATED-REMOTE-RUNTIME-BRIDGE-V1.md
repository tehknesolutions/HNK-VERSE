# HNK-VERSE — ZERO AUTHENTICATED REMOTE RUNTIME BRIDGE V1

**Status:** GATE OPEN / AUTH PROVIDER BLOCKED  
**Date:** 2026-09-23  
**Parent:** REMOTE_DB_GREEN  
**Target:** Web/PWA → authenticated trusted server → domain validation → PostgresPersistence

## 1. Why this gate exists

The remote database is now GREEN.

That does not authorize the browser to write authoritative World Events.

The production bridge must preserve:

`CLIENT / AI OUTPUT != AUTHORIZED WORLD MUTATION`.

Therefore the browser may send an intention/command request, but only a trusted server boundary may:

- bind the request to an authenticated HNK Identity;
- choose the authoritative World;
- reconstruct World state;
- run domain validation;
- append accepted Events through `PostgresPersistence`.

## 2. Current Web state

The live Web/PWA currently runs:

```text
ZeroCommandRuntime
→ BrowserLocalPersistence
→ localStorage
```

This remains the active production behavior until the remote bridge passes its own acceptance tests.

No dual-write is enabled.

## 3. Current Auth probe

A real Supabase JS probe was executed against the dedicated HNK-VERSE project using the public publishable key.

Call:

`supabase.auth.signInAnonymously()`

Result:

```text
status = 422
code = anonymous_provider_disabled
message = Anonymous sign-ins are disabled
```

No anonymous QA user was created.

Therefore anonymous Auth is a real external prerequisite, not an assumed capability.

## 4. Preferred ZERO identity path

For the no-friction ZERO experience, the preferred initial path is:

```text
first visit
→ Supabase anonymous authenticated user
→ stable auth.user.id
→ HNK Identity binding
→ Personal Verse binding
→ World binding
→ authenticated command API
```

Later, the same anonymous account may be linked to a permanent identity.

Anonymous Auth is not the same as the public `anon` API key.

## 5. Abuse-prevention prerequisite

Anonymous sign-ins can create database users without collecting PII.

Before enabling the provider for public production traffic, configure abuse protection appropriate to the public app, such as CAPTCHA/Turnstile and rate-limit review.

Do not enable a public anonymous-account creation path without an abuse-control decision.

## 6. Browser credential boundary

The Web/PWA may contain only:

- Supabase project URL;
- publishable key;
- user access/refresh session managed by Supabase Auth.

The browser must never contain:

- database password;
- `SUPABASE_DB_URL`;
- secret key;
- service-role key;
- unrestricted SQL endpoint.

## 7. Trusted server boundary

Preferred V1 host:

`Supabase Edge Function`

because the function receives server-managed environment credentials and can connect directly to the dedicated Postgres database.

Required deployment posture:

- JWT/user authentication required;
- no anonymous public mutation endpoint;
- no arbitrary SQL input;
- no arbitrary Event batch input;
- no browser-selected World authority.

## 8. Request model

The client submits a command intention.

Minimum request:

```ts
{
  commandId,
  commandType,
  idempotencyKey,
  targetId?,
  payload
}
```

The server derives or verifies:

- authenticated user ID;
- HNK Identity;
- Personal Verse;
- World;
- Avatar actor ID;
- session/correlation metadata;
- authoritative current sequence.

The client cannot grant itself another actor, World or authority scope.

## 9. Server execution chain

```text
authenticated request
→ verify user
→ resolve HNK Identity
→ resolve Personal Verse + World
→ restore authoritative World state
→ build server-bound HnkCommand
→ handleZeroCommand()
→ accepted/rejected decision
→ command receipt
→ PostgresPersistence.append()
→ snapshot policy
→ response projection
```

Only accepted domain Events reach the Event Ledger.

## 10. Identity provisioning

V1 must support idempotent first-run provisioning:

```text
auth.user.id
→ hnk_identity
→ primary personal_verse
→ primary world
→ world_stream(sequence=0)
```

Provisioning must be server-side and transactional.

One Auth user must not accidentally receive a second primary ZERO World after retry.

## 11. Private schema remains private

Do not add browser grants to `hnk_verse_private`.

Do not expose the authoritative tables through PostgREST merely to simplify the Web client.

The server boundary uses the already approved:

`PostgresPersistence + node-postgres (pg)`.

## 12. Local-to-remote transition

Existing browser-local ZERO data must not be silently uploaded into authoritative remote state.

Initial V1 choices must be explicit:

- NEW REMOTE WORLD;
- or a later audited migration/import flow.

For the first remote activation, prefer NEW REMOTE WORLD.

`LOCAL EVENT HISTORY != REMOTE AUTHORITATIVE HISTORY`

unless an explicit import protocol is designed and verified.

## 13. Offline policy

BrowserLocalPersistence remains useful for:

- offline/demo mode;
- deterministic QA;
- local fallback where remote mode is not enabled.

Remote mode must expose connectivity state clearly.

Do not silently switch between local and remote authority during one World session.

## 14. Acceptance tests

Before remote mode is enabled in production, prove:

1. Auth provider enabled intentionally;
2. abuse-control decision recorded;
3. first anonymous sign-in returns authenticated JWT;
4. JWT rejection for unauthenticated caller;
5. user A cannot resolve user B World;
6. first-run provisioning is idempotent;
7. server binds actor/world from Auth, not client;
8. accepted command persists through actual `PostgresPersistence`;
9. rejected command creates no World Event;
10. same idempotency key + same hash returns prior result;
11. different hash rejects;
12. concurrent commands preserve sequence safety;
13. refresh/reload reconstructs remote World;
14. new browser session with same authenticated account reconstructs same World;
15. browser has no secret DB credential;
16. private schema remains unavailable to browser roles;
17. Chronicle projection works from remote events;
18. production feature flag can disable remote mode safely.

## 15. Activation rule

Until all acceptance tests pass:

```text
REMOTE_DB_GREEN = true
REMOTE_WEB_AUTHORITY = false
WEB_PERSISTENCE_MODE = browser-local
```

After acceptance:

```text
REMOTE_DB_GREEN = true
REMOTE_WEB_AUTHORITY = true
WEB_PERSISTENCE_MODE = remote-authoritative
```

## 16. Current blocker

The concrete blocker discovered on 2026-09-23 is:

`anonymous_provider_disabled`.

Required human/admin action in Supabase:

- enable Anonymous Sign-Ins for HNK-VERSE;
- configure/review abuse protection before public activation.

No code should pretend this prerequisite is already satisfied.
