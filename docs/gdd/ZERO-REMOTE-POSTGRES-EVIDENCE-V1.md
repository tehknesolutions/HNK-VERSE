# HNK-VERSE — ZERO REMOTE POSTGRES EVIDENCE V1

**Status:** GREEN  
**Date:** 2026-09-23  
**Supabase project:** HNK-VERSE  
**Project ref:** `gbhfhbtbwyxjdnkvdufj`  
**Region:** `sa-east-1`  
**Postgres:** `17.6.1.166`  
**Migration:** `20260923125331_hnk_verse_private_v1`

## 1. Project boundary

A dedicated HNK-VERSE project was created in the TEHKNÉ SOLUTIONS organization.

No existing product database was reused.

To free the Free-plan active-project slot, `tehkne-storyforge` was paused before creating HNK-VERSE.

The HNK-VERSE project is:

`ACTIVE_HEALTHY`.

## 2. Migration provenance

Declarative source:

`supabase/schemas/hnk_verse_private.sql`

Tracked migration:

`supabase/migrations/20260923112302_hnk_verse_private_v1.sql`

Remote migration history records:

`20260923125331 / hnk_verse_private_v1`.

The migration was applied through the Supabase migration API, not by manual Dashboard edits.

## 3. Physical schema verification

Seven tables exist in `hnk_verse_private`:

1. `hnk_identities`
2. `personal_verses`
3. `worlds`
4. `world_streams`
5. `world_events`
6. `command_receipts`
7. `world_snapshots`

All seven report:

`RLS_ENABLED = true`.

Primary keys, foreign keys, checks and comments match the declarative contract.

## 4. Browser-role isolation

Schema privilege checks returned:

- `anon_schema_usage = false`
- `authenticated_schema_usage = false`
- `public_schema_usage = false`

No RLS policies exist on the private schema.

Direct role probes returned:

- `anon` → PostgreSQL `42501 permission denied for schema hnk_verse_private`
- `authenticated` → PostgreSQL `42501 permission denied for schema hnk_verse_private`

Therefore the authoritative persistence core is not a browser Data API surface.

## 5. Function and trigger audit

`hnk_verse_private.reject_world_event_mutation()` reports:

`security_definer = false`.

The function is therefore SECURITY INVOKER.

Committed World Events have both:

- `world_events_reject_update`
- `world_events_reject_delete`

BEFORE triggers.

## 6. Append-only proof

A committed event was targeted by UPDATE and DELETE.

Both operations failed with:

`55000 HNK_VERSE_WORLD_EVENTS_APPEND_ONLY`.

The original event remained unchanged.

## 7. Atomic append proof

Remote QA World:

`WORLD-ZERO-REMOTE-QA-001`

Initial sequence:

`0`.

One transaction executed:

```text
lock stream
→ insert event
→ advance stream
→ insert command receipt
→ commit
```

Observed state:

- `last_sequence = 1`
- event count = 1
- receipt count = 1

## 8. Idempotency persistence proof

The stored receipt was read back with:

- world;
- actor;
- idempotency key;
- request hash;
- accepted result;
- exact Event ID.

A second database write with the same:

`WORLD + ACTOR + IDEMPOTENCY KEY`

was rejected by the composite primary key with PostgreSQL `23505`.

After the rejected conflicting attempt:

- sequence remained 1;
- event count remained 1;
- receipt count remained 1;
- original request hash remained unchanged.

The TypeScript adapter's same-hash return-vs-different-hash distinction remains locally tested and is supported by this remote receipt uniqueness/readback contract.

## 9. Atomic rollback proof

A transaction deliberately executed:

```text
insert sequence-2 event
→ advance stream to 2
→ attempt duplicate receipt
→ fail with 23505
```

After rollback:

- `last_sequence = 1`
- rollback event rows = 0
- rollback receipt rows = 0

No partial mutation survived.

## 10. Optimistic concurrency proof

Two independent remote SQL requests simultaneously attempted:

`expectedSequence = 1`.

Each acquired the World stream row using `FOR UPDATE`.

Result:

- contender A → committed;
- contender B → waited, then observed `actual=2`;
- contender B → `40001 CONCURRENCY_CONFLICT expected=1 actual=2`.

Final state:

- `last_sequence = 2`
- contender event count = 1
- contender receipt count = 1

Thus:

`EXACTLY_ONE_WRITER_COMMITTED`.

## 11. Snapshot + later-event restore proof

A snapshot was stored at:

`stream_sequence_no = 2`.

Snapshot ID:

`SNAPSHOT-REMOTE-QA-SEQ2`.

A later event was committed at sequence 3.

Restore query returned:

- the sequence-2 snapshot;
- its state hash/payload;
- exactly the sequence-3 event as `events_after_snapshot`.

This proves the database-side contract required by `restoreFromSnapshot()`.

## 12. Canonical ZERO ledger round-trip

The repo's real `ZERO_FIXTURE_V1_EVENTS` was exported from the workspace.

Canonical fixture:

- 24 events;
- `EV-ZERO-001` through `EV-ZERO-024`;
- World `WORLD-ZERO-MALKUTH-001`.

The 24 canonical events were inserted into the remote Event Ledger with sequence numbers 1..24.

Remote verification returned:

- `last_sequence = 24`
- `event_count = 24`
- `min_sequence = 1`
- `max_sequence = 24`

The ledger was then read back from Postgres.

After normalizing only nullable top-level transport fields exactly as `PostgresPersistence.mapEvent()` does:

`SEMANTIC_ROUND_TRIP_EXACT = true`.

Nested semantic nulls such as:

`knowledgeRef.canonicalId = null`

were preserved.

## 13. Real reducer replay proof

The events read back from Postgres were written to a local QA file and replayed through the real repo reducer:

`replayZeroEvents()`.

Then:

`assertZeroFixtureGoldenState()`

was executed.

Result:

```text
ZERO_REMOTE_LEDGER_REPLAY_PASS
EXACT_GOLDEN=true
LAST_EVENT=EV-ZERO-024
WORLD_TIME=WORLD-DAY-001T16:00:00
```

This proves:

`REPO EVENT LEDGER → REAL POSTGRES → READBACK → REAL REDUCER → EXACT GOLDEN STATE`.

## 14. Live private-schema TypeScript types

The standard Supabase type generator returned only the `public` schema, consistent with the private schema not being exposed through the Data API.

Therefore private persistence types were generated from the live table catalog and committed as:

`packages/persistence/src/hnk-verse-private.database.types.ts`.

The file represents all seven private tables.

## 15. Security advisor

No blocking vulnerability was reported.

The security advisor returned only:

`rls_enabled_no_policy` — INFO ×7.

This is an intentional exception.

Reason:

- RLS is enabled as defense in depth;
- the schema has no browser-role USAGE grants;
- no browser policies are desired;
- direct `anon` and `authenticated` probes are denied at schema level.

Remediation reference:

https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy

## 16. Performance advisor

The advisor reported three INFO findings:

`unused_index`

for:

- `personal_verses_identity_idx`
- `worlds_verse_idx`
- `world_events_world_event_type_idx`

This is expected in a newly created low-volume test database.

The indexes are retained because they encode expected production access paths and have not had meaningful workload time.

Remediation reference:

https://supabase.com/docs/guides/database/database-linter?lint=0005_unused_index

## 17. Direct PostgresPersistence execution

The final direct-adapter proof is recorded in:

`ZERO-DIRECT-POSTGRES-PERSISTENCE-EVIDENCE-V1.md`.

The actual repository class:

`packages/persistence/src/postgres.ts → PostgresPersistence`

was executed against the dedicated remote Postgres database using:

`pg 8.16.3`.

Verified through the real class:

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

A first experimental `postgres-js.unsafe()` wrapper was rejected because independent SQL inspection showed JSON payload/state stored as JSONB strings.

The approved node-postgres execution independently verified:

`jsonb_typeof(payload) = object`

`jsonb_typeof(provenance) = object`

`jsonb_typeof(state_payload) = object`.

The temporary QA Edge Function was disabled after completion and redeployed as an inert authenticated HTTP 410 endpoint.

## 18. Classification

```text
REMOTE_DB_SCHEMA        = GREEN
REMOTE_DB_SECURITY      = GREEN
REMOTE_DB_ATOMICITY     = GREEN
REMOTE_DB_CONCURRENCY   = GREEN
REMOTE_DB_ROLLBACK      = GREEN
REMOTE_DB_IMMUTABILITY  = GREEN
REMOTE_DB_SNAPSHOT      = GREEN
REMOTE_LEDGER_ROUNDTRIP = GREEN
REMOTE_REDUCER_REPLAY   = GREEN
REMOTE_ADVISORS         = REVIEWED
DIRECT_TS_ADAPTER       = GREEN
REMOTE_DB_CORE          = GREEN
REMOTE_DB_STRICT        = GREEN
REMOTE_DB_GREEN         = GREEN
```

The remaining work is application integration, not database-correctness proof.
