# MHCM / HNK-KODE KODE-0 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first closed HNK-KODE loop: textual world source → AST → Mandala representation → equivalent AST → HNK-IR → minimal HNK-VERSE runtime result.

**Architecture:** Add a focused `@hnk-verse/kode` package containing syntax/AST, MHCM representation, deterministic mapping, HNK-IR lowering and a bounded runtime adapter. Mandala-HNK is encoding + grammar + computational substrate, while CODEX-HNK remains semantic authority; v0.1 does not invent meanings for unassigned 432/463/504 positions.

**Tech Stack:** Node >=22, TypeScript 5.8.3, pnpm 10.17.1, workspace packages, Node `--experimental-strip-types` checks.

**Spec:** `docs/superpowers/specs/2026-09-27-mandala-hnk-computational-model-design.md`

## Global Constraints

- Mandala-HNK is simultaneously encoding space, grammar space and computational substrate.
- Preserve `TEXT ↔ AST ↔ MANDALA ↔ GLYPH ↔ HNK-IR` as the long-term representation model; KODE-0 implements the lossless text/AST/Mandala/HNK-IR subset only.
- Do not allocate semantic meaning to currently unassigned 432/463/504 positions.
- Runtime artifacts and projections are not CODEX-HNK canon.
- Initial syntax subset is exactly: `world`, `entity`, `property`, `event`, `action`.
- Unknown/reserved Mandala semantics fail explicitly rather than being inferred.
- Runtime is deterministic and capability-bounded; no unrestricted host filesystem/network/AI access.
- Compiled artifacts preserve program/source/Mandala/grammar/compiler/authority version metadata.

## Review Focus

- Unknown or reserved Mandala address: decoder must reject it explicitly, never infer an operator.
- Duplicate entity/property names in the same scope: semantic validation must reject deterministic ambiguity.
- Malformed textual source: parser diagnostic must include a source span and expected construct.
- Representation version mismatch: Mandala decoder must reject incompatible model/grammar versions.
- Round-trip source formatting differences: semantic equivalence must compare normalized AST/HNK-IR, not source bytes.

---

### Task 1: KODE-0 AST and parser

**Files:**
- Create: `packages/kode/package.json`
- Create: `packages/kode/tsconfig.json`
- Create: `packages/kode/src/ast.ts`
- Create: `packages/kode/src/parser.ts`
- Create: `packages/kode/src/index.ts`
- Create: `scripts/kode-parser-check.ts`
- Modify: `package.json`

**Interfaces:**
- Consumes: UTF-8 HNK-KODE source string.
- Produces: `parseKode(source: string): KodeProgram` and AST types `KodeProgram`, `WorldDeclaration`, `EntityDeclaration`, `PropertyDeclaration`, `EventDeclaration`, `ActionDeclaration` with source spans.

- [ ] **Step 1: Write the failing parser check**

Use a tiny source containing one world, one entity/property and one event/action. Assert the world/entity/action names and source spans. Add malformed-input and duplicate-name assertions for the Review Focus cases owned by this task.

- [ ] **Step 2: Run the parser check and verify RED**

Run: `node --experimental-strip-types scripts/kode-parser-check.ts`
Expected: FAIL because `@hnk-verse/kode` / `parseKode` does not exist.

- [ ] **Step 3: Implement the minimal tokenizer/parser and AST**

Implement `parseKode(source: string): KodeProgram`. Keep the grammar bounded to the five KODE-0 constructs; diagnostics expose `start`, `end`, and an expected-construct message. Reject duplicate entity/property names in the same scope.

- [ ] **Step 4: Verify GREEN**

Run: `node --experimental-strip-types scripts/kode-parser-check.ts`
Expected: `KODE parser check passed`.

- [ ] **Step 5: Commit**

`git commit -m "feat(kode): add KODE-0 parser and AST"`

### Task 2: MHCM v0.1 representation and deterministic AST mapping

**Files:**
- Create: `packages/kode/src/mhcm.ts`
- Create: `packages/kode/src/mandala-mapping.ts`
- Create: `scripts/mhcm-roundtrip-check.ts`
- Modify: `packages/kode/src/index.ts`
- Modify: `package.json`

**Interfaces:**
- Consumes: `KodeProgram` from Task 1.
- Produces: `MandalaProgramV01`, `astToMandala(ast: KodeProgram): MandalaProgramV01`, `mandalaToAst(mandala: MandalaProgramV01): KodeProgram`.

- [ ] **Step 1: Write the failing MHCM round-trip check**

Assert `mandalaToAst(astToMandala(parseKode(source)))` is semantically equal to the normalized original AST. Assert model/grammar version metadata exists. Assert unknown/reserved addresses and incompatible versions throw explicit diagnostics.

- [ ] **Step 2: Run and verify RED**

Run: `node --experimental-strip-types scripts/mhcm-roundtrip-check.ts`
Expected: FAIL because MHCM mapping APIs do not exist.

- [ ] **Step 3: Implement MHCM primitives and mapping**

Define versioned `MandalaAddress`, `MandalaCell`, `MandalaEdge`, `MandalaPath`, `MandalaTransform`, `MandalaProgramV01`. For KODE-0, use only a small explicitly declared structural address subset; label all other numeric space unassigned/reserved. Mapping must be deterministic and must preserve source/provenance refs.

- [ ] **Step 4: Verify GREEN**

Run: `node --experimental-strip-types scripts/mhcm-roundtrip-check.ts`
Expected: `MHCM round-trip check passed`.

- [ ] **Step 5: Commit**

`git commit -m "feat(kode): add MHCM v0.1 round-trip mapping"`

### Task 3: HNK-IR normalization

**Files:**
- Create: `packages/kode/src/ir.ts`
- Create: `packages/kode/src/lower.ts`
- Create: `scripts/kode-ir-equivalence-check.ts`
- Modify: `packages/kode/src/index.ts`
- Modify: `package.json`

**Interfaces:**
- Consumes: `KodeProgram` or decoded `MandalaProgramV01`.
- Produces: `HnkIrProgram`, `lowerAstToIr(ast: KodeProgram, metadata: CompilationMetadata): HnkIrProgram`, `lowerMandalaToIr(mandala: MandalaProgramV01, metadata: CompilationMetadata): HnkIrProgram`.

- [ ] **Step 1: Write the failing IR equivalence check**

Compile the same program from text and from its Mandala representation. Assert deep semantic equality of normalized HNK-IR and assert metadata contains Program ID, source version, Mandala version, grammar version, compiler version and authority refs.

- [ ] **Step 2: Run and verify RED**

Run: `node --experimental-strip-types scripts/kode-ir-equivalence-check.ts`
Expected: FAIL because HNK-IR lowering does not exist.

- [ ] **Step 3: Implement runtime-neutral HNK-IR lowering**

IR contains typed world/entity/property/event/action semantics and provenance/version metadata only; no TypeScript/runtime-specific objects.

- [ ] **Step 4: Verify GREEN**

Run: `node --experimental-strip-types scripts/kode-ir-equivalence-check.ts`
Expected: `HNK-IR equivalence check passed`.

- [ ] **Step 5: Commit**

`git commit -m "feat(kode): add runtime-neutral HNK-IR"`

### Task 4: Minimal HNK-VERSE runtime adapter

**Files:**
- Create: `packages/domain/src/kode-runtime-adapter.ts`
- Create: `scripts/kode-runtime-check.ts`
- Modify: `packages/domain/src/index.ts`
- Modify: `package.json`

**Interfaces:**
- Consumes: `HnkIrProgram` from Task 3.
- Produces: `instantiateKodeWorld(ir: HnkIrProgram): KodeWorldInstance` and `dispatchKodeEvent(instance: KodeWorldInstance, eventName: string): KodeRuntimeResult`.

- [ ] **Step 1: Write the failing runtime check**

Instantiate the tiny KODE-0 world and dispatch its event. Assert the declared action occurs deterministically. Assert undeclared host capabilities are unavailable.

- [ ] **Step 2: Run and verify RED**

Run: `node --experimental-strip-types scripts/kode-runtime-check.ts`
Expected: FAIL because the runtime adapter does not exist.

- [ ] **Step 3: Implement the capability-bounded adapter**

The adapter interprets only the KODE-0 IR constructs. No filesystem, network, AI or arbitrary host execution is exposed.

- [ ] **Step 4: Verify GREEN**

Run: `node --experimental-strip-types scripts/kode-runtime-check.ts`
Expected: `KODE runtime check passed`.

- [ ] **Step 5: Commit**

`git commit -m "feat(domain): execute KODE-0 HNK-IR worlds"`

### Task 5: Closed-loop acceptance gate

**Files:**
- Create: `scripts/mhcm-kode0-acceptance-check.ts`
- Modify: `package.json`

**Interfaces:**
- Consumes: Tasks 1–4 public interfaces.
- Produces: one acceptance command proving the v0.1 closed loop.

- [ ] **Step 1: Write the acceptance gate**

From one textual source, run text → AST → Mandala → AST → HNK-IR → runtime. Independently lower text AST directly to HNK-IR and execute it. Assert equivalent normalized IR and runtime result, preserved metadata, explicit rejection of a reserved/unknown Mandala address, and no canon-promotion side effect.

- [ ] **Step 2: Run the new gate**

Run: `node --experimental-strip-types scripts/mhcm-kode0-acceptance-check.ts`
Expected: PASS only when Tasks 1–4 are integrated.

- [ ] **Step 3: Run regression checks**

Run: `pnpm test`
Expected: existing repository test suite remains green. If pre-existing unrelated failures exist, record them exactly and prove all KODE/MHCM gates green separately.

Run: `pnpm typecheck`
Expected: no new MHCM/KODE type errors. Pre-existing unrelated failures must be recorded rather than silently attributed to this work.

- [ ] **Step 4: Commit**

`git commit -m "test(kode): gate MHCM KODE-0 closed loop"`

## Completion Gate

KODE-0 is complete only when a minimal HNK-KODE world can be authored as text, represented losslessly in the bounded MHCM subset, lowered from either representation to equivalent HNK-IR, executed through HNK-VERSE with identical deterministic behavior, and traced through version/provenance metadata without inventing Mandala semantics or promoting runtime output to CODEX-HNK canon.
