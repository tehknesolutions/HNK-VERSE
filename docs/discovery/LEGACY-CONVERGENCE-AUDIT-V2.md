# HNK-VERSE — LEGACY CONVERGENCE AUDIT V2

**Status:** DISCOVERY INPUT  
**Date:** 2026-09-22  
**Supersedes:** LEGACY CONVERGENCE AUDIT V1 only as the latest donor map; V1 remains valid historical evidence.

## 1. New repositories added in V2

This revision adds:

- `Tehkne-Solutions/taijifu-masters-assets`
- `Tehkne-Solutions/tehkne-studio`
- `tehknesolutions/alakazam-strangeverse`

It also rechecks `Tehkne-Solutions/hnk-rpg-game` and confirms no later canonical frontier beyond AF-001DS was found during this audit.

---

## 2. Updated donor map

### A. HNK: AFTERWORLD — `Tehkne-Solutions/hnk-rpg-game`

**Role remains:** WORLD / LIFE / ECOLOGY / SIMULATION / CREATURES / CIVILIZATION FOUNDATION.

Latest observed canonical frontier remains:

`AF-001DS — HNK Phenomena, Anomalies & Mutable World Rules Runtime`

No audit finding changes the V1 absorption decision.

**Decision:** ABSORB DEEPLY through ported domain contracts and deterministic pure logic.

---

### B. HENUVOKODAN — Crônicas da Obra Viva — `Tehkne-Solutions/hnk-cronicas-obra-viva`

**Role remains:** EPISTEMICS / PERCEPTION / NARRATIVE / CHRONICLE / INVESTIGATION / ALCHEMY.

**Decision:** ABSORB DEEPLY.

---

### C. Athanor — Alquimia Interior — `Tehkne-Solutions/athanor-alquimia-interior`

**Role remains:** PRACTICE / SYMBOLISM / PROVENANCE / REFLECTION / TRANSFORMATION.

**Decision:** ABSORB design/domain patterns.

---

### D. Taijifu Platform — `Tehkne-Solutions/taijifu-platform`

**Role remains:** OFFICIAL TAIJIFU CANON AUTHORITY.

**Decision:** CONNECT THROUGH VERSIONED `TAIJIFU_BRIDGE`.

---

### E. Taijifu Masters — `Tehkne-Solutions/taijifu-masters`

**Role remains:** COMBAT / MARTIAL MASTERY / MENTORS / TRAINING TELEMETRY.

**Decision:** ABSORB gameplay/mastery models, not the Godot runtime wholesale.

---

### F. Taijifu Masters Assets — `Tehkne-Solutions/taijifu-masters-assets`

**Primary donor role:** ASSET VAULT / CHARACTER PIPELINE / STAGE PACKS / VISUAL PROMOTION GOVERNANCE.

This repository is materially different from Tehkné Assets Forge.

**Assets Forge** is the validation/tooling engine.

**Taijifu Masters Assets** is an example of a project-specific governed Asset Vault.

The repository already implements:

- cataloged pack identity;
- versioned release tags;
- manifests;
- SHA-256 authority;
- runtime-map contracts;
- frame-sequence animation contracts;
- pivot/footline tolerances;
- stage collision and lighting manifests;
- visual review gates;
- engine/runtime smoke gates;
- rollback requirements;
- explicit promotion status;
- separation between authored source, candidate, approved art and runtime activation.

Example promotion principle:

`RELEASED BINARY ≠ APPROVED RUNTIME ASSET`

The documented flow requires validation, checksum, technical budget and visual approval before game import.

Character runtime mapping already distinguishes animation content from gameplay state:

`GAMEPLAY STATE → RUNTIME ANIMATION MAP → ASSET FRAMES`

rather than coupling game logic to raw filenames.

Stage packs separately define:

- visual layers;
- collision;
- lighting;
- safe gameplay zone;
- rendering rules;
- visual direction;
- promotion evidence.

**HNK-VERSE inheritance:**

Create a general HNK-VERSE Asset Vault contract in which:

`ASSET SOURCE → CANDIDATE → INTEGRITY → TECHNICAL BUDGET → VISUAL REVIEW → RUNTIME MAP → SMOKE → PROMOTION`

**Decision:** ABSORB GOVERNANCE MODEL. Reuse Tehkné Assets Forge as shared validation tooling.

Do not force the Taijifu-specific sprite schema onto all HNK-VERSE assets.

---

### G. Nova Aurora — `Tehkne-Solutions/nova-aurora`

**Role remains:** ECONOMY / CITY / CIVILIZATION / SOCIAL / UGC / BACKEND INTEGRITY.

**Decision:** ABSORB bounded contexts progressively.

---

### H. HNK: World of Dungeons — `Tehkne-Solutions/hnk-world-of-dungeons`

**Role remains:** ADVENTURE / DUNGEONS / EXPEDITIONS / GUARDIANS.

**Decision:** ABSORB gameplay loop and content patterns, not BYOND implementation.

---

### I. Tehkné Assets Forge — `Tehkne-Solutions/tehkne-assets-forge`

**Role remains:** GENERIC ASSET INTAKE / VALIDATION / CHECKSUM / BUDGET TOOLING.

**Decision:** REUSE AS EXTERNAL TOOLING FIRST.

---

### J. Tehkné Studio — `Tehkne-Solutions/tehkne-studio`

**Primary donor role:** CREATOR MODE / ENTITY-COMPONENT AUTHORING / GRAPH RELATIONSHIPS / SPATIAL ASSEMBLY / COMMAND BUS / AI-ASSISTED CREATION / PERSISTED PROJECTS.

This is a major new donor.

Tehkné Studio already models a product/invention as:

`ENTITIES + RELATIONSHIPS + PROPERTIES + PORTS + CAPABILITIES + BEHAVIORS + SPATIAL STATE + EVENT HISTORY`

Core reusable concepts:

#### Entity model

An entity exposes:

- stable identity;
- type;
- state;
- properties;
- ports;
- capabilities;
- metadata;
- optional parent relationship.

Properties preserve provenance/source categories such as:

- user;
- manufacturer;
- measured;
- calculated;
- simulated;
- estimated;
- studio.

This is useful for HNK-VERSE because object properties may also need provenance and confidence.

#### Graph model

The Engineering Graph separates objects from relationships.

Current relationship families include:

- contains;
- mountedTo;
- connectedTo;
- poweredBy;
- controlledBy;
- dependsOn;
- moves;
- reads;
- attachedTo.

HNK-VERSE should generalize this principle rather than copy these exact engineering types.

Candidate HNK-VERSE principle:

`WORLD OBJECTS ARE ENTITIES; STRUCTURE AND SYSTEMS EMERGE FROM VERSIONED RELATIONSHIPS`

#### Ports and compatibility

Components define typed ports and compatibility tokens.

This is directly useful for HNK-VERSE modular creation:

- electrical connection;
- mechanical attachment;
- logical/data links;
- magical/metaphysical sockets later if canonically defined;
- irrigation/resource interfaces;
- building-module attachment points;
- automation/control links.

A universal Creator System can therefore ask:

`CAN A CONNECT TO B?`

from data rather than hard-coded recipes.

#### Component Library

Tehkné Studio already provides a signed component catalog, versioned definitions, capabilities, ports, tags and compatibility queries.

HNK-VERSE should inherit the pattern for:

- building modules;
- machines;
- furniture;
- tools;
- ritual/symbolic objects;
- infrastructure;
- automation components;
- creature facilities;
- portal technology;
- player-created packages.

#### Spatial authoring

The Invention Spatial Runtime proves:

- canonical entity bindings;
- explicit position/rotation/scale;
- atomic transform validation;
- graph-backed connection segments;
- a spatial document separate from core identity and relationships.

This aligns strongly with the locked D004 rule:

`RENDERER STATE ≠ WORLD TRUTH`

The HNK-VERSE equivalent should preserve:

`WORLD ENTITY/RELATIONSHIP TRUTH + SPATIAL BINDING → RENDERER PROJECTION`

#### Command Bus

All execution sources can converge on one command path:

`UI / VOICE / AUTOMATION / SIMULATION / SYSTEM → COMMAND BUS → DOMAIN HANDLER`

This is highly relevant to HNK-VERSE Agents and Creator AI.

Agents should not mutate WORLD_STATE through privileged ad-hoc access.

They should issue authorized domain commands through the same validated command surface as humans/automation.

#### AI-assisted creation

Tehkné Studio's intelligence runtime resolves natural-language intent against:

- entities;
- capabilities;
- selected context;
- compatible targets;
- ambiguity.

It fails as unresolved/ambiguous instead of inventing missing authority.

This is a strong prototype for future HNK-VERSE Creator AI.

#### Persistence and audit

Studio snapshots preserve:

- project;
- graph;
- behaviors;
- history;
- events;
- extensions;
- version/signature.

Restore does not pretend to replay simulations to reconstruct truth.

**HNK-VERSE inheritance:**

A future Creator Mode should converge toward:

`AUTHOR INTENT → COMMAND → VALIDATION → ENTITY/RELATIONSHIP CHANGE → EVENT → PERSISTED WORLD STATE`

**Decision:** ABSORB DEEPLY AS CREATOR ARCHITECTURE DNA. Do not import engineering-specific semantics as universal world semantics.

---

### K. Alakazam And The Strangeverse — `tehknesolutions/alakazam-strangeverse`

**Primary donor role observed in current repository state:** 3D CHARACTER PIPELINE / RUNTIME ANIMATION MAPPING / PBR RENDER VALIDATION / VISUAL CANON TARGET / ASSET PROVENANCE / FAILSAFE FALLBACKS.

The current branch is small compared with the wider Alakazam concept and is heavily focused on the Tecnomage character/runtime pipeline.

Important technical inheritance:

- exact GLB runtime candidate identification;
- SHA-256 and geometry metrics;
- skeleton/joint counts;
- embedded animation subsets;
- explicit gameplay-state → animation-clip mapping;
- short animation cross-fades;
- one-shot versus looping states;
- legacy asset fallback;
- procedural fallback when binary art fails;
- material-class-specific PBR tuning;
- approved visual target documents;
- browser/runtime promotion gates;
- canonical target vs real runtime comparison;
- prohibition on approving isolated beauty renders;
- front/profile/back/TPS/in-motion evidence;
- asset provenance and license/source lineage.

Current character runtime maps:

`IDLE / WALK / RUN / SPRINT / DODGE / PULSE / ATTACK_LIGHT / ATTACK_HEAVY`

to exact embedded clip names.

The visual canon process separates:

`CANON VISUAL TARGET`

from:

`CURRENT RUNTIME CANDIDATE`

and refuses promotion without equivalent runtime evidence.

This is highly valuable for HNK-VERSE avatar and creature production.

**Important boundary:**

This audit does **not** promote Alakazam, Shimokodes, Tecnomages, Strangeverse lore or other Alakazam canon into HNK-VERSE canon.

Only technical/art-production patterns are inherited automatically as Discovery input.

Any narrative/cosmological crossover requires a separate Creator decision.

**Decision:** ABSORB CHARACTER/CREATURE ART PIPELINE PATTERNS and runtime visual gates.

---

### L. Taijifu Legacy — `Tehkne-Solutions/taijifu-legacy`

**Role remains:** HISTORICAL ARCHIVE.

**Decision:** ARCHIVE / REFERENCE ONLY.

---

## 3. Updated convergence model

The repositories now divide into four donor classes.

### Product/domain donors

- AFTERWORLD
- Crônicas da Obra Viva
- Athanor
- Taijifu Platform
- Taijifu Masters
- Nova Aurora
- World of Dungeons

### Creator/runtime architecture donor

- Tehkné Studio

### Asset production/governance donors

- Tehkné Assets Forge
- Taijifu Masters Assets
- Alakazam Strangeverse character pipeline

### Historical archive

- Taijifu Legacy

---

## 4. Proposed HNK-VERSE Creator stack

The new audit suggests a Creator architecture that was not explicit enough in D004.

Candidate conceptual stack:

`CREATOR LIBRARY`
→ versioned object/module definitions

`WORLD ENTITY GRAPH`
→ objects + relationships

`SPATIAL DOCUMENT`
→ position / rotation / scale / attachment projection

`CAPABILITY + PORT MODEL`
→ what objects can do and connect to

`BEHAVIOR MODEL`
→ rules and reactions

`COMMAND BUS`
→ human / Agent / voice / automation authoring through one authority surface

`EVENT LEDGER`
→ authoritative causal history

`WORLD STATE`
→ persisted result

`RENDERER`
→ visual projection

This is compatible with the existing lock:

`THE WORLD IS PLAYABLE MATTER`

but makes the transformation substrate more explicit.

This section is a **candidate addendum**, not a retroactive modification of locked D004.

---

## 5. Asset architecture recommendation

HNK-VERSE should distinguish:

### Asset definition

Identity, version, provenance, license/source, role and compatibility.

### Binary payload

PNG/WebP/GLB/audio/etc.

### Runtime map

How game states refer to visual/audio resources.

### Visual canon target

What identity the asset is expected to preserve.

### Technical validation

Checksum, structure, dimensions, polycount, animation/skeleton requirements, budget.

### Runtime validation

Real browser/device/game capture.

### Promotion

Explicit authority that moves candidate → usable runtime asset.

Candidate flow:

`SOURCE → PROVENANCE → CANDIDATE → TECH GATE → VISUAL GATE → RUNTIME MAP → RUNTIME EVIDENCE → APPROVED ASSET`

A visually attractive render alone cannot promote an asset.

---

## 6. New invariants proposed by V2

### Creator authority path

`AI / AGENT / VOICE / UI ≠ DIRECT WORLD MUTATION`

All must pass through authorized domain commands.

### Object graph

`ENTITY IDENTITY ≠ SPATIAL PROJECTION ≠ RENDERER OBJECT`

### Asset truth

`SOURCE ART ≠ CANON VISUAL TARGET ≠ RUNTIME CANDIDATE ≠ APPROVED RUNTIME ASSET`

### Asset promotion

`FILE EXISTS ≠ FILE IS SAFE ≠ FILE IS TECHNICALLY VALID ≠ FILE IS VISUALLY APPROVED ≠ FILE IS RUNTIME-PROMOTED`

### Canon crossover

`OTHER TEHKNÉ UNIVERSE CONTENT ≠ HNK-VERSE CANON`

unless explicitly promoted by Creator authority.

---

## 7. Effect on upcoming Discovery

### D005 — LIFE MODEL

No major rewrite is required from these three new repositories. V1 revisions remain the principal legacy impact.

### D006 — RPG + MASTERY

Taijifu asset runtime maps and Alakazam animation-state mapping provide implementation evidence for separating:

`GAMEPLAY STATE → PRESENTATION STATE`

without coupling mastery/combat truth to animation files.

### Future CREATOR MODEL

Tehkné Studio becomes the principal internal reference for:

- component/object library;
- world object graph;
- modular connections;
- spatial placement;
- behavior authoring;
- CommandBus;
- AI-assisted creation;
- signed/versioned project persistence.

### Future VISUAL + UX / ASSET PRODUCTION

Taijifu Masters Assets + Alakazam Strangeverse + Assets Forge jointly define the strongest existing Tehkné pattern for:

- provenance;
- visual identity;
- runtime mapping;
- deterministic validation;
- fail-closed promotion;
- actual runtime comparison.

---

## 8. Still unresolved

AFTERWORLD continues to reference:

`Tehkne-Solutions/hnk-rpg-game-assets`

The repository remains unavailable under that exact name in the connected GitHub installation.

`taijifu-masters-assets` is a separate Taijifu asset repository and does not resolve the AFTERWORLD asset lineage.

