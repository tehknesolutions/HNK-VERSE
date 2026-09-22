# HNK-VERSE — ZERO PRODUCTION PERSISTENCE ADAPTER V1

**Status:** PROPOSAL — awaiting Creator lock  
**Date:** 2026-09-22  
**Parent:** ZERO Runtime Verification V1 + locked Persistence Schema/Fixture V1  
**Recommended candidate:** PostgreSQL / Supabase

## 1. Goal

Replace the in-memory persistence adapter with a durable production adapter while preserving the already-verified domain contracts.

The database must not become a second gameplay engine.

Domain truth remains:

COMMAND VALIDATION  
→ AUTHORIZED EVENTS  
→ DURABLE APPEND  
→ REDUCER STATE

Database responsibilities:

- durable event ordering;
- atomic append;
- idempotency receipts;
- optimistic concurrency;
- snapshot storage;
- identity/world ownership authorization;
- recovery;
- auditability.

## 2. Vendor decision

The persistence ports remain vendor-neutral.

For the first production adapter, PostgreSQL/Supabase is the recommended candidate because it provides:

- transactional PostgreSQL;
- constraints and unique indexes;
- JSONB event payloads;
- Row Level Security;
- Auth integration;
- migration tooling;
- existing Tehkné operational familiarity.

This proposal does not make Supabase part of HNK canon or domain semantics.

A future adapter may implement the same ports against another durable store.

## 3. Current Supabase security constraints

If Supabase is selected:

- RLS must be enabled on every table exposed through the Data API;
- `TO authenticated` alone is authentication, not per-user authorization;
- policies need an ownership predicate such as `auth.uid()`;
- UPDATE policies need both `USING` and `WITH CHECK` where update is allowed;
- client code must never receive a service-role/secret key;
- views exposed to users require RLS-compatible/security-invoker treatment;
- `SECURITY DEFINER` is not a shortcut for authorization.

ZERO should prefer server/domain-authorized mutations plus database defense in depth.

## 4. Minimal production schema

Do not materialize all future logical aggregates as tables on Day 1.

Recommended minimum durable core:

### hnk_identities
Maps authenticated account to HNK Identity.

Fields:

- `identity_id text primary key`
- `user_id uuid unique not null`
- `primary_verse_id text`
- `created_at timestamptz`
- `schema_version integer`

### personal_verses

- `verse_id text primary key`
- `identity_id text not null`
- `primary_world_id text`
- `created_at timestamptz`
- `provenance jsonb`

### worlds

- `world_id text primary key`
- `verse_id text not null`
- `world_ruleset_version text`
- `state_version bigint`
- `created_at timestamptz`
- `provenance jsonb`

### world_streams

One row per World stream.

- `world_id text primary key`
- `last_sequence bigint not null default 0`
- `updated_at timestamptz`

Used for optimistic sequence locking.

### world_events

Append-only domain history.

- `world_id text not null`
- `sequence_no bigint not null`
- `event_id text not null`
- `event_type text not null`
- `schema_version integer not null`
- `verse_id text not null`
- `actor_id text`
- `target_id text`
- `session_id text`
- `real_timestamp timestamptz not null`
- `world_timestamp text not null`
- `correlation_id text not null`
- `causation_id text`
- `payload jsonb not null`
- `provenance jsonb`
- `created_at timestamptz not null default now()`

Constraints:

- primary/unique `(world_id, sequence_no)`;
- unique `event_id`.

### command_receipts

- `world_id text not null`
- `actor_id text not null`
- `idempotency_key text not null`
- `command_id text not null`
- `command_type text not null`
- `request_hash text not null`
- `result_status text not null`
- `result_event_ids text[] not null`
- `rejection_code text`
- `created_at timestamptz not null`

Unique:

`(world_id, actor_id, idempotency_key)`

### world_snapshots

- `snapshot_id text primary key`
- `world_id text not null`
- `stream_sequence_no bigint not null`
- `schema_version integer not null`
- `state_hash text not null`
- `state_payload jsonb not null`
- `created_at timestamptz not null`

Index:

`(world_id, stream_sequence_no desc)`

## 5. Why event-first before normalized gameplay tables

ZERO already proved deterministic reconstruction from events.

Therefore the first production adapter does not need separate mutable tables for every entity, memory, relationship and inventory immediately.

Start with:

metadata  
+ Event Ledger  
+ snapshots  
+ derived read models.

Normalize hot read paths only when real profiling/use requires it.

This avoids duplicated sources of truth.

## 6. Transactional append boundary

One accepted command must persist as one atomic transaction.

Conceptual API:

`append_world_command_v1(...)`

Inputs:

- World ID;
- Actor ID;
- expected stream sequence;
- idempotency key;
- request hash;
- command receipt;
- ordered event batch.

Transaction behavior:

1. authenticate/authorize caller;
2. find existing idempotency receipt;
3. if same key + same hash → return previous result;
4. if same key + different hash → reject `IDEMPOTENCY_CONFLICT`;
5. lock/check `world_streams`;
6. compare expected sequence;
7. stale sequence → reject `CONCURRENCY_CONFLICT`;
8. insert ordered events;
9. advance stream sequence;
10. insert receipt;
11. commit;
12. return committed event IDs and final sequence.

No event in the batch may become visible without the others.

## 7. Security model

Recommended request path:

WEB/PWA  
→ authenticated server/domain boundary  
→ TypeScript command validation  
→ transactional database append.

Preferred runtime authorization:

- retain the user's authenticated identity/JWT where practical;
- enforce World/Verse ownership in server/domain code;
- enforce ownership again with RLS/SQL checks.

Avoid:

browser  
→ direct INSERT into `world_events`.

The client should not possess permission to author arbitrary domain events.

## 8. Schema exposure

Recommended separation:

### Exposed/readable surface
Only data/read models genuinely needed by the Web/PWA Data API.

### Private persistence surface
Event internals, receipts and sensitive snapshots should prefer a non-exposed schema or tightly controlled access path.

If a table is placed in an exposed schema, RLS is mandatory.

## 9. RLS ownership chain

Authorization should derive from authenticated user ownership:

`auth.uid()`
→ `hnk_identities.user_id`
→ `personal_verses.identity_id`
→ `worlds.verse_id`.

A user may read only Worlds/streams/snapshots they are authorized to access.

Future shared Worlds extend this with explicit membership/role records rather than weakening the ownership predicate.

## 10. Service-role boundary

The Web/PWA browser must never receive a service-role/secret key.

If a privileged server process uses service credentials for migrations, maintenance or trusted internal tasks:

- credentials remain server-only;
- domain authorization cannot be skipped merely because the DB role can bypass RLS;
- user-facing mutation paths should continue checking actor/world authority.

## 11. Append function security

Do not add `SECURITY DEFINER` merely to make permission problems disappear.

Preferred design:

- security-invoker semantics where feasible;
- caller identity preserved;
- explicit grants;
- RLS/ownership checks;
- function in an intentionally exposed API schema only if it must be invoked through Data API.

If a privileged function becomes necessary later, it requires separate security review, a non-exposed placement where possible, explicit `auth.uid()` checks, restricted EXECUTE grants and advisor review.

## 12. Snapshot policy

Snapshots are performance artifacts.

Recommended ZERO policy:

- initial snapshot optional;
- create snapshot after a configurable event count and/or key milestones;
- always include exact stream sequence and state hash;
- restore snapshot + later events;
- test full replay regularly.

A corrupted/incompatible snapshot must be discardable and rebuildable from the ledger.

## 13. Append-only enforcement

Application roles should not UPDATE or DELETE committed World events.

Corrections use compensating events.

Operational/admin retention is a separate governance concern and must not masquerade as normal gameplay mutation.

## 14. Read model strategy

Initial read model may be generated server-side from restored snapshot/event state.

Potential later materialized projections:

- current inventory;
- current spatial entities;
- current Agent summary;
- current relationship summary;
- Chronicle index.

Every projection remains rebuildable.

## 15. Migration strategy

Once Supabase is actually connected:

1. verify current Supabase changelog/docs;
2. inspect project/CLI version;
3. create migration using supported migration tooling;
4. apply/iterate in non-production environment;
5. run deterministic DB integration tests;
6. run database advisors;
7. inspect security/performance findings;
8. commit migration;
9. verify fresh reset/migration path.

Do not invent migration timestamps/names by hand when the CLI is available.

## 16. Database integration tests

Required before adapter lock:

### Append success
Valid event batch commits and advances sequence.

### Atomicity
Forced failure in event batch leaves no partial events or receipt.

### Idempotent retry
Same key/hash returns original receipt and does not append.

### Idempotency conflict
Same key/different hash rejects.

### Optimistic concurrency
Two writers at same expected sequence: exactly one wins.

### Ownership isolation
User A cannot access or mutate User B World.

### Snapshot restore
Snapshot + later events equals full replay.

### Crash durability
Committed placement survives new process/session.

### Event immutability
Normal runtime role cannot update/delete committed event rows.

### RLS
Browser-facing/authenticated role sees only authorized rows.

## 17. Adapter interface

Production adapter must implement existing ports without changing domain code:

- `EventStore`;
- `SnapshotStore`;
- `CommandReceiptStore`.

A PostgreSQL/Supabase adapter may add implementation-specific helpers, but domain/simulation packages must depend only on ports.

## 18. Proposed package

Candidate:

`packages/persistence-supabase`

or, if only one durable adapter is expected initially:

`packages/persistence/src/supabase`.

Recommendation:

keep vendor adapter separated enough that `@hnk-verse/persistence` remains vendor-neutral.

## 19. ZERO acceptance criteria

Production persistence is green when:

1. the existing ZERO command runtime can swap in the production adapter;
2. no domain-handler code changes are required for the swap;
3. the same golden path passes;
4. the same final normalized state hash passes;
5. idempotency/concurrency tests pass against real Postgres;
6. RLS isolation passes with at least two test identities;
7. crash/restart persistence passes;
8. advisors show no unreviewed security regressions.

## 20. Candidate lock decisions

1. PostgreSQL/Supabase is the preferred first production adapter, while persistence ports remain vendor-neutral.
2. Event Ledger + command receipts + snapshots are the minimal durable core.
3. Do not create dozens of normalized gameplay tables before read/load requirements justify them.
4. Domain command validation remains in the trusted application/domain layer; database persists authorized events atomically.
5. Clients cannot directly insert arbitrary World events.
6. Event batch + stream sequence + command receipt commit atomically.
7. `world_streams.last_sequence` provides optimistic concurrency control.
8. `command_receipts` unique World/Actor/Idempotency keys enforce retry safety.
9. Committed events are append-only for normal runtime roles.
10. Snapshot state is disposable/rebuildable acceleration, not historical authority.
11. If Supabase is selected, RLS is mandatory on exposed tables and must enforce real per-user World ownership.
12. Browser clients never receive service-role/secret credentials.
13. `SECURITY DEFINER` is not an authorization shortcut.
14. Production adapter implements the existing persistence ports without altering domain semantics.
15. Real Postgres integration tests must replay the same ZERO golden path and conservation invariants before the adapter is locked.
