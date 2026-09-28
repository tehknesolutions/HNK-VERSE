# HNK-KODE KODE-0.1 — Executable Language Specification

Status: EXPERIMENTAL / FROZEN BASELINE
Runtime target: MHCM v0.1 / HNK-VERSE
Source of truth: implementation in `packages/mhcm/src/kode.ts`, `kode-semantic.ts`, `kode-compile.ts`, diagnostics, and test gates.

## 1. Scope

KODE-0.1 is the minimal textual front-end currently implemented for HNK-KODE. It supports three statement forms:

- `path`
- `reverse`
- `compose`

This specification freezes the current behavior. It does not define future HNK-KODE constructs.

## 2. Tokens

The lexer emits:

`IDENT`, `STRING`, `ARROW`, `LPAREN`, `RPAREN`, `COMMA`, `EQUALS`, `SEMICOLON`, `EOF`.

Identifiers match:

`[A-Za-z_][A-Za-z0-9_-]*`

The arrow token is `->`.

## 3. Statements

### Path declaration

```
path NAME = NODE -> NODE -> ...;
```

A path requires at least two nodes.

### Reverse

```
reverse NAME = SOURCE;
```

The result has the source path's nodes in reverse order and swaps its static start/end.

### Compose

```
compose NAME = LEFT, RIGHT;
```

Composition is valid only when:

`end(LEFT) == start(RIGHT)`

The composed path contains the left nodes followed by the right nodes excluding its first node.

## 4. Semantic rules

1. Symbols must be declared before use.
2. Symbol names must be unique within a program.
3. `reverse` requires a known Path symbol.
4. `compose` requires two known Path symbols.
5. `compose` requires static connectivity.
6. Invalid programs produce structured diagnostics and no Program Graph.
7. Valid programs compile to an MHCM Program Graph.
8. The final declared node is the program output.

## 5. Diagnostics

Current diagnostic codes:

- `E_SYNTAX`
- `E_SYMBOL`
- `E_ARITY`
- `E_CONNECTIVITY`
- `E_DUPLICATE`

Not every declared code is necessarily emitted by every current source path; this document records the current diagnostic vocabulary.

## 6. Compilation contract

Strict API:

`compileKode(source) -> MhcmProgram`

Non-throwing API:

`tryCompileKode(source) -> KodeCompileResult`

Success:

```
{ ok: true, program, diagnostics: [] }
```

Failure:

```
{ ok: false, program: null, diagnostics: [...] }
```

## 7. Lowering

The current lowering is:

```
KODE source
→ lexer
→ parser / KODE AST
→ semantic analysis
→ MHCM Program Graph
→ HNK-IR during execution
→ MHCM runtime
→ HNK-VERSE state/events
```

## 8. Compatibility rule

KODE-0.1 is a frozen experimental baseline. New syntax or semantics must be introduced under a new version rather than silently changing the meaning of an existing KODE-0.1 program.
