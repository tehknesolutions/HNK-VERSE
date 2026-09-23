# HNK-VERSE — ZERO PRODUCTION PERSISTENCE IMPLEMENTATION V1

**Status:** REMOTE_DB_CORE_GREEN / DIRECT_ADAPTER_CONNECTION_PENDING  
**Date:** 2026-09-22  
**Parent:** ZERO Production Persistence Adapter V1 LOCK  
**Target:** PostgreSQL / Supabase-compatible durable adapter

## 1. What is implemented

### Declarative database schema

File:

`supabase/schemas/hnk_verse_private.sql`

The schema defines the durable ZERO core in a private PostgreSQL schema:

- HNK Identity metadata;
- Personal Verse metadata;
- World metadata;
- World stream sequence;
- append-only World Event Ledger;
- command receipts;
- World snapshots.

Security posture:

- schema is `hnk_verse_private`, not a browser-facing public schema;
- privileges are revoked from `PUBLIC`;
- privileges are explicitly revoked from Supabase `anon` and `authenticated` roles when those roles exist;
- RLS is enabled as defense in depth;
- no browser role policy is created;
- committed World events reject UPDATE and DELETE through SECURITY INVOKER triggers;
- no `SECURITY DEFINER` function is introduced.

### PostgreSQL persistence adapter

File:

`packages/persistence/src/postgres.ts`

The adapter implements the existing vendor-neutral ports:

- `EventStore`;
- `SnapshotStore`;
- `CommandReceiptStore`.

The adapter receives a driver-neutral `PostgresExecutor`.

No domain package depends on Supabase or a PostgreSQL client library.

### Atomic append algorithm

Within one database transaction:

1. lock the World stream row;
2. read the existing idempotency receipt;
3. same key + different request hash → `IDEMPOTENCY_CONFLICT`;
4. same key + same hash → return prior result;
5. compare expected stream sequence;
6. stale sequence → `CONCURRENCY_CONFLICT`;
7. insert ordered events;
8. advance `last_sequence`;
9. insert command receipt;
10. commit.

This mirrors the already locally verified in-memory semantics.

### Persistence error contracts

Shared errors now live in:

`packages/persistence/src/errors.ts`

- `ConcurrencyConflictError`;
- `IdempotencyConflictError`;
- `MissingWorldStreamError`.

The in-memory adapter and Postgres adapter share the same conflict types.

### Static schema security gate

File:

`scripts/zero-persistence-schema-check.mjs`

The check rejects a schema that loses core safety properties.

It verifies:

- private HNK-VERSE schema exists;
- Event Ledger/receipts/snapshots exist;
- World sequence and idempotency primary keys exist;
- RLS remains enabled;
- append-only triggers remain present;
- `SECURITY DEFINER` is absent;
- grants to `anon` or `authenticated` are absent.

Root test now includes:

`pnpm test:zero && pnpm test:persistence-schema`.

## 2. Current Supabase compatibility decisions

The implementation follows the current Supabase security model:

- browser roles must not receive service/secret credentials;
- exposed tables require grants plus RLS;
- `TO authenticated` is not enough for row authorization;
- views require explicit security treatment;
- `SECURITY DEFINER` is not used as an authorization shortcut.

HNK-VERSE goes further for the authoritative persistence core by keeping it in a non-browser-facing schema.

## 3. Why no public append RPC is implemented

The locked HNK-VERSE rule is:

CLIENT / AI OUTPUT ≠ AUTHORIZED WORLD MUTATION

A browser-callable RPC accepting arbitrary event batches would create a second path around the TypeScript command validators.

Therefore V1 does not publish:

`append_world_command_v1`

to browser roles.

The production request path remains:

WEB/PWA  
→ trusted application/domain boundary  
→ validated command  
→ PostgresPersistence  
→ private durable tables.

If a Supabase Edge Function or server API becomes the trusted boundary, it must preserve this same command contract.

## 4. Strip-types compatibility

The Postgres adapter deliberately avoids TypeScript parameter properties.

This preserves compatibility with the Node 22 native strip-types runner after the earlier runtime defect discovered in PR #21.

## 5. What is not yet verified

No dedicated HNK-VERSE Supabase project currently exists in the connected account.

Therefore the following are still pending:

- applying the schema to real Postgres;
- generating a real migration from the declarative schema;
- database integration test against Postgres;
- real transaction rollback proof;
- real concurrent writer proof;
- Auth/RLS isolation with two test identities;
- advisor scan after DDL;
- database-generated TypeScript types;
- production connection/driver selection;
- crash/restart proof against remote durable storage.

No existing `codex-hnk-app` or `tehkne-storyforge` project was reused.

That boundary is intentional.

## 6. Remote acceptance gate

When a dedicated HNK-VERSE Supabase project/dev branch is available:

1. verify current Supabase CLI/docs/changelog;
2. initialize/link the repo through supported tooling;
3. generate migration from the declarative schema rather than inventing a timestamp;
4. apply to dev/staging;
5. seed two test Auth identities and isolated Verses;
6. execute the full ZERO golden command path through the Postgres adapter;
7. verify normalized final state hash against the in-memory implementation;
8. verify idempotent retry;
9. verify conflicting idempotency hash;
10. verify optimistic concurrency;
11. verify event-batch atomic rollback;
12. verify cross-user World isolation;
13. verify committed event UPDATE/DELETE denial for runtime roles;
14. verify snapshot + later-event restore;
15. run security advisors;
16. run performance advisors;
17. resolve all relevant findings or record explicit exceptions;
18. only then classify the adapter `REMOTE_DB_GREEN`.

## 7. Verification classification

Current:

- deterministic domain runtime: `LOCAL_RUNTIME_GREEN`;
- production schema: `STATIC_IMPLEMENTED`;
- Postgres port adapter: `STATIC_IMPLEMENTED`;
- schema security contract: `IMPLEMENTED, execution pending hosted/local runner`;
- dedicated remote database: `NOT_PROVISIONED`;
- real Postgres integration: `REMOTE_DB_PENDING`.

Therefore:

`STATIC_IMPLEMENTED != REMOTE_DB_GREEN`

and:

`LOCAL_RUNTIME_GREEN != GITHUB_ACTIONS_GREEN`.

## 8. Next gate

After this implementation is merged, there are two parallel tracks:

### Infrastructure track
Provision/choose a dedicated HNK-VERSE Supabase development project and execute the remote DB acceptance gate.

### Product track
Continue ZERO toward the first Web/PWA projection:

- renderer contract;
- Home/Land isometric projection;
- contextual interactions;
- domain-command adapter;
- visual state derived from authoritative runtime.

The product track does not need to wait for final production database hosting to begin.


## 9. Remote execution update

The project is now provisioned and the remote persistence core has been exercised.

Evidence:

`ZERO-REMOTE-POSTGRES-EVIDENCE-V1.md`.

The remaining gap is intentionally narrow: direct execution of the actual `PostgresPersistence` class over an approved direct Postgres driver connection.
