# MHCM — Mandala-HNK Computational Model v0.1

Status: DESIGN SPEC — CANON DIRECTION APPROVED
Date: 2026-09-27
Scope: HNK-KODE-SCRIPT / HNK-VERSE

## 1. Intent

Mandala-HNK is simultaneously:

1. an encoding space;
2. a grammar space;
3. a computational substrate.

HNK-KODE-SCRIPT must not treat the Mandala as decorative notation added after textual programming. Text, glyph, visual editing and Mandala operations are projections/manipulations of one computational program identity.

Core pipeline:

`INTENTION → HNK-KODE → MANDALA/PATH → AST → HNK-IR → HNK-VERSE → MANIFESTATION`

Bidirectional representation target:

`TEXT ↔ AST ↔ MANDALA ↔ GLYPH ↔ HNK-IR`

Round-trip equivalence is a design requirement wherever a representation is lossless.

## 2. Authority boundary

CODEX-HNK remains the canonical authority for HNK and the Mandala-HNK definitions promoted to canon.

HNK-KODE consumes versioned Mandala/contracts. HNK-VERSE executes compiled manifestations. TKN-OS preserves institutional lineage, evidence and know-how.

`RUNTIME != CANON`
`ENCODING != SEMANTIC AUTHORITY`
`PROJECTION != SOURCE OF TRUTH`

The programming model must not assign semantic meaning to currently unassigned Mandala cells merely to complete a numeric pattern.

## 3. Existing numeric structures

Current HNK work contains the numeric structures 432, 463 and 504, PATH concepts, cells, transformations and glyph structures. Their exact computational role is not fully frozen by this specification.

Therefore v0.1 treats them as governed input constraints rather than inventing an opcode table.

A future canonical mapping may define subsets such as active, reserved, structural or extension spaces only when supported by CODEX-HNK authority.

## 4. Computational primitives

### Cell

An addressable Mandala position. A Cell has identity and structural location. Semantic payload is optional and authority-scoped.

### Address

A stable reference to a Cell or structural position. Addresses must be serializable and deterministic within a declared Mandala version.

### Edge

A typed transition/relation between addressable positions.

### Path

An ordered traversal over Mandala structure. A Path can participate in addressing, composition, control/transform semantics or glyph construction when explicitly typed.

A Path is not automatically executable code.

### Glyph

A structured representation derived from Mandala positions/paths/transforms. A Glyph may represent a computational construct only when a grammar mapping grants that meaning.

### Transform

A typed operation over Mandala structure or representation. Transform semantics must be deterministic for a declared version.

### Composition

A rule for combining primitives/constructs while preserving identity, ordering and provenance.

### Type

A semantic constraint recognized by HNK-KODE's type system. Types may reference CODEX-HNK contracts but compiler-local implementation types must remain distinguishable from canon types.

### Operator

An executable semantic operation. Operators require explicit definition; a cell/path does not become an operator merely by occupying a position.

### Program

A versioned computational unit with one logical identity and potentially multiple representations: text, AST, Mandala graph, glyph projection and HNK-IR.

## 5. Three simultaneous roles

### 5.1 Encoding

Mandala-HNK provides deterministic representation/addressing for program constructs.

Requirements:
- versioned encoding;
- stable canonical serialization;
- reserved/unknown states preserved rather than guessed;
- source locations/provenance retained through compilation;
- decoding errors explicit.

### 5.2 Grammar

Mandala topology can participate in syntactic relationships.

Potential grammar dimensions include position, adjacency, path order, edge type, composition and transform.

Exact mappings remain unfrozen until the CODEX-HNK Mandala specification is audited and a grammar spike proves round-trip behavior.

### 5.3 Computational substrate

Mandala structure may participate directly in evaluation, addressing, relation resolution and transformation.

The substrate must compile to HNK-IR rather than bind the language permanently to one runtime implementation.

## 6. Representation model

One ProgramIdentity may own multiple RepresentationRefs:

- TextRepresentation;
- AstRepresentation;
- MandalaRepresentation;
- GlyphRepresentation;
- IrRepresentation.

Representations are not independent canonical programs.

A transformation records:
- source representation;
- target representation;
- compiler/model version;
- authority/schema versions;
- lossless/lossy status;
- provenance/evidence.

## 7. Round-trip invariants

For the supported lossless subset:

`parse(print(AST)) ≡ AST`

`decode(encode(MANDALA)) ≡ MANDALA`

`mandalaToAst(astToMandala(AST)) ≡ AST`

`irFromText(TEXT) ≡ irFromMandala(MANDALA)`

Equivalence means semantic equivalence under the same versioned contracts, not necessarily byte-for-byte formatting equality.

Lossy projections such as simplified glyph rendering must declare that they are lossy and cannot silently become compilation sources.

## 8. Identity and HNK-Math

The model must support stable identities for Programs, Cells, Paths, Glyphs and compiled artifacts.

HNK-Math may provide deterministic signatures, coordinates and relation addressing. Exact formulas remain governed by CODEX-HNK and are not invented in MHCM v0.1.

Every compiled artifact should be traceable to:

`Program ID + Source Version + Mandala Version + Grammar Version + Compiler Version + Authority Refs`

## 9. AST boundary

AST represents language syntax/semantics independent of textual formatting.

The AST must be able to represent the initial HNK-KODE subset:
- world;
- entity;
- property;
- event;
- action.

Mandala mappings target AST constructs rather than directly generating runtime-specific TypeScript structures.

## 10. HNK-IR boundary

HNK-IR is the stable runtime-neutral intermediate representation.

Responsibilities:
- normalize equivalent source representations;
- preserve IDs and provenance;
- encode typed world/entity/event/action semantics;
- expose validation diagnostics;
- support multiple runtime adapters.

Initial adapter target: HNK-VERSE TypeScript/JavaScript runtime.

Future adapters may include other engines without changing the source language's semantic identity.

## 11. Execution model

Execution is intentionally downstream:

`SOURCE → REPRESENTATION VALIDATION → AST → SEMANTIC ANALYSIS → HNK-IR → RUNTIME ADAPTER → EXECUTION`

A Glyph or Path never executes merely because it exists. Execution requires successful semantic resolution and compilation.

## 12. World identity model

MHCM must be capable of addressing nested world structures such as:

`Object → Room → House/Area → Lot → City → Region → World → Verse`

and relational structures such as:

`Character → Relationship → Group → Guild → Faction → Community → Civilization`

and authored gameplay structures:

`Event → Quest → System → GameMode → Game → Verse`

These hierarchies are design axes, not a claim that every Verse must instantiate every level.

## 13. Visual programming consequence

Because Mandala is a computational substrate, HNK-KODE Studio can eventually expose visual editing without creating a second programming language.

A user may manipulate text, nodes/paths, glyphs or world objects. All supported lossless operations converge on the same ProgramIdentity and HNK-IR.

This is the architectural basis for combining code-first, BYOND-like world authoring and RPG-Maker-like visual authoring.

## 14. Diagnostics

Compiler diagnostics should identify:
- source representation;
- Mandala address/path when available;
- textual source span when available;
- semantic/type error;
- governing contract/version;
- suggested repair only when deterministic.

Unknown/reserved Mandala semantics produce explicit diagnostics rather than inferred behavior.

## 15. Security and determinism

The first runtime subset should be deterministic and capability-bounded.

HNK-KODE source must not receive unrestricted host access by default. Filesystem, network, persistence, AI and deployment capabilities require explicit runtime capabilities/permissions.

Deterministic world logic should be separable from nondeterministic external effects.

## 16. Versioning

Version independently:
- Mandala model;
- grammar;
- standard library;
- HNK-IR;
- compiler;
- runtime adapter;
- CODEX authority contracts.

Programs declare or lock compatible versions so old worlds remain reproducible.

## 17. v0.1 implementation boundary

The first proof must demonstrate one closed loop:

1. Define a tiny textual HNK-KODE world.
2. Parse to AST.
3. Map the supported AST subset to a minimal Mandala representation.
4. Decode the Mandala representation back to equivalent AST.
5. Lower to HNK-IR.
6. Execute through an HNK-VERSE runtime adapter.
7. Verify equivalent runtime behavior from text and Mandala sources.

No v0.1 requirement for:
- full 432/463/504 semantic allocation;
- custom VM;
- native compiler;
- complete IDE;
- complete visual editor;
- full-stack backend syntax;
- automatic canon promotion.

## 18. Acceptance criteria

MHCM v0.1 succeeds when:

- Mandala is demonstrably encoding + grammar + substrate for a bounded subset;
- text and Mandala compile to semantically equivalent HNK-IR;
- unknown/reserved cells remain safe and explicit;
- provenance/version metadata survives compilation;
- no runtime artifact is confused with CODEX-HNK canon;
- a minimal world authored through HNK-KODE executes in HNK-VERSE.

## 19. Canonical design statement

**Mandala-HNK is a computational foundation of HNK-KODE-SCRIPT: simultaneously an encoding space, grammar space and computational substrate. Text, glyph and visual authoring are representations of a shared program identity, compiled through AST and HNK-IR into HNK-VERSE manifestations.**
