# HNK-VERSE — LEGACY CONVERGENCE AUDIT V1

**Status:** DISCOVERY INPUT  
**Date:** 2026-09-22  
**Purpose:** identify reusable product, domain, runtime, content and tooling DNA from existing Tehkné/HNK game projects before locking LIFE and RPG/MASTERY design.

## 1. Conclusion

HNK-VERSE should not be treated as a greenfield game.

The audited repositories collectively contain mature fragments of the target product:

- world simulation;
- life simulation;
- epistemic gameplay;
- metaphysical/symbolic practice;
- combat and mastery;
- dungeons/adventure;
- economy and civilization;
- user-generated world content;
- asset governance;
- martial canon authority.

HNK-VERSE is therefore a **convergence layer and new canonical runtime**, not a simple merge of repositories.

Code is only absorbed where its domain model and technical assumptions fit the HNK-VERSE architecture. Canon, gameplay progression and authority boundaries remain explicit.

---

## 2. Donor map

### A. HNK: AFTERWORLD — `Tehkne-Solutions/hnk-rpg-game`

**Primary donor role:** WORLD / LIFE / ECOLOGY / SIMULATION / CREATURES / CIVILIZATION FOUNDATION

High-value assets already present:

- renderer-independent persistent world state;
- deterministic world/event concepts;
- weather, water, soil, ecology, agriculture and livestock;
- resource gathering, crafting, construction and repair;
- storage, hauling and logistics;
- worker jobs, schedules and needs;
- health, sanitation and environment;
- communications, rumors, trust and reputation;
- factions, property, trade, contracts and debt;
- crime, justice, governance, elections and public policy;
- settlement expansion, transport, production and supply chains;
- creature behavior, communication, culture, social structures and generations;
- HNK energy ecology;
- HNK local phenomena/anomalies and mutable local rule fields.

**Critical design inheritance:**

`WORLD TRUTH ≠ RENDERER STATE`

and:

`GLOBAL WORLD_RULESET + LOCAL PHENOMENON_RULESET`

AF-001DS is especially valuable because local HNK phenomena may alter gravity, time, geometry, matter, signals and spiritual pressure without silently rewriting global world laws.

Observations preserve context/reliability and hypotheses require repeatable investigation.

**Absorption decision:** ABSORB DEEPLY, but port models and invariants into HNK-VERSE packages rather than copy the AFTERWORLD runtime wholesale.

---

### B. HENUVOKODAN — Crônicas da Obra Viva — `Tehkne-Solutions/hnk-cronicas-obra-viva`

**Primary donor role:** EPISTEMICS / PERCEPTION / NARRATIVE / CHRONICLE / INVESTIGATION / ALCHEMY

This repository contributes a fundamental distinction that HNK-VERSE should preserve:

`WORLD TRUTH ≠ PERSONA KNOWLEDGE`

It implements an explicit chain:

`INTENT → DOMAIN EVENT → EVENT LEDGER → REDUCER → STATE → PERCEPTION → NARRATIVE → SAVE`

Key reusable domain concepts:

- world timestamps;
- immutable domain events with causation/correlation;
- event ledger;
- Persona-specific capability state;
- knowledge nodes;
- claims;
- evidence;
- questions;
- claim statuses;
- evidence types;
- perception requirements;
- narrative conditioned by perception and knowledge;
- testimony separated into knows / believes / willing-to-say;
- multidimensional relationships;
- delayed consequences;
- persistent Chronicle;
- alchemy based on properties/processes rather than recipe-only crafting;
- Scriptum/document layers with requirements and provenance;
- LIBER as diary/material/question/experiment record.

Knowledge status already includes:

`REPORTED → OBSERVED → HYPOTHESIZED → SUPPORTED → REPRODUCED / CONTRADICTED / RETIRED`

The "Three Witnesses" implementation is especially valuable:

`MATTER + WORD + MEMORY`

with explicit source-independence checks.

Multiple people repeating one contaminated source do not become independent corroboration.

**Critical design inheritance:**

`WORLD_EVENT ≠ PERCEPTION ≠ MEMORY ≠ TESTIMONY ≠ CLAIM ≠ EVIDENCE ≠ KNOWLEDGE ≠ NARRATIVE`

This materially strengthens the HNK-VERSE Lucidity architecture.

**Absorption decision:** ABSORB DEEPLY. Establish dedicated HNK-VERSE epistemic and chronicle layers instead of burying these concepts inside generic telemetry or narrative UI.

---

### C. Athanor — Alquimia Interior — `Tehkne-Solutions/athanor-alquimia-interior`

**Primary donor role:** PRACTICE / SYMBOLISM / PROVENANCE / REFLECTION / TRANSFORMATION

High-value concepts:

- local-first practice state;
- domain independent from UI;
- source/provenance classes;
- symbolic layer separation;
- fact / interpretation / prediction / intention classification;
- memory exercises;
- journey loops;
- crafting as transformation;
- review and integration;
- symbolic artifact lifecycle;
- optional/consensual reflection;
- safe non-punitive pause/rest states.

Strong inherited loop:

`SOURCE → MISSION → CLASSIFICATION/PRACTICE → SYMBOLIC CHAIN → CRAFT → ACTION → RETURN → REVIEW → TRANSFORMATION`

**Absorption decision:** ABSORB design patterns and practice domain. Do not copy fixed Athanor character classes as HNK-VERSE's global identity model.

---

### D. Taijifu Platform — `Tehkne-Solutions/taijifu-platform`

**Primary donor role:** OFFICIAL TAIJIFU CANON AUTHORITY

Current canonical model includes:

- 4 Bases;
- 10 belts;
- 32 Paths;
- 128 Nuclei;
- practice;
- checkpoints;
- evidence;
- Travessia;
- authorized evaluation.

Critical invariant already implemented:

`GAME XP ≠ OFFICIAL TAIJIFU GRADUATION`

The client cannot self-promote an official belt.

**Absorption decision:** CONNECT THROUGH `TAIJIFU_BRIDGE`. HNK-VERSE may simulate, teach and gamify Taijifu but must consume official versioned Taijifu canon rather than duplicate or redefine it.

---

### E. Taijifu Masters — `Tehkne-Solutions/taijifu-masters`

**Primary donor role:** COMBAT / MARTIAL MASTERY / MENTORS / TRAINING TELEMETRY

High-value mechanics:

- direct technical combat;
- Tai/Ji/Fu tactical topology;
- weapon-specific mastery;
- defense, parry, dodge, grappling and disarm;
- modular equipment;
- element interactions;
- tactical AI without stat cheating;
- masters and executable trials;
- telemetry and heatmaps;
- recommendation system;
- Martial Observation.

Martial Observation stages:

`SEEN → RECOGNIZED → UNDERSTOOD → DEFENDED → REPRODUCED → ADAPTED → MASTERED`

This is a strong model for HNK-VERSE mastery because repeated exposure alone does not equal mastery.

**Absorption decision:** ABSORB domain patterns for D006 RPG + MASTERY. Do not port the Godot runtime wholesale into ZERO.

---

### F. Nova Aurora — `Tehkne-Solutions/nova-aurora`

**Primary donor role:** ECONOMY / CITY / CIVILIZATION / SOCIAL / UGC / BACKEND INTEGRITY

High-value systems:

- persistent player/city state;
- jobs and production;
- properties and businesses;
- NPC consumers and wages;
- marketplace;
- contracts and suppliers;
- municipal services;
- regional economy;
- policies, council and elections;
- ledger and reservations;
- realtime presence/events;
- transactional outbox;
- UGC asset placement;
- ownership and interaction scopes;
- creator/social controls;
- moderation and operational safety.

Critical technical pattern:

`DURABLE POSTGRES STATE > BEST-EFFORT REALTIME DELIVERY`

UGC already proves:

`UPLOAD → VERIFY → AUTHORIZE → PLACE → PERSIST → INTERACT`

**Absorption decision:** ABSORB bounded contexts and infrastructure patterns gradually. ZERO must not inherit Nova Aurora's full production complexity.

---

### G. HNK: World of Dungeons — `Tehkne-Solutions/hnk-world-of-dungeons`

**Primary donor role:** ADVENTURE / DUNGEONS / EXPEDITIONS / GUARDIANS

Existing loop:

`AURALIS → CONTRACT → RIFT GATE → DUNGEON → COMBAT → GATHER → RETURN → REWARD → MEMORY`

Existing concepts include:

- HP;
- Physical Energy;
- Spiritual Flux;
- Synchrony;
- elemental skill;
- Guardian;
- Rank D contract;
- inventory;
- Fissure;
- narrative memory.

**Absorption decision:** ABSORB as adventure-loop seed. BYOND implementation is historical/prototypical rather than target runtime.

Names/content remain candidate historical content unless separately Creator-locked for HNK-VERSE.

---

### H. Tehkné Assets Forge — `Tehkne-Solutions/tehkne-assets-forge`

**Primary donor role:** ASSET INGESTION / VALIDATION / PACKAGING

Current useful capabilities:

- safe ZIP intake;
- path traversal protection;
- maximum file/uncompressed-size limits;
- SHA-256;
- asset budgets;
- manifests;
- fail-closed validation;
- CLI integration.

**Absorption decision:** REUSE AS EXTERNAL TOOLING first. Do not rewrite solely for monorepo language uniformity.

---

### I. Taijifu Legacy — `Tehkne-Solutions/taijifu-legacy`

**Primary donor role:** HISTORICAL ARCHIVE

The project is an early Godot foundation and has been superseded in practical value by Taijifu Masters.

**Absorption decision:** ARCHIVE / REFERENCE ONLY.

---

## 3. Missing/Unresolved source

AFTERWORLD documentation references:

`Tehkne-Solutions/hnk-rpg-game-assets`

as the canonical binary-art repository.

At audit time, the connected GitHub account returns 404 for that repository and organization search does not return an AFTERWORLD asset repository under that name.

Therefore visual-asset lineage for AFTERWORLD remains **UNRESOLVED**, not assumed lost.

---

## 4. HNK-VERSE target convergence

The audited projects suggest the following bounded contexts:

- `domain`
- `world`
- `life`
- `simulation`
- `epistemics`
- `perception`
- `chronicle`
- `narrative`
- `practice`
- `metaphysics`
- `alchemy`
- `agents`
- `creatures`
- `relationships`
- `progression`
- `mastery`
- `combat`
- `martial`
- `adventure`
- `economy`
- `civilization`
- `creator`
- `telemetry`
- `persistence`
- `renderer`
- `ui`
- `contracts`
- `fixtures`
- `codex-bridge`
- `language-bridge`
- `taijifu-bridge`

These are architectural boundaries, not a requirement to implement all packages during ZERO.

---

## 5. New HNK-VERSE invariants derived from legacy

### World and knowledge

`WORLD TRUTH ≠ PERSONA KNOWLEDGE`

### Epistemic separation

`EVENT ≠ PERCEPTION ≠ MEMORY ≠ TESTIMONY ≠ CLAIM ≠ EVIDENCE ≠ INTERPRETATION ≠ CANON`

### Narrative

Narrative is a projection of world state through permitted perception/knowledge, not the source of world truth.

### Consequence

Important actions may schedule delayed consequences with explicit causation.

### Relationships

Relationships are vectors and histories, not single friendship scores.

### Mastery

`EXPOSURE ≠ UNDERSTANDING ≠ REPRODUCTION ≠ MASTERY`

### Canon boundaries

`HNK-VERSE GAME PROGRESSION ≠ EXTERNAL/OFFICIAL DOMAIN AUTHORITY`

including official Taijifu graduation.

### Creator content

`GENERATED / PLAYER-CREATED CONTENT ≠ HNK CANON`

unless promoted by explicit canonical authority.

---

## 6. Recommended migration posture

### Reuse directly where possible
- pure deterministic TypeScript domain logic;
- schema/contract concepts;
- validation tooling;
- test vectors and invariants.

### Port/rewrite behind HNK-VERSE contracts
- AFTERWORLD simulation modules;
- Taijifu mastery/combat domain currently coupled to Godot;
- World of Dungeons BYOND loops;
- Nova Aurora bounded contexts.

### Reference but do not inherit blindly
- legacy UI;
- engine-specific scene structures;
- fixed classes;
- punitive needs;
- monolithic operational infrastructure;
- domain-specific currencies/ranks.

---

## 7. Effect on Discovery

This audit means DISCOVERY 005 — LIFE MODEL must be revised before lock.

It must explicitly incorporate:

- soft needs and routines from AFTERWORLD;
- relationship vectors, testimony and disclosure from Crônicas da Obra Viva;
- social memory/reputation from AFTERWORLD;
- persistent jobs/production from Nova Aurora;
- reflection/practice/memory from Athanor;
- causal event-ledger history;
- Persona knowledge distinct from world truth;
- bounded autonomous Agents;
- delayed consequences.

DISCOVERY 006 — RPG + MASTERY should inherit:

- Taijifu Martial Observation;
- weapon/technique mastery;
- mentor trials;
- HNK World of Dungeons adventure loop;
- Crônicas capability/perception thresholds;
- Athanor practice/review;
- AFTERWORLD knowledge-through-experiment patterns.

