# HNK-VERSE — ZERO RUNTIME VERIFICATION V1

**Status:** VERIFIED_LOCAL / GITHUB_ACTIONS_RUNNER_BLOCKED  
**Date:** 2026-09-22  
**Verified merge:** PR #21 / main merge commit `748409daf52e60f4077da82cc74907b7d0a614b3`

## 1. Scope

This report records the first executed verification of the ZERO deterministic runtime core.

Verified surfaces:

- TypeScript contracts;
- domain command decisions;
- deterministic event generation;
- reducers;
- in-memory Event/Snapshot/CommandReceipt stores;
- optimistic concurrency;
- idempotency;
- fixture/golden state;
- snapshot restore;
- full replay equivalence;
- crash-after-commit durability simulation.

## 2. Defect found during execution

Initial local runtime execution failed even though TypeScript typechecking was valid.

Cause:

Node 22 `--experimental-strip-types` does not support TypeScript parameter properties in strip-only mode.

Affected code:

- `ZeroCommandRuntime` constructor;
- `ConcurrencyConflictError`;
- `IdempotencyConflictError`.

Correction:

parameter properties were replaced with explicit class fields and constructor assignments.

This preserves behavior while allowing the ZERO check to run with Node 22 and no additional runtime transpiler.

## 3. Local verification evidence

Environment:

- Node: 22.16.0
- TypeScript: 5.8.3
- strict TypeScript workspace config
- Node native experimental type stripping

Executed:

```text
tsc -p tsconfig.json
```

Result:

```text
PASS
```

Executed:

```text
node --experimental-strip-types scripts/zero-runtime-check.ts
```

Result:

```text
ZERO_RUNTIME_CHECK_PASS
```

The native Node runner emitted only its expected experimental-feature warning.

## 4. Runtime assertions verified

The executable check covers:

1. start session;
2. observe VALI;
3. learn VALI through Metatron;
4. discover provisional practical Malkuth knowledge;
5. gather four Wood units;
6. duplicate Gather retry does not duplicate Wood;
7. depleted node rejects another Gather;
8. practice produces explicit Skill Evidence;
9. pre-manifestation gift is refused;
10. Wooden Box creation consumes exactly three Wood;
11. invalid placement rejects out-of-bounds coordinates;
12. valid placement succeeds;
13. snapshot can be saved after placement;
14. post-placement gift is accepted;
15. ownership transfer conserves Wood;
16. reflection is stored as interpretation;
17. Rest restores fixture Energy and advances World Time;
18. golden state validates;
19. snapshot + later events restore to same state;
20. full Event Ledger replay produces equivalent state;
21. same logical idempotent retry returns prior result;
22. conflicting request with same idempotency key rejects;
23. stale concurrent runtime gets `CONCURRENCY_CONFLICT`;
24. committed Box survives simulated runtime/browser loss without graceful EndSession;
25. commands attempted before knowledge gates are rejected.

## 5. GitHub Actions evidence

Workflow:

`ZERO Runtime Check`

Two GitHub-hosted attempts/runs were observed:

- run `35764985985`, including rerun attempt;
- run `35766911500` after the runtime compatibility fix.

Both were marked failure by GitHub, but the jobs never obtained a runner:

- `runner_id = 0`;
- `steps = []`;
- no Checkout step;
- no install step;
- no TypeScript step;
- no runtime-check step.

The first job log endpoint also returned a missing-blob response because no executed job log existed.

Therefore these runs do **not** constitute evidence of code/test failure.

Classification:

`CI_INFRASTRUCTURE_BLOCKED_BEFORE_EXECUTION`

The workflow remains useful once GitHub-hosted runners become available.

## 6. Verification conclusion

The deterministic ZERO runtime core is:

`LOCAL_RUNTIME_GREEN`

It is not yet:

`GITHUB_ACTIONS_GREEN`

The distinction is intentional.

No CI-green claim should be made until a hosted/self-hosted runner actually executes the workflow.

## 7. Next gate

Next production gate:

**ZERO Production Persistence Adapter V1**

The in-memory adapter has proven the contract semantics.

The next adapter must reproduce the same:

- event sequencing;
- idempotency;
- atomicity;
- snapshot restore;
- ownership conservation;
- authorization boundaries;

using durable PostgreSQL-class persistence without changing domain behavior.
