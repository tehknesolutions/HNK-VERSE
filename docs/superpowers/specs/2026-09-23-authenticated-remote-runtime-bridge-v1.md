# Authenticated Remote Runtime Bridge V1

**Issue:** #39 — Authenticated Remote Runtime Bridge
**Status:** APPROVED DESIGN / IMPLEMENTATION NOT YET STARTED
**Date:** 2026-09-23

## Purpose

Move HNK-VERSE Web/PWA from a browser-local ZERO runtime toward an authenticated, server-authoritative remote runtime without silently promoting local state to remote authority.

## Current verified baseline

- Remote database core and direct `PostgresPersistence` proof are green.
- `apps/web` currently instantiates `BrowserLocalPersistence` directly and does not contain a Supabase Auth client dependency.
- Browser-local state remains the current Web authority.
- The Supabase project exposes an active publishable key and the remote database is healthy.
- Anonymous Auth must be proven from the actual Web client before remote Web authority can be declared.

## Target authority path

`WEB/PWA → Supabase Anonymous Auth → JWT → trusted Edge Runtime → HNK Identity → Personal Verse → World → Domain validation → PostgresPersistence → Event Ledger`

The browser MUST NOT receive database credentials, service-role credentials, or a direct privileged path to the private persistence schema.

## Authority invariants

1. **Server authority only.** A browser command becomes remotely authoritative only after authenticated server-side validation and successful persistence.
2. **No silent local promotion.** Existing `localStorage` / `BrowserLocalPersistence` history MUST NOT be uploaded or treated as canonical remote history without an explicit migration protocol approved separately.
3. **Safe transition.** `BrowserLocalPersistence` remains available as a local/fallback mode while remote authority is being proven.
4. **Identity isolation.** A JWT may operate only on the HNK Identity, Personal Verse, World and ledger scope owned by that authenticated user.
5. **Idempotent provisioning.** Repeating bootstrap for the same authenticated user produces the same logical Identity → Verse → World ownership graph and does not create duplicate roots.
6. **Domain invariants survive transport.** The remote bridge does not bypass command/domain validation merely because persistence moved server-side.
7. **Ledger remains canonical.** Remote state is reconstructible from the authoritative event ledger plus valid snapshots; snapshots are optimization, not an alternate truth source.
8. **No premature GREEN.** `REMOTE_WEB_AUTHORITY_GREEN` is declared only after the acceptance proofs below pass against the live Supabase project.

## Web client design

Introduce a small Web Auth/Remote boundary rather than placing Supabase calls throughout `main.ts`.

The Web client will:

- initialize Supabase using only public URL + publishable key configuration;
- restore an existing browser Auth session when available;
- otherwise call `signInAnonymously()`;
- require a valid authenticated user/session before enabling remote mode;
- expose remote connection/bootstrap status to the application;
- keep the current local runtime usable while remote mode is unavailable or not yet authoritative;
- never embed privileged server secrets.

The first Auth milestone proves the client can obtain a real anonymous user and JWT. It does not by itself make remote persistence authoritative.

## Trusted Edge Runtime design

A JWT-protected Supabase Edge Function becomes the browser-facing authority boundary.

For every request it must:

1. derive the authenticated Supabase user from the verified JWT;
2. resolve/provision that user's HNK Identity → Personal Verse → World scope;
3. reject attempts to address another user's scope;
4. validate the requested domain operation;
5. invoke the persistence/domain path server-side;
6. return only the minimum receipt/state/projection required by the client.

`verify_jwt` remains enabled. Browser-provided ownership identifiers are hints/addresses only; they are never trusted over the authenticated identity mapping.

## Provisioning model

Bootstrap is transactional and idempotent.

For a first authenticated user, the server ensures exactly one logical personal root graph:

`Supabase auth user → HNK Identity → Personal Verse → initial World`

Repeated bootstrap calls return the existing graph. Concurrent bootstrap calls must converge without duplicate ownership roots.

The exact database objects/functions used for this mapping must follow the existing private schema and migrations rather than inventing a parallel public authority model.

## Persistence transition

The transition occurs in gates:

### Gate A — Auth proof

The real Web client successfully performs anonymous Auth and receives a valid session/user. Auth logs show the successful request.

### Gate B — Bootstrap proof

The authenticated client calls the trusted Edge Runtime and receives its own idempotently provisioned Identity/Verse/World scope.

### Gate C — Isolation proof

Two independently authenticated anonymous users cannot read, mutate, replay or address each other's authoritative scope.

### Gate D — Remote command proof

A ZERO command travels through the Edge Runtime, domain validation and real `PostgresPersistence`, producing the expected authoritative ledger event/receipt.

### Gate E — Reload/replay proof

A fresh client/session reload reconstructs the expected ZERO state from remote authoritative history. Exact canonical fixtures/invariants remain green where applicable.

### Gate F — Controlled Web authority switch

Only after A–E pass may Web remote mode become authoritative. Local persistence remains explicitly local/fallback until a separately approved local-history migration exists.

## Failure behavior

- Missing/invalid JWT: reject; do not fall back to privileged anonymous server execution.
- Anonymous provider disabled: Web reports Auth unavailable and remains local/non-authoritative.
- Edge Runtime unavailable: do not claim remote success; preserve local mode without silently forking canonical remote history.
- Provisioning race: converge idempotently or fail atomically.
- Persistence/domain rejection: return a structured failure; no partial authoritative append.
- Network retry: command identity/idempotency rules must prevent duplicate canonical effects.

## Abuse and production controls

Before broad public production exposure, review Supabase Auth rate limits and CAPTCHA/Turnstile protections for anonymous signup abuse. These controls do not replace server-side ownership isolation or domain validation.

## Acceptance criteria

`REMOTE_WEB_AUTHORITY_GREEN` requires all of the following live proofs:

- real Web `signInAnonymously()` succeeds;
- JWT is accepted by the trusted Edge Runtime;
- Identity → Personal Verse → World provisioning is idempotent;
- concurrent provisioning does not duplicate roots;
- User A and User B are mutually isolated;
- at least one canonical ZERO command persists through the real server authority path;
- receipts/events survive reload/new connection;
- remote replay reconstructs the expected ZERO state;
- local/browser regression path remains operational during transition;
- no service-role/database credential is shipped to the browser;
- security advisors are reviewed after any DDL/RLS change;
- Issue #39 evidence records the live proof before declaring GREEN.

## Explicit non-goals for V1

- Automatic migration of historical `localStorage` sessions into remote canonical history.
- Email/social account linking for anonymous users.
- Multi-device identity recovery for anonymous-only users.
- Replacing the event ledger with snapshot authority.
- Exposing private persistence tables directly to the browser.

## Completion state

When every acceptance criterion passes, the project may declare:

`ANONYMOUS_AUTH_GREEN = true`

`REMOTE_RUNTIME_BRIDGE_GREEN = true`

`REMOTE_WEB_AUTHORITY_GREEN = true`

Until then, `REMOTE_WEB_AUTHORITY = false` remains the correct declaration.
