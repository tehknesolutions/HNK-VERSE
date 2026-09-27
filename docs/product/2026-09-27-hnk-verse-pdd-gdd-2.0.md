# HNK-VERSE — PDD/GDD 2.0

Status: PRODUCT BASELINE / REEVALUATED
Date: 2026-09-27

## 1. Canonical product definition

**HNK-VERSE = Plataforma Metaverso do HNK.**

HNK-VERSE is not one game, not HNK-KODE, not CODEX-HNK, not TKN-OS and not a single engine. It is the platform in which persistent worlds, social spaces, simulations, games and authored experiences can exist and interoperate under governed HNK contracts.

Core product verbs:

**VIVER → CRIAR → JOGAR → SOCIALIZAR → MANIFESTAR**

## 2. Product genealogy

The reevaluated product synthesizes functions previously explored through HNK projects and the following design references:

- The Sims — life simulation, characters, homes, relationships and routines.
- Habbo — avatars, social spaces, rooms, communities and social economy.
- BYOND — persistent user-created worlds, integrated world authoring and programmable experiences.
- RPG Maker — accessible maps, events, NPCs, quests and game authoring.
- Metatron Engine — earlier HNK direction for spatial/sensory/interactive manifestation.
- CODEX/Typogenesis/GIP ancestry — structured entities, knowledge, processes and intelligent orchestration.

These are functional references, not a mandate to clone their content, UX, code or identity.

## 3. Ecosystem boundary

- **CODEX-HNK** — central HNK registry, canon and Bible-Grimoire.
- **HNK-KODE** — HNK idiom + full-stack language; transversal sibling project.
- **Mandala-HNK** — structural/computational foundation used extensively by HNK-KODE.
- **HNK-VERSE** — metaverse platform and runtime consumer.
- **TKN-OS** — Tehkné institutional memory, archaeology, compendium library, lineage and know-how.

HNK-KODE does not belong inside HNK-VERSE. HNK-VERSE is one major consumer of HNK-KODE.

## 4. Platform layers

### Identity & Avatar
Persistent identity, profiles, avatars, permissions, presence and cross-world continuity.

### Social
Friends, groups, communities, chat/presence, shared spaces, guilds/factions where a Verse enables them.

### World Model
Objects, rooms, lots, areas, cities, regions, worlds and Verses with stable identity and relationships.

### Simulation
Time, state, entities, relationships, needs/behaviors, environment and world rules as opt-in capabilities.

### Creation
World/room/map/entity/event authoring, templates, assets and eventually HNK-KODE-powered creation.

### Game & Experience Runtime
Quests, events, NPCs, combat, inventory, progression and other systems are composable capabilities rather than mandatory universal mechanics.

### Chronicle
Causal/runtime history, events, evidence, provenance and branches/timelines where supported.

### Cognition
Observation, knowledge and agent context without collapsing reality, observation and projection.

### HNK-Math
Identity/addressing/signature/relationship infrastructure. Specific mathematical semantics remain governed by their appropriate HNK authority.

### Economy
Platform and Verse economies must remain separable. No single economy is assumed universal in PDD 2.0.

### Verse SDK
Contracts for building and integrating new worlds, games and experiences without collapsing their identities.

## 5. Creation scales

Spatial creation:

`OBJECT → ROOM → HOUSE/AREA → LOT → CITY → REGION → WORLD → VERSE`

Social creation:

`CHARACTER → RELATIONSHIP → GROUP → GUILD → FACTION → COMMUNITY → CIVILIZATION`

Experience creation:

`EVENT → QUEST → SYSTEM → GAME MODE → GAME/EXPERIENCE → VERSE`

These are compositional scales, not requirements that every Verse implement every level.

## 6. Verse and experience model

A Verse owns its identity, rules and world state within platform contracts.

Shared platform contract does not imply shared canonical identity:

`SHARED CONTRACT != SHARED IDENTITY`

Initial major experiences/world directions include:

- **HNK-ALCHEMY** — experimental/alchemical/knowledge-oriented experience domain.
- **ALAKAZAM / Strangeverse** — 3D RPG/TPS experience with its existing narrative and gameplay lineage.
- **HNK-CRÔNICAS** — narrative/textbook/animated RPG direction drawing from earlier HNK game-system work.

These products are not synonymous with HNK-VERSE itself.

## 7. Runtime authority model

Core flow:

`IDENTITY → VERSE → KODAN/EXPERIENCE CONTEXT → INTENT → RESOLUTION → WORLD EVENT → OBSERVATION → EVIDENCE → CHRONICLE`

Fundamental distinctions:

`REALITY != OBSERVATION != KNOWLEDGE != PROJECTION`

`RUNTIME EVENT != HNK CANON`

`EXPERIENCE != EVIDENCE != CANON`

HNK-VERSE consumes governed contracts; it does not silently promote runtime events into CODEX-HNK canon.

## 8. HNK-KODE relationship

HNK-KODE is the HNK idiom and full-stack language. It may eventually author:

- worlds;
- entities;
- gameplay;
- UI;
- backend services;
- data;
- APIs/network behavior;
- AI/agents;
- automation;
- build/deploy behavior.

HNK-VERSE must expose stable platform/runtime contracts that HNK-KODE can target, but HNK-VERSE must not own the language specification.

## 9. Player/creator roles

The platform should support progressively richer participation modes:

- Player — plays an experience.
- Citizen — inhabits/socializes in persistent spaces.
- Creator — creates rooms, objects, events and experiences.
- Game Master — configures/runs bounded experiences.
- World Builder — authors larger world structures.
- Developer — uses SDK/HNK-KODE and lower-level contracts.

Roles are capability sets, not spiritual or canonical authority levels.

## 10. Product loop

The platform loop is:

`DISCOVER → ENTER → LIVE/PLAY → SOCIALIZE → CREATE → PUBLISH → EXPERIENCE → EVOLVE`

A user should be able to remain only a player; creation is an opportunity, not an obligation.

## 11. Creator loop

`INTENTION → TEMPLATE/BLANK WORLD → AUTHOR → VALIDATE → TEST → PUBLISH → OBSERVE → ITERATE`

Future HNK-KODE integration adds a programmable path without making code mandatory for basic creation.

## 12. Architecture direction

```text
HNK-VERSE PLATFORM
│
├── Identity / Avatar
├── Social / Presence
├── World Model
├── Simulation
├── Creation Tools
├── Experience Runtime
├── Chronicle
├── Cognition
├── HNK-Math integration
├── Economy interfaces
├── Asset interfaces
└── Verse SDK
        │
        ├── HNK-ALCHEMY
        ├── ALAKAZAM
        ├── HNK-CRÔNICAS
        └── FUTURE VERSES / EXPERIENCES
```

External/transversal authorities:

```text
CODEX-HNK ── governed contracts ──→ HNK-VERSE
HNK-KODE  ── authored programs ───→ HNK-VERSE
TKN-OS    ← provenance/know-how ─── HNK ecosystem work
```

## 13. Platform versus game systems

Universal platform candidates:
- identity;
- permissions;
- stable world/entity references;
- lifecycle;
- events;
- provenance;
- persistence interfaces;
- presence;
- publishing/versioning;
- capability negotiation.

Verse-specific candidates:
- combat;
- magic;
- class systems;
- specific economy;
- crafting;
- quests;
- character needs;
- camera/control scheme;
- graphical style;
- narrative canon.

A mechanic becomes universal only when there is evidence it belongs in the platform contract rather than one product.

## 14. MVP redefinition

The MVP is no longer “finish one giant metaverse.”

The first platform proof should demonstrate:

1. One persistent identity.
2. One hub/spatial entry point.
3. At least two distinct experiences/Verse contexts.
4. Travel/transition without identity loss.
5. A small social/presence capability.
6. One creator action that persists.
7. A world event recorded in Chronicle.
8. Clear separation of Verse state from platform state.
9. A stable SDK contract used by both experiences.
10. No dependency on HNK-KODE being complete.

This proves HNK-VERSE is a platform rather than a single game.

## 15. Suggested first vertical slice

**HNK-VERSE ZERO**

A minimal social hub containing:
- avatar/identity;
- personal room/space;
- shared room;
- object placement/editing;
- presence of another user/bot simulation;
- portals to two tiny experience slices;
- persistent state;
- Chronicle event history;
- Verse capability inspection.

The two experience slices can be deliberately tiny. Their purpose is to prove federation and platform contracts, not content volume.

## 16. Development sequence

### Phase A — Platform contracts
Identity, world/entity identity, Verse capability model, state boundaries, events, persistence, Chronicle.

### Phase B — ZERO vertical slice
Hub + room + avatar + object placement + two experience portals.

### Phase C — Creator foundation
Room/world editor, templates, publish/version lifecycle and asset references.

### Phase D — Social foundation
Presence, friends/groups and permissions appropriate to the product scope.

### Phase E — Verse SDK
Documented contracts, examples and compatibility tests.

### Phase F — Major experiences
Integrate HNK-ALCHEMY, ALAKAZAM and HNK-CRÔNICAS progressively rather than rewriting them into one monolith.

### Phase G — HNK-KODE integration
Consume stable HNK-KODE outputs once the language has its own validated compiler/runtime contract.

## 17. Product principles

1. **Platform first, content progressively.**
2. **Each Verse remains itself.**
3. **Creation must be accessible before it becomes infinitely programmable.**
4. **Code is optional for players and basic creators.**
5. **Persistent identity does not imply universal shared gameplay state.**
6. **Canon, runtime and evidence remain distinct.**
7. **Every universal abstraction must earn its universality.**
8. **Historical systems are mined for patterns, not blindly merged.**
9. **HNK-KODE and HNK-VERSE evolve independently through explicit contracts.**
10. **The first success criterion is a living platform loop, not maximum feature count.**

## 18. North-star statement

> **HNK-VERSE is the HNK metaverse platform: a persistent environment for living, socializing, creating, publishing and playing interconnected worlds and experiences.**

Product shorthand:

**VIVER · CRIAR · JOGAR · SOCIALIZAR · MANIFESTAR**

## 19. Next design artifacts

PDD/GDD 2.0 establishes the product boundary. Before major new runtime implementation, derive:

1. HNK-VERSE World Model v2.
2. Platform State vs Verse State contract.
3. Identity/Avatar/Presence model.
4. Verse Capability Manifest.
5. Chronicle/Event model.
6. Creator/Publishing lifecycle.
7. HNK-VERSE ZERO vertical-slice specification.
8. Verse SDK v0.1 contract.

The HNK-KODE language specification proceeds as a sibling project and is not embedded into this PDD.