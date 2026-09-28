# HNK-KODE KODE-0.2 — Extension Proposal

Status: DESIGN / NOT FROZEN

KODE-0.1 remains unchanged and is the compatibility baseline.

## Goal
Define the smallest next language layer without changing the meaning of existing KODE-0.1 programs.

## Proposed boundaries

### 1. Source locations
Every token and AST statement should carry source span information so diagnostics can point to exact ranges.

### 2. Comments
Introduce a non-semantic comment form, subject to explicit grammar approval before implementation.

### 3. Explicit program identity
Allow an optional program/module declaration while preserving the current default program identity.

### 4. Typed semantic model
Promote the current static Path model into explicit language-level types, initially: Path and operator result Path.

### 5. Semantic diagnostics
Diagnostics should carry code, message, source position/span, and related symbol when applicable.

### 6. Compiler boundary
Preserve: source → lexer → parser → semantic analyzer → compiler → MHCM Program.
The semantic analyzer must remain independent from MHCM runtime execution.

## Explicitly out of scope
KODE-0.2 must not silently add new runtime side effects, world mutation semantics, new canonical HNK-KODE vocabulary, new spiritual/canonical meanings, implicit coercions, or replacement of the KODE-0.1 grammar.

## Compatibility rule
A KODE-0.1 program must retain its existing parse, semantic meaning, and compiled Program Graph under KODE-0.2.

## Promotion gate
KODE-0.2 should not be frozen until grammar tests, source-span diagnostics, semantic tests, KODE-0.1 compatibility tests, negative tests, and compiler/runtime integration all pass.