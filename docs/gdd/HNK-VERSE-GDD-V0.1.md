# HNK-VERSE — GAME DESIGN DOCUMENT V0.1

**Status:** DRAFT  
**Version:** 0.1.0  
**Date:** 2026-09-22  
**Source of authority:** DISCOVERY MASTER LOCK  
**Initial production target:** ZERO / Malkuth vertical slice

## 0. Document governance

This GDD translates locked Discovery decisions into executable game design.

It does not have authority to silently redefine:

- HNK canon;
- HNK-Idioma canon;
- official Taijifu canon;
- Discovery locks.

Every design statement should be classifiable as:

- **LOCKED SOURCE**
- **DERIVED**
- **IMPLEMENTATION DECISION**
- **CONTENT CANDIDATE**
- **OPEN QUESTION**

## 1. High concept

HNK-VERSE is a persistent life-sim RPG social creation sandbox in which the player's knowledge, language, practice, relationships and creation produce persistent change in a Personal Verse.

The first playable release proves this thesis in Malkuth.

### Player-facing promise

**Learn something. Use it. Change your world. Return later and see that the world remembers.**

## 2. Product pillars

1. **LIFE** — inhabit a persistent world.
2. **KNOWLEDGE** — perception and understanding matter.
3. **LANGUAGE** — HNK-Idioma participates in gameplay.
4. **MASTERY** — capability grows through evidenced practice.
5. **CREATION** — the world is editable matter.
6. **RELATIONSHIP** — people/Agents remember and respond.
7. **AGENCY** — choices change persistent systems.
8. **SOCIAL/ECONOMY** — ownership, exchange and institutions have history.
9. **MANIFESTATION** — knowledge and action become world change.
10. **MULTIVERSE** — the architecture can expand from one World to many.

## 3. Genre and platform

### Genre

Persistent Life-Sim RPG Social Creation Sandbox.

### Initial platform

Web/PWA first.

### Input targets

- desktop browser;
- mobile browser/PWA.

### Visual target

HD 2D / 2.5D isometric or near-isometric.

## 4. Core runtime loop

DISCOVER  
→ LEARN  
→ NAME  
→ PRACTICE  
→ GATHER  
→ CREATE  
→ PLACE / USE  
→ TRANSFORM WORLD  
→ INTERACT  
→ OBSERVE CONSEQUENCE  
→ RECORD  
→ RETURN  
→ SEE PERSISTENCE

## 5. ZERO world composition

**LOCKED SOURCE**

ZERO contains:

- one HNK Identity;
- one primary Personal Verse;
- one World Instance;
- one Malkuth starting area;
- one Land;
- one Home;
- one Avatar;
- one persistent Agent;
- one primary resource;
- one knowledge reference;
- one HNK-Idioma element;
- one Skill;
- one functional created object;
- one ownership transfer interaction;
- one Chronicle/reflection surface.

## 6. Player Avatar

### Required state

- stable ID;
- visual identity;
- world position;
- movement;
- inventory;
- one soft life state;
- knowledge state;
- skill state;
- relationship state;
- persistence.

### Initial controls — IMPLEMENTATION DECISION TO DETAIL

Desktop:
- movement;
- target/select;
- contextual action;
- inventory;
- build/place;
- zoom.

Mobile:
- movement/tap-to-select approach;
- contextual action;
- inventory sheet;
- build placement;
- zoom/pan where needed.

Exact bindings remain to be specified in the ZERO interaction spec.

## 7. Home and Land

HOME is both spatial and systemic.

Required functions:

- arrival/spawn;
- storage;
- one rest/recovery interaction;
- editable placement zone;
- location for one created functional object;
- visible evidence of player history.

Land defines the first owned/controlled creation surface.

## 8. Time and life state

ZERO uses one accelerated World Time cycle.

Required:

- current world time;
- day visual progression;
- one day transition;
- persisted timestamp/state.

Initial soft life-state candidate:

**Energy / Rest**

**CONTENT/IMPLEMENTATION CANDIDATE:** exact rates and effects remain unbalanced.

The state must create readable rhythm without survival-game punishment.

## 9. Knowledge and perception

### Truth layers

WORLD TRUTH  
≠ PERSONA KNOWLEDGE  
≠ AGENT BELIEF  
≠ INTERPRETATION

### ZERO perception gate

One object/resource reveals additional information after the Persona acquires the relevant knowledge/language capability.

The UI reveal must not mutate the underlying object merely because it became understood.

## 10. CODEX-HNK bridge

ZERO requires one canonical CODEX-HNK reference.

Required bridge fields:

- canonical reference ID;
- authority/version;
- source/provenance;
- Persona discovery state;
- related runtime capability/unlock.

**OPEN CONTENT QUESTION:** which exact approved Malkuth knowledge entry anchors ZERO?

No implementation should invent this content.

## 11. HNK-Idioma bridge

ZERO requires one approved HNK-Idioma element used functionally.

Required bridge fields:

- canonical language reference;
- authority/version;
- Persona knowledge state;
- context of use;
- runtime effect or perception relevance.

**LOCKED ZERO SOURCE ASSET:** `VALI` / `LEX-013` — FROZEN recovered lexeme, "trabalho / trabalhar".

ZERO binding is transversal and does **not** claim an L07/Malkuth curriculum binding. See `ZERO-CONTENT-SELECTION-V0.1.md`.

The game must not coin a word to fill the slot.

## 12. Resource

ZERO uses one primary gatherable resource.

Required:

- stable resource definition;
- at least one meaningful property;
- source/node;
- gather interaction;
- ownership;
- inventory representation;
- provenance event.

**LOCKED ZERO CONTENT:** WOOD / MADEIRA.

Source rationale and authority boundary are recorded in `ZERO-CONTENT-SELECTION-V0.1.md`.

## 13. Practice and Skill

ZERO includes one evidence-backed Skill.

Skill loop:

KNOWLEDGE  
→ PRACTICE ATTEMPT  
→ DOMAIN EVENT  
→ RESULT  
→ SKILL EVIDENCE  
→ SKILL STATE CHANGE

XP, if displayed, is only a summary.

Required evidence fields:

- event reference;
- context;
- result;
- quality or validity;
- independence/guidance state where relevant.

## 14. Creation

ZERO includes one functional creation.

Chain:

RESOURCE  
+ KNOWLEDGE  
+ REQUIRED ACTION / TOOL  
→ PROCESS  
→ CREATED ENTITY

Created entity requires:

- stable entity ID;
- definition/version;
- provenance;
- owner;
- spatial binding;
- gameplay capability;
- runtime visual binding.

## 15. World mutation

Build/place flow:

SELECT  
→ PREVIEW  
→ VALIDATE  
→ SHOW REQUIREMENTS  
→ COMMAND  
→ EVENT  
→ WORLD STATE  
→ RENDERER  
→ PERSIST

Placement denial must expose a reason.

## 16. Ownership and exchange

ZERO proves one small exchange.

Recommended pattern:

PLAYER offers owned resource/item  
→ AGENT evaluates  
→ accept/refuse  
→ authorized transfer  
→ ownership update  
→ relationship/history update  
→ event persistence

No currency is required in ZERO.

## 17. Persistent Agent

### Minimum Agent state

- stable Agent ID;
- name;
- location;
- one goal;
- one relationship vector;
- one knowledge/belief;
- one episodic memory;
- one autonomous permitted action;
- one interaction surface;
- persistent history.

### Cognition

The first implementation may be deterministic, hybrid or AI-assisted.

The Agent identity must not depend on the AI provider.

### Action flow

PERCEIVE  
→ MEMORY / KNOWLEDGE  
→ GOAL  
→ INTENT  
→ DOMAIN COMMAND  
→ AUTHORIZATION  
→ EVENT  
→ RESULT  
→ MEMORY UPDATE

## 18. Relationship

ZERO may expose a reduced visible subset:

- familiarity;
- trust;
- history.

The persisted domain model should remain compatible with the full locked vector.

One exchange or meaningful interaction must alter relationship history.

## 19. Chronicle

ZERO Chronicle shows at least:

- one discovery;
- one creation;
- one relationship event;
- one player-authored note/reflection.

Chronicle is derived from events plus human-authored material.

It does not replace Event Ledger truth.

## 20. Event Ledger

Required ZERO event families:

- identity/session;
- world/day;
- discovery;
- gather;
- practice attempt/result;
- skill evidence;
- creation;
- placement;
- Agent interaction;
- Agent autonomous action;
- ownership transfer;
- relationship update;
- reflection/record.

Events require:

- stable event ID;
- world time;
- real timestamp/provenance where required;
- actor;
- target;
- causation/correlation references;
- payload/version.

## 21. Persistence

Release-blocking restore contract:

RETURNING PLAYER
→ SAME IDENTITY
→ SAME PERSONAL VERSE
→ SAME WORLD
→ SAME HOME
→ SAME CREATED OBJECT
→ SAME KNOWLEDGE
→ SAME SKILL
→ SAME OWNERSHIP
→ SAME AGENT
→ SAME AGENT MEMORY/RELATIONSHIP
→ SAME CHRONICLE

## 22. UI

### World HUD

Minimal:
- context target/action;
- time;
- critical soft state;
- selected objective if any.

### Quick surfaces

- inventory/storage;
- skill/progress;
- relationship;
- current objective.

### Knowledge surface

- CODEX-linked discovery;
- HNK-Idioma context;
- Chronicle/reflection.

### Build surface

- object choice;
- ghost preview;
- validation;
- place/move/remove.

## 23. Visual hierarchy

Environment first.

HNK visual layers increase with perception/context:

AMBIENT  
→ FUNCTIONAL  
→ REVELATORY  
→ CEREMONIAL

ZERO needs Ambient + one Functional/Revelatory example.

## 24. Audio

Minimum system roles:

- interaction confirmation;
- gathering/creation feedback;
- environmental ambience;
- time change;
- Agent presence;
- one HNK-linked cue if appropriate.

Critical information must also have visual/text feedback.

## 25. Accessibility

ZERO release baseline:

- keyboard-accessible UI;
- visible focus;
- readable/scalable text;
- touch-size controls;
- reduced motion;
- no critical color-only states;
- text equivalent for critical audio cues.

## 26. Technical package map

ZERO target bounded contexts:

- domain;
- world;
- life;
- epistemics;
- perception;
- codex-bridge;
- language-bridge;
- practice/mastery;
- agents;
- relationships;
- creator/world mutation;
- telemetry/event-ledger;
- progression;
- persistence;
- renderer;
- ui;
- contracts;
- fixtures.

Deferred/schema-only candidates:

- creatures;
- combat;
- martial;
- adventure;
- civilization;
- advanced economy;
- multiverse traversal;
- advanced Creator Studio.

## 27. Deterministic golden path

A fixture-driven E2E test must be able to complete:

START  
→ LOAD VERSE  
→ DISCOVER KNOWLEDGE  
→ GATHER  
→ PRACTICE  
→ CREATE  
→ PLACE  
→ INTERACT WITH AGENT  
→ TRANSFER ITEM  
→ RECORD CHRONICLE  
→ SAVE  
→ RELOAD  
→ VERIFY PERSISTENCE

without requiring a production AI service.

## 28. Human QA gates

After deterministic pass:

- desktop visual/interaction QA;
- mobile visual/interaction QA;
- touch targeting;
- build placement;
- Agent continuity;
- readable epistemic states;
- persistence;
- reduced-motion;
- error/failure messaging.

## 29. ZERO exclusions

Not in ZERO:

- multiplayer;
- portals;
- multiple playable Worlds;
- full creatures;
- full combat;
- full Taijifu;
- dungeons;
- cities;
- nations;
- global markets;
- complex currency;
- public UGC;
- advanced Creator Studio;
- unrestricted mods;
- cinematic 3D;
- full Sephirotic implementation.

## 30. First GDD production tasks

1. Select canonical Malkuth CODEX-HNK knowledge for ZERO.
2. Select one approved HNK-Idioma element for ZERO.
3. Select the first resource and functional creation.
4. Define the first persistent Agent content profile.
5. Define the first Home/Land layout.
6. Define exact player interaction scheme desktop/mobile.
7. Define ZERO event contracts.
8. Define persistence schema.
9. Define first world/entity/placement contracts.
10. Define deterministic ZERO fixture. **LOCKED in ZERO-PERSISTENCE-SCHEMA-FIXTURE-V1.md.**
11. Define visual target/reference board.
12. Define asset status/promotional gates for ZERO.
13. Produce ZERO technical architecture and sprint plan.

## 32. ZERO Home + Land design state

`ZERO-HOME-LAND-DESIGN-V0.1.md` is now **Creator-locked** as the spatial design for the first playable environment.

It proposes one continuous 18×14 logical Land/Home scene containing:

- one-room Home with Rest and an initially empty storage placement zone;
- fixed Workbench;
- VALI discovery surface;
- Metatron/cartography area;
- finite Wood node with 4 units;
- first Wooden Box recipe using 3 Wood;
- remaining 1 Wood reserved for the first ownership-transfer/social proof;
- fixed/controlled isometric camera with bounded zoom;
- deterministic persistence matrix for reload validation.

The spatial design is LOCKED. `ZERO-INTERACTION-EVENT-CONTRACT-V0.1.md` is now **Creator-locked** as the authoritative interaction/event design for ZERO.

## 31. Content selection state

A source-grounded first selection is now **Creator-locked for ZERO** in `ZERO-CONTENT-SELECTION-V0.1.md`:

- Malkuth knowledge theme → **Manifestação Concreta** — SOURCE-SUPPORTED DERIVATION, locked for ZERO;
- CODEX-HNK canonical Malkuth ID → **PENDING_CANONICAL_ID**;
- HNK-Idioma → **VALI / LEX-013** — FROZEN source asset, locked transversal ZERO binding;
- Resource → **Wood / Madeira** — ZERO CONTENT LOCK;
- Functional creation → **Wooden Box / Caixa de Madeira** — ZERO CONTENT LOCK;
- Skill → **Basic Practical Work / Trabalho Prático** — ZERO DERIVED GAMEPLAY LOCK;
- Agent role → **Cartographer / Witness / Investigation Companion / Builder** — ZERO CONTENT LOCK;
- Agent display name → **Metatron** — ZERO CONTENT LOCK.

Still open/blocking:

- exact published CODEX-HNK Malkuth canonical ID/version;
- exact Home/Land layout — proposal opened in `ZERO-HOME-LAND-DESIGN-V0.1.md`;
- exact visual palette/art assets.

The GDD must preserve each item's authority state rather than flattening candidate content into canon.

## 33. Survival RPG mechanical reference

`REFERENCE-SURVIVAL-RPG-ADDENDUM-V0.1.md` is now an approved mechanical-reference input.

Absorbed into current ZERO design:

- Bed/Rest becomes a functional optional World verb that restores the soft Energy/Rest state and advances World Time;
- Workbench is a capability-bearing World fixture rather than a generic menu;
- recipe/process availability remains knowledge-driven;
- functional crafting is preferred over decoration-only crafting;
- mobile interaction should preserve a compact contextual-action philosophy.

Explicitly deferred until post-ZERO:

- tool chains such as axe/pickaxe/hoe/fishing;
- mining;
- farming/water loops;
- armor/weapons/combat;
- dungeons/caves;
- hidden-object/environmental puzzles;
- multiple biomes;
- boats/vehicle traversal;
- time-specific threats;
- broad recipe catalogs.

The reference does not change the locked HD 2D/2.5D isometric visual identity and does not add punitive hunger/thirst systems.


## 34. ZERO Persistence + Fixture state

`ZERO-PERSISTENCE-SCHEMA-FIXTURE-V1.md` is the active persistence proposal.

It defines:

- Event Ledger as historical authority;
- snapshots as restore acceleration;
- stable IDs for Identity, Verse, World, Home, Avatar, Metatron and entities;
- explicit pending CODEX reference semantics with `canonicalId = null`;
- transactional resource conservation;
- idempotency receipts;
- Skill Evidence persistence;
- Agent-memory and relationship-history provenance;
- separate Wooden Box identity and spatial binding;
- deterministic `HNK-ZERO-MALKUTH-FIXTURE-V1`;
- fixed initial/golden states;
- replay, reload, concurrency, idempotency and crash-after-commit tests.

Important implementation gap discovered:

the current contracts package still requires `CodexRef.canonicalId: string`. ZERO requires a truthful pending-reference union before runtime implementation; fake canonical IDs are forbidden.

The persistence schema/fixture remains PROPOSAL until Creator lock.


## 35. ZERO Technical Architecture + Contracts state

`ZERO-TECHNICAL-ARCHITECTURE-CONTRACTS-V1.md` is the active technical proposal.

Bootstrap code is now present for:

- `@hnk-verse/contracts`;
- `@hnk-verse/domain`;
- `@hnk-verse/persistence`;
- `@hnk-verse/fixtures`.

The proposal introduces:

- resolved/pending CODEX reference typing;
- ZERO command/event/rejection registries;
- deterministic stable IDs;
- pure event reduction and milestone predicates;
- persistence ports;
- deterministic Malkuth fixture and golden-state assertions.

This code is **not yet declared CI-green**. TypeScript compilation, tests, command handlers and in-memory persistence remain the next implementation gate.


## 36. ZERO Runtime verification state

`ZERO-RUNTIME-VERIFICATION-V1.md` records the first executed deterministic runtime evidence.

Current classification:

- TypeScript strict check: **LOCAL PASS**
- ZERO runtime check: **LOCAL PASS**
- Node 22 strip-types compatibility defect: **FOUND + FIXED**
- golden path / restore / replay / idempotency / concurrency / crash durability: **LOCAL PASS**
- GitHub Actions: **RUNNER INFRASTRUCTURE BLOCKED BEFORE EXECUTION** (`runner_id=0`, `steps=[]`)

Therefore:

`LOCAL_RUNTIME_GREEN != GITHUB_ACTIONS_GREEN`

No hosted-CI green claim is made yet.

## 37. ZERO Production Persistence Adapter state

`ZERO-PRODUCTION-PERSISTENCE-ADAPTER-V1.md` is the active persistence-production proposal.

Recommended first adapter:

**PostgreSQL / Supabase**

while preserving the existing vendor-neutral persistence ports.

The proposal keeps the durable core intentionally small:

- identity / Verse / World metadata;
- World stream sequence;
- append-only Event Ledger;
- command receipts;
- snapshots.

It requires atomic event+receipt append, idempotency, optimistic concurrency, RLS/ownership isolation when exposed through Supabase, and the same ZERO golden-path integration tests against real Postgres.

The production adapter design is **LOCKED**. `ZERO-PRODUCTION-PERSISTENCE-IMPLEMENTATION-V1.md` records the current implementation as `STATIC_IMPLEMENTED / REMOTE_DB_PENDING`.


## 38. ZERO Production Persistence implementation state

`ZERO-PRODUCTION-PERSISTENCE-IMPLEMENTATION-V1.md` records the first durable Postgres implementation.

Implemented:

- private declarative PostgreSQL schema under `supabase/schemas/hnk_verse_private.sql`;
- append-only Event Ledger protections;
- private browser-role boundary;
- RLS defense in depth;
- `PostgresPersistence` implementing existing persistence ports;
- atomic World-stream / idempotency / event-batch transaction logic;
- shared persistence conflict errors;
- schema security contract check.

Current verification:

- runtime core: `LOCAL_RUNTIME_GREEN`;
- Postgres implementation: `STATIC_IMPLEMENTED`;
- dedicated HNK-VERSE Supabase project: `NOT_PROVISIONED`;
- remote DB integration: `REMOTE_DB_PENDING`.

Existing Supabase projects belonging to other products are not reused automatically.


## 39. ZERO Web Playable V1 state

`ZERO-WEB-PLAYABLE-V1.md` records the first visible browser/PWA projection of the locked ZERO runtime.

Implemented:

- `@hnk-verse/renderer` deterministic 18×14 isometric projection;
- `BrowserLocalPersistence` using the existing persistence ports;
- `apps/web` Vite/TypeScript PWA shell;
- Home, Bed, Workbench, VALI, Metatron, Cartography, Wood Node and storage placement zone;
- contextual ZERO actions wired to `ZeroCommandRuntime`;
- persistent local reload through the browser adapter;
- desktop keyboard and mobile directional presentation movement;
- bounded fixed-orientation isometric zoom;
- Chronicle reflection input;
- PWA manifest/service worker.

Verification classification:

- TypeScript: `LOCAL PASS`;
- deterministic ZERO runtime: `LOCAL PASS`;
- browser-local persistence: `LOCAL PASS`;
- Vite production build: `PENDING_EXTERNAL_RUNNER`;
- visual desktop/mobile QA: `PENDING`.

Important authority boundary:

visual Avatar movement in V1 is presentation-only until `MoveAvatar` produces an authoritative persisted position/checkpoint event.


## 40. ZERO authoritative Avatar movement state

`ZERO-AUTHORITATIVE-MOVEMENT-V1.md` closes the presentation-only movement gap from the first Web playable.

Implemented:

- authoritative `avatarPosition` in `ZeroWorldState`;
- deterministic fixture spawn at logical `(4, 4)`;
- real `MoveAvatar` validation;
- `AvatarPositionCheckpointed` reducer support;
- duplicate-position checkpoint suppression;
- Web visual movement with 240 ms debounced safe-position persistence;
- restore/resync from authoritative state after runtime recreation.

Local verification:

- TypeScript: PASS;
- ZERO runtime regression: PASS;
- movement checkpoint + restore: PASS.

Collision, pathing, terrain costs and interaction-range rules remain later gameplay gates.


## 41. ZERO Chronicle + Event Inspector state

`ZERO-CHRONICLE-EVENT-INSPECTOR-V1.md` makes the Event Ledger visible through two distinct projections.

Implemented:

- `@hnk-verse/chronicle`;
- rebuildable player-facing Chronicle milestones;
- explicit `WORLD_EVENT_DERIVED` vs `HUMAN_AUTHORED_INTERPRETATION`;
- source Event refs + World timestamps;
- complete Event Inspector projection;
- Web Chronicle panel;
- escaped human reflection / payload rendering;
- deterministic Chronicle projection test.

Important epistemic rule:

`EVENT LEDGER != CHRONICLE PROSE != HUMAN INTERPRETATION != CANON`.

Movement checkpoints remain auditable in the Event Inspector but are intentionally filtered from the readable Chronicle.
