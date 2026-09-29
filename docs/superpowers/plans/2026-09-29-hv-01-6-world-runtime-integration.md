# HV-01.6 World Runtime Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Carry an MHCM Path proposal through explicit World authority into deterministic WorldGraph mutation, an authoritative HnkEvent, and Chronicle projection, while proving rejection cannot mutate history.

**Architecture:** Keep `evaluateMhcmWorldOperation()` proposal-only. Add one focused World runtime boundary that validates proposal + Presence authority, materializes accepted Path IR as a World OBJECT, and emits one deterministic `MhcmProposalApplied` event. Chronicle consumes only that event; it never consumes proposal data directly.

**Tech Stack:** TypeScript, Node test runner, pnpm workspace, existing `@hnk-verse/mhcm`, `@hnk-verse/contracts`, WorldGraph and ZERO Chronicle.

**Spec:** `docs/superpowers/specs/2026-09-29-hv-01-6-world-runtime-integration-design.md`

## Global Constraints

- MHCM remains `PROPOSAL_ONLY`; it must never mutate World state directly.
- Authority must match proposal `identityId`, `sessionId`, and `presenceId`.
- Presence must be active and address the target Verse.
- Accepted runtime IDs/timestamps are caller-supplied; no nondeterministic generation in the integration function.
- Rejection returns the original graph object and no mutation event.
- Chronicle history is derived only from an authoritative World event.
- No persistence, renderer, UI, general command bus, or ZERO authority replacement in HV-01.6.

## Review Focus

- Authority identity/session/presence mismatch must reject without graph mutation.
- Inactive Presence must reject without graph mutation.
- Presence target Verse mismatch must reject without graph mutation.
- Non-Path/malformed proposal IR must reject without graph mutation.
- Accepted event provenance must retain MHCM source provenance and approving authority identifiers.

---

### Task 1: Define the authoritative runtime result and event contract

**Files:**
- Modify: `packages/contracts/src/index.ts`
- Create: `packages/world/src/mhcm-world-runtime.ts`
- Create: `packages/world/src/mhcm-world-runtime.test.ts`

**Interfaces:**
- Consumes: `MhcmWorldProposal`, `WorldGraph`, `PlatformPresence`, `HnkEvent`.
- Produces: `MhcmWorldRuntimeRequest`, `MhcmWorldRuntimeResult`, `applyMhcmWorldProposal(request)` and `MhcmProposalAppliedPayload`.

- [ ] **Step 1: Write failing contract tests**

Add tests asserting that an accepted request returns `status === 'APPLIED'`, contains an event with `eventType === 'MhcmProposalApplied'`, and materializes the supplied entity ID. Add rejection assertions for authority mismatch, inactive Presence, Verse mismatch, and non-Path IR; every rejection must satisfy `result.graph === inputGraph` and `result.event === undefined`.

- [ ] **Step 2: Run the focused test and verify RED**

Run: `pnpm exec tsx --test packages/world/src/mhcm-world-runtime.test.ts`
Expected: FAIL because the runtime boundary/contract does not exist.

- [ ] **Step 3: Add the event payload contract**

In `packages/contracts/src/index.ts`, add `MhcmProposalApplied` to `ZERO_EVENT_TYPES` and define:

`MhcmProposalAppliedPayload = { entityInstanceId: string; proposalIrId: string; operator: string; authority: { identityId: string; sessionId: string; presenceId: string } }`.

- [ ] **Step 4: Implement the minimal runtime boundary**

In `packages/world/src/mhcm-world-runtime.ts`, define `applyMhcmWorldProposal(request: MhcmWorldRuntimeRequest): MhcmWorldRuntimeResult` as a pure function. Validate authority and Path shape before calling `upsertWorldEntity`. For APPLIED, store the accepted IR and its metadata/provenance in the OBJECT entity data and construct the caller-identified/timestamped `HnkEvent<MhcmProposalAppliedPayload>`.

- [ ] **Step 5: Run the focused test and verify GREEN**

Run: `pnpm exec tsx --test packages/world/src/mhcm-world-runtime.test.ts`
Expected: all runtime tests PASS.

- [ ] **Step 6: Commit**

`git add packages/contracts/src/index.ts packages/world/src/mhcm-world-runtime.ts packages/world/src/mhcm-world-runtime.test.ts && git commit -m "feat(world): authorize MHCM proposal materialization"`

### Task 2: Project authoritative MHCM application into Chronicle

**Files:**
- Modify: `packages/chronicle/src/zero-chronicle.ts`
- Create or modify the existing Chronicle test file covering `projectZeroChronicle`.

**Interfaces:**
- Consumes: authoritative `HnkEvent<MhcmProposalAppliedPayload>` emitted by Task 1.
- Produces: one `ChronicleEntry` with category `CREATION`, authority `WORLD_EVENT_DERIVED`, and source ref equal to the authoritative event ID.

- [ ] **Step 1: Write the failing Chronicle test**

Create a `MhcmProposalApplied` source event and assert exactly one projected entry with `category === 'CREATION'`, `authority === 'WORLD_EVENT_DERIVED'`, and `sourceEventRefs` deep-equal to `[event.eventId]`.

- [ ] **Step 2: Run the focused Chronicle test and verify RED**

Run the repository's Chronicle test command or the exact Node/tsx test file used by that package.
Expected: FAIL because `MhcmProposalApplied` has no projection case.

- [ ] **Step 3: Implement the Chronicle projection**

Add one `case 'MhcmProposalApplied'` to `projectZeroChronicle()`. Derive the entry from the World event only; do not import or accept `MhcmWorldProposal` in Chronicle.

- [ ] **Step 4: Run the focused Chronicle test and verify GREEN**

Expected: PASS with one traceable CREATION entry.

- [ ] **Step 5: Commit**

`git add packages/chronicle/src && git commit -m "feat(chronicle): project authorized MHCM world events"`

### Task 3: Prove the full KODE/MHCM → World → Chronicle path

**Files:**
- Create: `packages/world/src/mhcm-world-runtime.e2e.test.ts`
- Modify: `packages/world/src/index.ts`

**Interfaces:**
- Consumes: existing KODE/MHCM compile/execute APIs, `evaluateMhcmWorldOperation`, Task 1 runtime boundary, `projectZeroChronicle`.
- Produces: executable E2E proof of accepted and rejected paths.

- [ ] **Step 1: Write the accepted E2E test**

Compile/execute a minimal Path operation through the existing KODE/MHCM API, obtain the proposal through `evaluateMhcmWorldOperation`, apply it with matching active Presence authority, then assert: World entity exists under the supplied ID; event is `MhcmProposalApplied`; event provenance includes source IR provenance plus authority IDs; Chronicle returns a CREATION entry whose only source ref is the emitted event ID.

- [ ] **Step 2: Run the E2E test and verify RED if any integration export is missing**

Run: `pnpm exec tsx --test packages/world/src/mhcm-world-runtime.e2e.test.ts`.

- [ ] **Step 3: Export the runtime boundary from World**

Add `export * from './mhcm-world-runtime.ts';` to `packages/world/src/index.ts`. Make only integration fixes required by the E2E test; do not broaden scope.

- [ ] **Step 4: Write the paired rejection E2E test**

Use the same proposal but alter one authority identifier. Assert graph object identity is unchanged, no event exists, and projecting the empty event list yields no Chronicle entry.

- [ ] **Step 5: Run E2E tests and verify GREEN**

Expected: accepted and rejected paths PASS.

- [ ] **Step 6: Commit**

`git add packages/world/src && git commit -m "test(world): prove MHCM authority runtime end to end"`

### Task 4: Regression gate and delivery

**Files:**
- Modify only if a failing regression proves a necessary compatibility fix.

**Interfaces:**
- Consumes: Tasks 1–3.
- Produces: HV-01.6 candidate ready for PR.

- [ ] **Step 1: Verify the existing proposal-only boundary**

Run the existing `mhcm-world-gate.test.ts` suite and confirm the Presence remains unmutated and `effect === 'PROPOSAL_ONLY'`.

- [ ] **Step 2: Run package/global gates**

Run in order:
`pnpm typecheck`
`pnpm test:mhcm`
`pnpm test:world`
`pnpm test`
`pnpm web:build`
`pnpm check`

Expected: every command exits 0.

- [ ] **Step 3: Review the diff against non-goals**

Confirm there are no persistence, renderer/UI, general command-bus, direct MHCM mutation, random ID, or random timestamp additions.

- [ ] **Step 4: Commit any gate-only compatibility fix separately**

Use a narrow `fix(...)` commit only if fresh failing evidence required it.

- [ ] **Step 5: Open the HV-01.6 PR**

PR body must include the accepted E2E evidence, rejection evidence, complete gate results, and explicit statement that Chronicle derives from the authoritative World event rather than proposal data.
