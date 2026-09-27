# HNK-KODE Programming Language — Architecture Proposal

Status: APPROVED DIRECTION / DESIGN BASELINE
Date: 2026-09-27
Target: HNK-VERSE

## 1. Purpose

HNK-KODE gains a computational language layer for authoring HNK-VERSE worlds, entities, rules, events, interfaces and full-stack systems.

This does NOT replace the existing HNK-KODE language/spiritual-semantic authority. It defines a distinct computational layer within the HNK-KODE ecosystem.

## 2. Core principle

HNK-KODE is the authoring language between intention and executable manifestation:

`INTENTION → HNK-KODE → COMPILE → HNK-IR → RUNTIME → MANIFESTATION`

The language is inspired by the functional role of BYOND's integrated language/world-building model and the authoring accessibility of RPG Maker, while remaining an original HNK system.

## 3. HNK-KODE family

The ecosystem may contain separate layers:

- HNK-KODE Language — HNK linguistic/semantic layer.
- HNK-KODE Script — executable logic.
- HNK-KODE Data — entities, schemas and world data.
- HNK-KODE UI — interface declarations.
- HNK-KODE World — world/Verse authoring.
- HNK-KODE Flow — events, workflows and automation.

These layers share identity, type and provenance contracts but must not be conflated.

## 4. Full-stack target

HNK-KODE should eventually express:

- World and game logic.
- Entities and components.
- UI/UX.
- Server/backend logic.
- APIs and network events.
- Persistence/data models.
- Authentication/identity integration.
- AI/agent behavior.
- Automation/workflows.
- Economy/social systems.
- Animation/audio/asset references.
- Build/deploy configuration.

The initial implementation should not attempt to replace every underlying technology.

## 5. Compiler architecture

Initial target:

```
HNK-KODE
   ↓
Lexer / Parser
   ↓
AST
   ↓
Semantic Analyzer / Type Checker
   ↓
HNK-IR
   ↓
TypeScript / JavaScript target
   ↓
HNK-VERSE Runtime
```

Future targets may include Godot, Unity, native runtimes or a dedicated VM. These are future adapters, not current commitments.

## 6. CODEX integration

CODEX-HNK remains the HNK canonical authority.

The compiler may consume versioned canonical schemas/contracts from CODEX-HNK.

Conceptually:

```
CODEX-HNK
   ↓
Canonical Types / Contracts
   ↓
HNK-KODE Type System
   ↓
Validation
   ↓
Compilation
```

The compiler must not silently create or promote HNK canon.

## 7. HNK-Math integration

HNK-Math can provide deterministic identity, coordinates, signatures and relationship addressing.

A future HNK-KODE declaration may express:

```
entity Crystal {
    color = HNK.Color("#65c333")
    identity = HNK.Math.signature(...)
}
```

The exact syntax is not frozen by this document.

The existing HNK-KODE 432/463/504 encoding hypotheses must remain separately validated and must not be assumed to be the programming-language grammar.

## 8. World authoring model

The target authoring model is hierarchical:

```
Object
 ↓
Room
 ↓
House / Area
 ↓
Lot
 ↓
City
 ↓
Region
 ↓
World
 ↓
Verse
```

Other axes include:

```
Character → Relationship → Group → Guild → Faction → Community → Civilization
```

and:

```
Event → Quest → System → Game Mode → Game → Verse
```

These are design models, not yet runtime contracts.

## 9. Example syntax

Illustrative only:

```
world AbraIsland {
    player Alakazam {
        spawn = "Cave"
    }

    area Cave {
        npc Shimokode {
            behavior = hostile
        }

        event awakening {
            trigger = player.enter
            action = awaken("Alakazam")
        }
    }
}
```

The syntax remains unfrozen until a parser/type-system spike validates the design.

## 10. Full-stack example

Illustrative only:

```
service PlayerProfile {
    database users

    route GET "/profile/:id" {
        return users.find(id)
    }

    route POST "/profile" {
        users.create(body)
    }

    ui ProfileScreen {
        render(user)
    }
}
```

This demonstrates the intended direction: one authoring language can describe multiple stack layers while the compiler/runtime remains responsible for mapping them to implementation technologies.

## 11. HNK-KODE Studio

The eventual authoring environment should provide:

- project/world explorer;
- code editor;
- entity/schema editor;
- world/scene editor;
- asset browser;
- inspector;
- console;
- runtime preview;
- tests/validation;
- build/deploy;
- Chronicle/provenance view.

The Studio is a future product layer, not part of the first compiler milestone.

## 12. Runtime relationship

```
CODEX-HNK
   ↓ contracts
HNK-KODE
   ↓ compiled manifestation
HNK-VERSE
   ↓
Verse
   ↓
Kodan
   ↓
Runtime
```

TKN-OS remains the Tehkné institutional memory/lineage system and does not become the compiler's semantic authority.

## 13. Governance

The following distinctions are mandatory:

`SOURCE != CANON`

`CODE != EXECUTION`

`COMPILED != APPROVED`

`RUNTIME EVENT != CANON`

`PROJECTION != AUTHORITY`

`SHARED CONTRACT != SHARED IDENTITY`

All generated artifacts should remain traceable to source code, schema versions and authority references.

## 14. MVP sequence

### KODE-0 — Grammar spike
Define a tiny grammar with:
- world;
- entity;
- property;
- event;
- action.

### KODE-1 — Parser
Produce AST with source locations.

### KODE-2 — Type system
Validate primitive types, entities, references and event signatures.

### KODE-3 — HNK-IR
Create a stable intermediate representation independent of TypeScript.

### KODE-4 — Runtime adapter
Compile a minimal subset to the existing HNK-VERSE runtime.

### KODE-5 — World authoring
Author a minimal playable world entirely from HNK-KODE.

### KODE-6 — Full-stack bridge
Add data/service/UI declarations only after the world/game subset is stable.

## 15. Non-goals for KODE-0

Do not build:
- a new VM;
- a native compiler;
- a complete standard library;
- a visual IDE;
- every backend integration;
- every HNK-Math rule;
- a replacement for TypeScript;
- automatic CODEX canonicalization.

The first proof is simpler:

**write a world in HNK-KODE → compile it → run it in HNK-VERSE.**

## 16. Strategic definition

HNK-KODE Programming Language is the computational authoring layer of HNK-VERSE.

Its long-term purpose is to make the HNK-VERSE equivalent of:

**BYOND world-building + RPG Maker authoring + full-stack development**

while preserving the HNK separation of canon, runtime, provenance and authority.

The first milestone is not a perfect language.

It is a working closed loop:

`KODE SOURCE → AST → HNK-IR → RUNTIME WORLD`.
