# HNK-VERSE — ZERO REMOTE POSTGRES ACCEPTANCE V1

**Status:** GREEN  
**Date:** 2026-09-22  
**Parent:** ZERO Production Persistence Adapter V1 + FIRST DEPLOY/BROWSER QA V1  
**Target:** dedicated HNK-VERSE PostgreSQL/Supabase project

## 1. Purpose

Move the already implemented persistence contract from:

`STATIC_IMPLEMENTED / REMOTE_DB_PENDING`

to:

`REMOTE_DB_GREEN`

without changing domain authority or reusing another product database.

## 2. Non-negotiable project boundary

A dedicated HNK-VERSE Supabase project is required.

Do not reuse:

- `codex-hnk-app`;
- `tehkne-storyforge`;
- `HNK FOOD STACK APP`;
- `lexia-game`;
- any future database whose primary ownership belongs to another product.

Connected organization discovered during gate opening:

`TEHKNÉ SOLUTIONS`

Project creation remains blocked until explicit organization + cost confirmation is completed through Supabase.

## 3. Source of truth

Declarative schema:

`supabase/schemas/hnk_verse_private.sql`

Adapter:

`packages/persistence/src/postgres.ts`

The remote migration must be derived from the declarative schema and applied through supported Supabase migration tooling.

Do not silently rewrite the schema in the Dashboard.

## 4. Security boundary

The authoritative persistence surface stays private:

`hnk_verse_private`

Required properties:

- no browser-facing direct Event Ledger mutation;
- no grants to `anon` or `authenticated`;
- RLS enabled as defense in depth;
- no browser policies granting private-core access;
- no `SECURITY DEFINER` authorization shortcut;
- World Events immutable through normal UPDATE/DELETE;
- service/secret credentials never enter the Web/PWA.

Invariant:

`CLIENT / AI OUTPUT != AUTHORIZED WORLD MUTATION`.

## 5. Remote acceptance sequence

Execute in this order:

1. create dedicated project;
2. wait until project is healthy;
3. inspect Postgres/Supabase version;
4. materialize the declarative schema as a tracked migration;
5. apply migration;
6. list resulting private tables;
7. verify constraints/indexes/triggers/RLS;
8. seed ZERO identity/Verse/World/stream test fixture;
9. execute valid atomic append;
10. verify sequence advance;
11. retry same idempotency key + same hash;
12. verify no duplicate events;
13. retry same key + different hash;
14. verify idempotency conflict;
15. execute two writers at the same expected sequence;
16. verify exactly one writer commits;
17. force an event-batch failure;
18. verify transaction rollback leaves no partial event/receipt/sequence advance;
19. save and load snapshot;
20. verify snapshot + later events equals full replay;
21. verify committed Event UPDATE rejection;
22. verify committed Event DELETE rejection;
23. verify `anon` cannot access private schema;
24. verify `authenticated` cannot access private schema;
25. execute full ZERO golden command path using `PostgresPersistence`;
26. compare final normalized state hash with in-memory runtime;
27. recreate runtime/process;
28. prove committed World state survives;
29. generate TypeScript DB types;
30. run security advisors;
31. run performance advisors;
32. resolve relevant findings or record explicit exceptions;
33. record project/version/migration/test evidence;
34. only then set `REMOTE_DB_GREEN`.

## 6. Atomic append proofs

### Success

`EXPECTED SEQUENCE → FOR UPDATE → EVENT BATCH → STREAM ADVANCE → RECEIPT → COMMIT`

All accepted events and the receipt must appear together.

### Idempotent retry

Same:

`WORLD + ACTOR + IDEMPOTENCY KEY + REQUEST HASH`

must return the prior receipt without appending.

### Conflict

Same idempotency key with a different request hash must reject.

### Concurrency

Two writers using the same expected sequence:

`EXACTLY ONE COMMITS`.

The loser must observe the newer sequence and return a concurrency conflict.

### Atomic rollback

A deliberately invalid second event in a batch must roll back:

- first event;
- stream advance;
- receipt.

## 7. Ownership/isolation interpretation for V1

The private core is intentionally not a browser Data API surface.

Therefore V1 proves browser-role isolation by demonstrating that both:

- `anon`;
- `authenticated`;

cannot access `hnk_verse_private` at all.

Future shared/user-facing read models require a separate explicit ownership-chain/RLS gate.

Do not weaken the private core merely to make user-isolation tests easier.

## 8. Test-data reset rule

Remote destructive integration tests are allowed only on the dedicated HNK-VERSE development/test database.

They must never run against another product database.

If reset/truncate is needed for repeatability, it must be:

- explicit;
- test-environment-only;
- privileged;
- documented;
- impossible to trigger from browser code.

Event immutability remains the runtime rule; privileged test reset is operational test infrastructure.

## 9. Advisor gate

After DDL:

- security advisors: mandatory;
- performance advisors: mandatory.

Security findings that affect private-schema exposure, RLS, grants, mutable ledger behavior or unsafe functions are release-blocking.

Performance findings may be fixed or explicitly deferred with rationale if they do not threaten correctness.

## 10. Definition of GREEN

`REMOTE_DB_GREEN` requires all of:

- dedicated HNK-VERSE project healthy;
- tracked migration applied;
- schema contract verified in real Postgres;
- atomic append proven;
- idempotency proven;
- optimistic concurrency proven;
- rollback proven;
- event immutability proven;
- private-role isolation proven;
- snapshot restore proven;
- full ZERO runtime proven against Postgres;
- crash/restart durability proven;
- advisors reviewed;
- evidence committed to repo.

Until then:

`STATIC_IMPLEMENTED != REMOTE_DB_GREEN`.


## 11. Final execution evidence

See:

- `ZERO-REMOTE-POSTGRES-EVIDENCE-V1.md`;
- `ZERO-DIRECT-POSTGRES-PERSISTENCE-EVIDENCE-V1.md`.

The dedicated HNK-VERSE Supabase project has passed the full remote acceptance gate.

In addition to schema/security/atomicity/rollback/concurrency/ledger/snapshot/replay proofs, the actual repository class:

`PostgresPersistence`

was executed against the real remote PostgreSQL database using `pg 8.16.3`.

The direct adapter proof covered:

- `latestSequence()`;
- `append()`;
- same-hash idempotent retry;
- different-hash `IdempotencyConflictError`;
- concurrent writers with exactly one `ConcurrencyConflictError`;
- `readAfter()`;
- `find()`;
- `save()`;
- `loadLatest()`;
- new connection / new adapter instance durability.

Independent SQL inspection verified:

`jsonb_typeof(payload) = object`

and:

`jsonb_typeof(state_payload) = object`.

The temporary QA execution route was disabled after the proof.

Therefore:

`REMOTE_DB_GREEN = GREEN`.
