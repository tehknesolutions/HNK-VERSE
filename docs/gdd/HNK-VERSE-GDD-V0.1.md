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

**SELECTED SOURCE ASSET — PROPOSAL:** `VALI` / `LEX-013` — FROZEN recovered lexeme, "trabalho / trabalhar".

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

**SELECTED CONTENT CANDIDATE:** WOOD / MADEIRA.

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
10. Define deterministic ZERO fixture.
11. Define visual target/reference board.
12. Define asset status/promotional gates for ZERO.
13. Produce ZERO technical architecture and sprint plan.

## 31. Content selection state

A source-grounded first selection is now documented in `ZERO-CONTENT-SELECTION-V0.1.md`:

- Malkuth knowledge theme → **Manifestação Concreta** — SOURCE-SUPPORTED DERIVATION;
- CODEX-HNK canonical Malkuth ID → **PENDING_CANONICAL_ID**;
- HNK-Idioma → **VALI / LEX-013** — FROZEN source asset, proposed transversal ZERO binding;
- Resource → **Wood / Madeira** — CONTENT CANDIDATE;
- Functional creation → **Wooden Box / Caixa de Madeira** — CONTENT CANDIDATE;
- Skill → **Basic Practical Work / Trabalho Prático** — DERIVED GAME SYSTEM CANDIDATE;
- Agent role → **Cartographer / Witness / Investigation Companion / Builder** — CONTENT CANDIDATE;
- Agent display name → **Metatron** — CONTENT CANDIDATE awaiting Creator lock.

Still open/blocking:

- exact published CODEX-HNK Malkuth canonical ID/version;
- exact Home/Land layout;
- exact visual palette/art assets.

The GDD must preserve each item's authority state rather than flattening candidate content into canon.
