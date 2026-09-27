# HNK-VERSE Foundation Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Introduce the minimum executable foundation required by the HNK-VERSE Master Architecture: HNK identity/coordinate primitives, Verse/Kodan capability contracts, ManifestationSession context, explicit WorldIntent→WorldEvent resolution, and causal Chronicle metadata without implementing the still-undefined final HNK-Math formula.

**Architecture:** Preserve the existing ZERO vertical slice and event-sourced runtime while generalizing its contracts. `packages/contracts` owns stable cross-package primitives; `packages/domain` owns Verse resolution and manifestation/cognitive context; `packages/chronicle` projects causal Chronicle data; `packages/simulation` remains orchestration; persistence is extended only where new stream identity/branch metadata requires it. Migration is additive first: existing ZERO commands/events remain adapters/proof fixtures while new generic contracts become authoritative boundaries.

**Tech Stack:** TypeScript 5.8.3, Node >=22, pnpm 10.17.1, existing workspace packages and script-based tests; no new runtime dependency.

**Spec:** `docs/superpowers/specs/2026-09-27-hnk-verse-master-architecture-design.md` and subordinate `docs/superpowers/specs/2026-09-27-cognitive-session-state-design.md`

## Global Constraints

- Identity is global; manifestations are contextual.
- Verse defines reality; Kodan defines experience.
- Kodan never directly mutates authoritative WorldState.
- WorldIntent is distinct from WorldEvent.
- Chronicle records authoritative causal transformation.
- Reality truth is distinct from observer knowledge; observed knowledge is distinct from Kodan manifestation.
- HnkId is distinct from path, coordinates, state and signature.
- Signatures are versioned computations, not canon authority.
- Computational HNK-Math must not claim undocumented formulas as CODEX canon.
- Capability contracts govern Verse/Kodan compatibility.
- Failed resolution must produce no partial authoritative mutation.
- Existing ZERO behavior must remain green throughout migration.
- Do not implement final HNK numeric coordinates, vector dimensionality/weights, 72-agent mapping or final relation vocabulary in this plan.

## Review Focus

1. Mutable path/coordinate data must never alter `HnkId`; Task 1 pins identity stability.
2. A Kodan lacking required Verse capabilities must be rejected before a ManifestationSession is created; Task 2 pins compatibility failure.
3. Rejected/partial WorldIntent resolution must not mutate state implicitly; Task 4 pins event-only mutation and rejection atomicity.
4. Chronicle causation/branch metadata must remain reconstructible after event replay; Task 5 pins causal projection and branch preservation.
5. Observer/manifestation context must not grant canon authority or leak unavailable truth; Task 3 pins context separation and Task 6 pins CognitiveSession integration boundaries.

---

## Current Impact Map

The current repository already has useful foundations that should be evolved, not discarded:

- `packages/contracts/src/index.ts` already separates commands and events and carries `verseId`, `worldId`, correlation/causation and provenance.
- `packages/domain/src/zero-command-handler.ts` already behaves like an early Verse resolver: commands are validated against world state/rules and emit events rather than mutating state directly.
- `packages/domain/src/zero-state.ts` already applies authoritative event reduction, but mixes world truth with observer knowledge, agent memory and human reflections; those boundaries must become explicit over subsequent tasks.
- `packages/chronicle/src/zero-chronicle.ts` currently projects readable entries from events; it is a presentation/projection layer, not yet the causal Chronicle graph described by the master spec.
- `packages/simulation/src/zero-command-runtime.ts` already provides idempotency, append-before-reduce orchestration and event replay semantics worth preserving.
- `packages/persistence/src/ports.ts` keys streams by `worldId`; branch/timeline identity is not yet explicit.
- `packages/contracts/src/knowledge.ts` already protects canon from derived authority and should remain the authority boundary.

This plan intentionally establishes the foundation in six reviewable increments instead of attempting the full Master Spec in one implementation.

### Task 1: HNK identity, path, coordinate, relation and signature contracts

**Files:**
- Create: `packages/contracts/src/hnk-math.ts`
- Modify: `packages/contracts/src/index.ts`
- Create: `scripts/hnk-math-contracts-check.ts`
- Modify: `package.json`

**Interfaces:**
- Produces: `HnkId`, `HnkPath`, `HnkCoordinate`, `HnkCoordinateSpace`, `HnkRelation`, `HnkSignatureRef`, `HnkAddress`, `assertHnkCoordinate()`, `assertHnkSignatureRef()`.
- Consumes: existing provenance/canon concepts only; no numeric HNK formula.

- [ ] **Step 1: Write the failing contract check**

Create `scripts/hnk-math-contracts-check.ts` asserting: an `HnkId` remains identical when path/coordinates change; coordinate spaces are explicitly typed; a signature requires `entityId`, `mathModelVersion`, `canonGraphVersion`, `signatureHash` and provenance; invalid/empty coordinate-space identity is rejected.

- [ ] **Step 2: Run the check and verify it fails**

Run: `node --experimental-strip-types scripts/hnk-math-contracts-check.ts`
Expected: FAIL because `@hnk-verse/contracts` does not export the HNK-Math primitives.

- [ ] **Step 3: Implement the contract-only primitives**

In `packages/contracts/src/hnk-math.ts`, define opaque/string-compatible `HnkId`, structured `HnkPath`, typed coordinate spaces (`SPATIAL | ASTRONOMICAL | MANDALA | TEMPORAL | CHRONICLE | KNOWLEDGE | KODAN` plus versionable custom space), provenance-bearing relations/signature references, and validators. Do not implement signature calculation.

- [ ] **Step 4: Export and register the test**

Export `./hnk-math` from `packages/contracts/src/index.ts`; add `test:hnk-math` to root scripts and include it in `pnpm test`.

- [ ] **Step 5: Verify**

Run: `pnpm test:hnk-math && pnpm typecheck`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add packages/contracts/src/hnk-math.ts packages/contracts/src/index.ts scripts/hnk-math-contracts-check.ts package.json
git commit -m "feat(contracts): add HNK identity and coordinate primitives"
```

### Task 2: Verse/Kodan capability and ManifestationSession contracts

**Files:**
- Create: `packages/contracts/src/manifestation.ts`
- Modify: `packages/contracts/src/index.ts`
- Create: `packages/domain/src/manifestation-session.ts`
- Modify: `packages/domain/src/index.ts`
- Create: `scripts/manifestation-session-check.ts`
- Modify: `package.json`

**Interfaces:**
- Consumes: `HnkId` from Task 1.
- Produces: `VerseCapability`, `VerseCapabilitySet`, `KodanRequirementSet`, `ManifestationSession`, `checkKodanCompatibility(verse, kodan)`, `createManifestationSession(input)`.

- [ ] **Step 1: Write the failing compatibility/session check**

Assert that ALCHEMY requirements `KNOWLEDGE`, `OBSERVATION`, `EXPERIMENT`, `EVIDENCE` are accepted by a Verse providing all four; missing `EXPERIMENT` returns an explicit incompatibility result; successful session creation preserves distinct `identityId`, `manifestationId`, `verseId`, `kodanId`, `worldStateVersion` and `chronicleCursor`.

- [ ] **Step 2: Run and verify failure**

Run: `node --experimental-strip-types scripts/manifestation-session-check.ts`
Expected: FAIL because the contracts/functions do not exist.

- [ ] **Step 3: Implement capability contracts**

Define versionable string capability types and compatibility result `{ compatible: true } | { compatible: false; missing: VerseCapability[] }` in `packages/contracts/src/manifestation.ts`.

- [ ] **Step 4: Implement session creation**

Implement `createManifestationSession(input)` in `packages/domain/src/manifestation-session.ts`; preflight compatibility and throw/return the project-standard explicit domain error before constructing a session when requirements are missing. Session creation must not mutate WorldState.

- [ ] **Step 5: Export, register and verify**

Run: `pnpm test:manifestation && pnpm typecheck`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add packages/contracts/src/manifestation.ts packages/contracts/src/index.ts packages/domain/src/manifestation-session.ts packages/domain/src/index.ts scripts/manifestation-session-check.ts package.json
git commit -m "feat(domain): add Verse Kodan manifestation contracts"
```

### Task 3: Separate reality context from observer and Kodan projection context

**Files:**
- Create: `packages/contracts/src/reality-context.ts`
- Modify: `packages/contracts/src/index.ts`
- Create: `packages/domain/src/observation-context.ts`
- Modify: `packages/domain/src/index.ts`
- Create: `scripts/reality-context-check.ts`
- Modify: `package.json`

**Interfaces:**
- Consumes: HNK primitives and ManifestationSession identifiers from Tasks 1–2.
- Produces: `RealityContextRef`, `ObserverContextRef`, `KodanProjectionContextRef`, `ObservationSurface`, `createObservationSurface(input)`.

- [ ] **Step 1: Write the failing separation check**

Assert that authoritative reality refs can exist without observer knowledge; observer context references evidence/knowledge separately; Kodan projection references observer-visible facts rather than the complete reality payload; creating an observation surface does not change knowledge lifecycle/authority.

- [ ] **Step 2: Run and verify failure**

Run: `node --experimental-strip-types scripts/reality-context-check.ts`
Expected: FAIL because reality/observer/projection contracts do not exist.

- [ ] **Step 3: Implement reference contracts and observation surface**

Keep contracts reference-based (`entityId`, `worldStateVersion`, fact/event refs, observer/session refs, Kodan capability refs). Do not duplicate WorldState or implement sensory simulation yet.

- [ ] **Step 4: Export, register and verify**

Run: `pnpm test:reality-context && pnpm test:knowledge && pnpm typecheck`
Expected: PASS, including existing canon-authority checks.

- [ ] **Step 5: Commit**

```bash
git add packages/contracts/src/reality-context.ts packages/contracts/src/index.ts packages/domain/src/observation-context.ts packages/domain/src/index.ts scripts/reality-context-check.ts package.json
git commit -m "feat(domain): separate reality observation and Kodan projection"
```

### Task 4: General WorldIntent → VerseResolution → WorldEvent boundary

**Files:**
- Create: `packages/contracts/src/reality-events.ts`
- Modify: `packages/contracts/src/index.ts`
- Create: `packages/domain/src/verse-resolver.ts`
- Modify: `packages/domain/src/index.ts`
- Modify: `packages/domain/src/zero-command-handler.ts`
- Create: `scripts/verse-resolution-check.ts`
- Modify: `package.json`

**Interfaces:**
- Consumes: existing `HnkCommand`, `HnkEvent`, ZERO resolver/state, ManifestationSession context.
- Produces: `WorldIntent<T>`, `WorldResolution`, `WorldResolutionStatus = ACCEPTED | TRANSFORMED | REJECTED | PARTIAL`, `VerseResolver<TState>`, ZERO adapter from existing command handling into the generic resolver boundary.

- [ ] **Step 1: Write the failing resolution-boundary check**

Assert: a WorldIntent contains actor/identity, Verse, Kodan/manifestation session and causation/correlation refs; resolver output distinguishes intent from events; rejected resolution emits no authoritative events and leaves input state byte-for-byte equivalent; accepted ZERO action still emits existing `HnkEvent` semantics.

- [ ] **Step 2: Run and verify failure**

Run: `node --experimental-strip-types scripts/verse-resolution-check.ts`
Expected: FAIL because generic WorldIntent/VerseResolver contracts do not exist.

- [ ] **Step 3: Implement generic contracts and resolver interface**

Define the generic types in contracts/domain without moving ZERO gameplay rules. `VerseResolver.resolve(state, intent)` returns a decision/events; it never mutates the supplied state.

- [ ] **Step 4: Adapt ZERO command handling**

Wrap `handleZeroCommand` as a ZERO Verse resolver adapter. Preserve all existing command/event payloads, rejection codes and current tests. Do not rewrite the entire handler.

- [ ] **Step 5: Verify atomicity and regression suite**

Run: `pnpm test:verse-resolution && pnpm test:zero && pnpm test:spatial && pnpm test:path-routing && pnpm typecheck`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add packages/contracts/src/reality-events.ts packages/contracts/src/index.ts packages/domain/src/verse-resolver.ts packages/domain/src/index.ts packages/domain/src/zero-command-handler.ts scripts/verse-resolution-check.ts package.json
git commit -m "refactor(domain): formalize WorldIntent Verse resolution boundary"
```

### Task 5: Upgrade Chronicle from presentation-only projection to causal event metadata

**Files:**
- Create: `packages/contracts/src/chronicle.ts`
- Modify: `packages/contracts/src/index.ts`
- Create: `packages/chronicle/src/causal-chronicle.ts`
- Modify: `packages/chronicle/src/index.ts`
- Modify: `packages/chronicle/src/zero-chronicle.ts`
- Create: `scripts/causal-chronicle-check.ts`
- Modify: `package.json`

**Interfaces:**
- Consumes: `HnkEvent`, HNK refs and WorldResolution metadata.
- Produces: `ChronicleEventRef`, `ChronicleBranchRef`, `CausalChronicleNode`, `projectCausalChronicle(sources)`; existing `projectZeroChronicle()` remains a readable Kodan/UI projection.

- [ ] **Step 1: Write the failing causal Chronicle check**

Assert: causation links survive projection; branch identity is explicit and defaults to a stable root branch for legacy ZERO events; source event refs remain reconstructible; human reflection remains interpretation rather than authoritative reality; event replay order does not erase causal refs.

- [ ] **Step 2: Run and verify failure**

Run: `node --experimental-strip-types scripts/causal-chronicle-check.ts`
Expected: FAIL because causal Chronicle contracts do not exist.

- [ ] **Step 3: Implement causal Chronicle contracts/projector**

Represent nodes by refs/metadata rather than duplicating full state. Preserve `eventId`, Verse/world, branch, time, cause/correlation, actors/targets, provenance and optional signature/fact refs. Do not implement timeline forking storage yet.

- [ ] **Step 4: Reclassify current readable Chronicle**

Keep `projectZeroChronicle()` behavior stable but document/type it as a human-readable projection over authoritative events, not the authoritative Chronicle store itself.

- [ ] **Step 5: Verify**

Run: `pnpm test:causal-chronicle && pnpm test:chronicle && pnpm test:zero && pnpm typecheck`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add packages/contracts/src/chronicle.ts packages/contracts/src/index.ts packages/chronicle/src/causal-chronicle.ts packages/chronicle/src/index.ts packages/chronicle/src/zero-chronicle.ts scripts/causal-chronicle-check.ts package.json
git commit -m "feat(chronicle): add causal Chronicle graph projection"
```

### Task 6: Reconcile CognitiveSession with ManifestationSession without implementing full cognition

**Files:**
- Create: `packages/contracts/src/cognition.ts`
- Modify: `packages/contracts/src/index.ts`
- Create: `packages/domain/src/cognitive-session-context.ts`
- Modify: `packages/domain/src/index.ts`
- Modify: `packages/domain/src/agent-knowledge-context.ts`
- Modify: `packages/domain/src/system-knowledge-context.ts`
- Create: `scripts/cognitive-context-check.ts`
- Modify: `package.json`

**Interfaces:**
- Consumes: ManifestationSession, Reality/Observer context, existing knowledge access/memory contracts.
- Produces: `CognitiveSessionContext`, `CognitiveConsumerKind`, `createCognitiveSessionContext(input)` and explicit refs for `verseId`, `kodanId`, `manifestationSessionId`, `worldStateVersion`, `chronicleCursor`.

- [ ] **Step 1: Write the failing cognitive-context check**

Assert: cognitive context binds consumer to Verse/Kodan/ManifestationSession; only retained memory refs are eligible for bootstrap using the existing memory policy; observed facts remain separate from canon refs; context construction cannot create `ROOT_CANON`, `DOMAIN_CANON` or lifecycle `CANON`.

- [ ] **Step 2: Run and verify failure**

Run: `node --experimental-strip-types scripts/cognitive-context-check.ts`
Expected: FAIL because the reconciled cognitive context contract does not exist.

- [ ] **Step 3: Implement context binding**

Implement only session context/bootstrap composition. Reuse existing `KnowledgeMemory`, query/access and authority checks. Do not implement the full OPEN→ACTIVE→CLOSING→CLOSED manager in this task; that remains a subsequent plan under the subordinate CognitiveSession spec.

- [ ] **Step 4: Adapt agent/system knowledge contexts**

Add optional/required contextual refs in the least-breaking way consistent with current call sites, preserving current knowledge tests and CODEX sync behavior.

- [ ] **Step 5: Verify full repository gate**

Run: `pnpm test:cognitive-context && pnpm check`
Expected: all tests, typecheck and web build PASS.

- [ ] **Step 6: Commit**

```bash
git add packages/contracts/src/cognition.ts packages/contracts/src/index.ts packages/domain/src/cognitive-session-context.ts packages/domain/src/index.ts packages/domain/src/agent-knowledge-context.ts packages/domain/src/system-knowledge-context.ts scripts/cognitive-context-check.ts package.json
git commit -m "feat(cognition): bind cognitive context to Verse and Kodan"
```

## Deferred Follow-up Plans

After this foundation lands and passes review, create separate implementation plans for:

1. **CognitiveSession runtime** — OPEN→ACTIVE→CLOSING→CLOSED, observation journal, working memory, immutable reports.
2. **HNK-Math engine** — only after canonical extraction defines the actual computational model; signature calculation, dependency sets and aggregation profiles.
3. **Branch/timeline persistence** — branch-aware event streams/snapshots and variant identity lifecycle.
4. **Reality fact/signature engine** — fact mutation sets, signature invalidation and deterministic recomputation.
5. **Kodan adapters** — ALAKAZAM, ALCHEMY and CRONICAS capability manifests and projection adapters.
6. **Persistence migration** — schema evolution for generic Verse/branch/session identifiers after the domain contracts stabilize.

## Self-Review Result

- Spec coverage: this plan intentionally covers the executable foundation only; final HNK-Math, full cognition, timeline persistence and Kodan gameplay are explicitly deferred into independent plans because the Master Spec spans multiple subsystems.
- Step scan: every task has a failing check, minimal implementation, verification and commit gate.
- Type consistency: HNK primitives feed ManifestationSession; ManifestationSession feeds observation/reality and cognition; WorldIntent feeds Verse resolution; authoritative events feed Chronicle.
- Review Focus: all five listed failure classes are pinned to named tasks/tests.
- Proportion: existing ZERO runtime is adapted rather than rewritten; no new database/vendor dependency is introduced.
