# HNK-VERSE — ZERO DIRECT POSTGRES PERSISTENCE EVIDENCE V1

**Status:** GREEN  
**Date:** 2026-09-23  
**Issue:** #37 — ZERO — Direct PostgresPersistence Driver Proof  
**Supabase project:** `HNK-VERSE`  
**Project ref:** `gbhfhbtbwyxjdnkvdufj`  
**Region:** `sa-east-1`

## 1. Goal

Close the final gap between:

`REMOTE_DB_CORE_GREEN`

and:

`REMOTE_DB_GREEN`.

The acceptance requirement was explicit execution of the actual repository class:

`packages/persistence/src/postgres.ts → PostgresPersistence`

against the dedicated remote PostgreSQL database over an approved direct Postgres driver connection.

## 2. Server-side execution path

A temporary Supabase Edge Function was used because hosted Edge Functions receive:

`SUPABASE_DB_URL`

as a managed server-side environment variable.

No database password was:

- requested from the user;
- extracted;
- reset;
- printed;
- committed;
- placed in browser code.

The Edge Function only targeted isolated HNK-VERSE QA Worlds.

After completion, the QA function was replaced by an inert authenticated version returning HTTP 410.

Final deployed QA function state:

- slug: `zero-persistence-qa`;
- version: `7`;
- `verify_jwt = true`;
- no mutable QA route remains.

## 3. First driver attempt — rejected

The first direct execution used:

`postgres-js 3.4.7`

through a wrapper around `unsafe(text, params)`.

The actual `PostgresPersistence` class executed successfully at the control-flow level:

- `latestSequence()`;
- `find()`;
- `append()`;
- idempotent retry;
- idempotency conflict;
- concurrent append;
- `readAfter()`;
- `save()`;
- `loadLatest()`;
- reconnection/readback.

However, independent PostgreSQL inspection found:

`jsonb_typeof(world_events.payload) = string`

for the QA events.

The snapshot state also returned as a serialized JSON string.

Therefore:

`POSTGRES_JS_UNSAFE_WRAPPER = REJECTED`.

The failed QA World was retained as evidence and marked:

`QA_REJECTED_POSTGRESJS_WRAPPER`.

This result is not counted as GREEN.

## 4. Approved driver proof — node-postgres

A fresh isolated World was created:

`WORLD-ZERO-ADAPTER-PG-QA-001`

with initial stream sequence:

`0`.

The actual repo class was then executed using:

`pg 8.16.3`

with its native PostgreSQL parameter contract:

```text
query(sql, params)
BEGIN
→ tx.query(sql, params)
→ COMMIT / ROLLBACK
```

This matches the `$1..$N` SQL contract already used by `PostgresPersistence`.

## 5. Methods proven through the real class

The Edge Function imported the actual source of:

`packages/persistence/src/postgres.ts`

and executed:

1. `latestSequence()`;
2. `find()`;
3. `append()`;
4. same-hash idempotent retry;
5. different-hash `IdempotencyConflictError`;
6. two concurrent `append()` calls;
7. `readAfter()`;
8. `save()`;
9. `loadLatest()`;
10. a fresh driver/pool and new `PostgresPersistence` instance.

## 6. Initial state proof

Before mutation:

```text
WORLD = WORLD-ZERO-ADAPTER-PG-QA-001
latestSequence = 0
receipt = null
```

This was returned by the actual class over the remote database.

## 7. Atomic append proof through PostgresPersistence

First append:

- event: `EV-ADAPTER-PG-QA-001`;
- command: `CMD-ADAPTER-PG-QA-001`;
- expected sequence: `0`.

Result:

```text
acceptedSequenceNo = 1
eventIds = [EV-ADAPTER-PG-QA-001]
```

The receipt returned by `find()` matched the original:

`requestHash = hash:adapter-pg:001`.

## 8. Idempotency proof through PostgresPersistence

The same command was submitted again using:

- same World;
- same actor;
- same idempotency key;
- same request hash;
- original expected sequence `0`.

Result:

- no duplicate event;
- original Event ID returned;
- accepted sequence remained consistent with the persisted stream.

A second attempt using the same idempotency key but:

`requestHash = hash:adapter-pg:DIFFERENT`

raised:

`IdempotencyConflictError`.

Observed marker:

`idempotencyConflict = true`.

## 9. Concurrency proof through PostgresPersistence

Two independent `append()` calls were started concurrently against:

`expectedSequenceNo = 1`.

Result:

Contender A:

```text
status = fulfilled
acceptedSequenceNo = 2
eventIds = [EV-ADAPTER-PG-QA-CONC-A]
```

Contender B:

```text
status = rejected
code = CONCURRENCY_CONFLICT
message = World WORLD-ZERO-ADAPTER-PG-QA-001 sequence conflict: expected 1, actual 2
```

Therefore:

`EXACTLY_ONE_WRITER_COMMITTED`.

## 10. Readback proof

After the concurrent append:

`latestSequence() = 2`.

`readAfter(WORLD, 0)` returned exactly:

1. `EV-ADAPTER-PG-QA-001`;
2. `EV-ADAPTER-PG-QA-CONC-A`.

The payloads returned by the actual adapter were typed objects:

```json
{"phase":1}
{"contender":"A"}
```

## 11. JSONB correctness proof

Independent SQL inspection of the same rows returned:

```text
jsonb_typeof(payload)    = object
jsonb_typeof(provenance) = object
```

for both committed events.

Snapshot:

`SNAPSHOT-ADAPTER-PG-QA-001`

returned:

`jsonb_typeof(state_payload) = object`.

Stored state:

```json
{
  "eventIds": [
    "EV-ADAPTER-PG-QA-001",
    "EV-ADAPTER-PG-QA-CONC-A"
  ],
  "finalSequence": 2
}
```

Therefore the node-postgres execution preserves the intended JSONB semantics.

## 12. Snapshot proof through the real class

The actual class executed:

`save(snapshot)`

followed by:

`loadLatest(worldId)`.

Result:

- snapshot ID: `SNAPSHOT-ADAPTER-PG-QA-001`;
- stream sequence: `2`;
- state hash: `adapter-pg-qa-state-hash`;
- state returned as an object.

## 13. Restart / new connection proof

The first database pool was closed.

A new `pg` Pool was created.

A new `PostgresPersistence` instance was constructed.

The new instance returned:

```text
latestSequence = 2
events = [
  EV-ADAPTER-PG-QA-001,
  EV-ADAPTER-PG-QA-CONC-A
]
snapshot.stateHash = adapter-pg-qa-state-hash
snapshot.state = object
```

This proves process/connection recreation does not lose authoritative persisted state.

## 14. Final direct-adapter result

The Edge Function returned:

`ok = true`.

Full proof summary:

```text
ACTUAL PostgresPersistence SOURCE = EXECUTED
DIRECT REMOTE POSTGRES DRIVER     = pg 8.16.3
LATEST SEQUENCE                  = PASS
APPEND                           = PASS
FIND RECEIPT                     = PASS
SAME-HASH RETRY                  = PASS
DIFFERENT-HASH CONFLICT          = PASS
OPTIMISTIC CONCURRENCY           = PASS
READ AFTER                       = PASS
SNAPSHOT SAVE                    = PASS
SNAPSHOT LOAD                    = PASS
NEW CONNECTION / RESTART         = PASS
JSONB PAYLOAD TYPE               = object
JSONB SNAPSHOT TYPE              = object
```

## 15. Driver compatibility lock

For ZERO V1:

`PostgresPersistence + node-postgres (pg) = APPROVED`.

The tested `postgres-js.unsafe()` wrapper is not approved without an explicit parameter-encoding adapter because it serialized JSON payload/state as JSONB strings.

Do not infer that postgres-js itself is universally incompatible; the rejected item is the specific wrapper shape tested here.

## 16. Security cleanup

After the proof:

- the temporary custom-auth QA execution route was removed;
- the function was redeployed as version 7;
- `verify_jwt = true`;
- it exposes no database action;
- it returns HTTP 410 with QA-complete status.

No privileged database secret was exposed.

## 17. Acceptance closure

Issue #37 acceptance items are now satisfied:

- actual class;
- direct remote driver;
- append;
- retry;
- conflict;
- concurrency;
- read;
- receipt lookup;
- snapshot save/load;
- reconnection durability.

Therefore:

```text
DIRECT_TS_ADAPTER = GREEN
REMOTE_DB_CORE    = GREEN
REMOTE_DB_STRICT  = GREEN
REMOTE_DB_GREEN   = GREEN
```

The next infrastructure/product gate is no longer database correctness. It is integrating the approved server-side persistence path into the production application architecture while preserving the existing client/server authority boundary.
