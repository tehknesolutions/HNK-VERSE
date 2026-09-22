# DISCOVERY 005 — LIFE MODEL

**Status:** REVISED PROPOSAL — awaiting Creator lock  
**Date:** 2026-09-22  
**Depends on:** DISCOVERY 002–004 + LEGACY CONVERGENCE AUDIT V1

## 1. Design question

What does it mean to **live** inside HNK-VERSE?

The Life Model defines embodiment, time, routine, home, needs, work, relationships, memory, autonomy, perception, consequences, Agents, creatures and persistent personal history.

Its purpose is not to turn HNK-VERSE into a needs-management simulator. Its purpose is to make the Verse feel inhabited, causally coherent, persistent and consequential.

## 2. Core principle

> **LIFE IS NOT A TIMER BAR. LIFE IS A NETWORK OF STATES, ROUTINES, RELATIONSHIPS, PERCEPTIONS, MEMORIES AND CONSEQUENCES.**

Reference inheritance is now split into two layers:

- external inspirations: The Sims, Stardew Valley, Habbo, Westworld and related Discovery references;
- internal Tehkné/HNK legacy: AFTERWORLD, Crônicas da Obra Viva, Athanor and Nova Aurora.

## 3. Life truth model

The audited legacy requires a stronger separation than the first proposal.

`WORLD_EVENT → WORLD_STATE`

is not the same as:

`PERCEPTION → MEMORY → TESTIMONY → CLAIM → INTERPRETATION`

Therefore:

`WORLD TRUTH ≠ AVATAR/PERSONA KNOWLEDGE`

and:

`EVENT ≠ PERCEPTION ≠ MEMORY ≠ TESTIMONY ≠ CLAIM ≠ EVIDENCE ≠ INTERPRETATION ≠ CANON`

This extends the existing Lucidity invariant.

The renderer and narrative UI are projections of state; neither becomes authoritative merely by displaying something.

## 4. Embodiment model

`HNK_IDENTITY → PERSONAL_VERSE → AVATAR → BODY_STATE + MIND_STATE + SOCIAL_STATE + PRACTICE_STATE + KNOWLEDGE_STATE + WORLD_CONTEXT`

These are runtime categories, not automatic assertions about the real-world human.

### BODY_STATE
Energy, rest, nourishment, comfort, movement, exposure and local conditions.

### MIND_STATE
Focus, current load, curiosity, confidence, attention and active goals.

### SOCIAL_STATE
Familiarity, trust, respect, affection/affinity, fear, suspicion, obligation, reputation, role and shared history.

### PRACTICE_STATE
Current practices, reflections, symbolic correspondences, Codex-linked activity and HNK-Idioma usage.

### KNOWLEDGE_STATE
What this embodied Persona/avatar has perceived, learned, hypothesized, supported, contradicted or not yet discovered.

### WORLD_CONTEXT
The WORLD_RULESET and LOCAL_PHENOMENON_RULESET currently affecting the avatar.

## 5. Needs model

AFTERWORLD already proves needs/schedules technically, but HNK-VERSE changes the product philosophy.

Needs are **soft simulation pressures**, not constant punishment.

Candidate needs:

- rest;
- nourishment;
- safety/shelter;
- comfort;
- social connection;
- focus;
- purpose/meaningful activity.

Needs may influence action quality, efficiency, dialogue, routine and availability. Ordinary play should rarely hard-lock because a bar emptied.

World Creators may redefine, disable or replace need families through local rules.

## 6. Time and consequence

Each world owns:

`WORLD_TIME = CALENDAR + DAY_CYCLE + SEASONS + LOCAL_EVENTS + TIME_SCALE`

Real-world timestamps remain separate provenance.

Important actions may also create delayed consequences:

`ACTION → EVENT → SCHEDULED CONSEQUENCE → FUTURE EVENT → STATE CHANGE`

This is adopted from Crônicas da Obra Viva's consequence model.

Real-world synchronization is optional for ordinary play.

## 7. Daily life loop

`WAKE / ARRIVE → ORIENT → CHOOSE → LEARN / WORK / EXPLORE / CREATE / SOCIALIZE / PRACTICE → OBSERVE CONSEQUENCES → RETURN → RECORD / REFLECT → REST`

A player is free to specialize by repeated choices rather than by mandatory class selection.

## 8. Home as first life anchor

HOME is:

- return/spawn point;
- shelter;
- storage;
- identity expression;
- social space;
- creation surface;
- practice space;
- memory container;
- research/knowledge surface;
- progression anchor.

The home should visibly change through action, learning, creation and relationship history.

## 9. Functional object interaction

`AVAILABLE_ACTIONS = OBJECT_PROPERTIES + AVATAR_CAPABILITY + PERCEPTION + KNOWLEDGE + WORLD_RULES + CONTEXT`

Objects may support use, storage, reading, research, crafting, processing, practice, communication, repair, upgrade, automation, trade, gifting and canonically defined symbolic/metaphysical operations.

This extends the original object model with Crônicas-style perception/knowledge requirements.

## 10. Relationship model

A relationship is not one friendship number.

Canonical candidate vector:

`RELATIONSHIP = FAMILIARITY + TRUST + RESPECT + AFFECTION/AFFINITY + FEAR + SUSPICION + OBLIGATION + ROLE + HISTORY + CURRENT_STATE`

Crônicas proves that relationship state can control what an Agent is willing to disclose.

AFTERWORLD proves that social memory and reputation can propagate imperfectly through communities.

Therefore relationship change must preserve **causal history**, not only final scores.

## 11. Testimony and social knowledge

Agents may:

- know something;
- believe something;
- remember something;
- refuse to disclose something;
- repeat something learned elsewhere;
- be mistaken;
- fabricate;
- provide contaminated/non-independent testimony.

Agent speech is therefore never automatically world truth.

Multiple Agents repeating the same source do not automatically create independent corroboration.

## 12. Relationship targets

The foundational model may support:

- human ↔ human;
- avatar ↔ Agent;
- Agent ↔ Agent;
- avatar ↔ creature;
- Agent ↔ creature;
- organization ↔ individual;
- community ↔ individual.

UI and permitted actions vary by target type.

## 13. Household and group life

A HOME may become a shared household containing avatars, invited humans, persistent Agents, creatures, rooms, schedules, shared inventory, responsibilities, permissions and production.

Household membership never implies equal ownership or canonical authority.

## 14. Autonomy

### Player avatars
Direct control by default.

Optional automation/routines may execute explicitly delegated low-risk actions.

The game must not fabricate consequential player decisions while absent.

### Agents
May act autonomously according to identity, goals, capabilities, needs, memory, relationships, permissions, knowledge and world rules.

### Creatures
May possess routines, needs, habitat preferences, bonds, learned behaviors and work/companion roles according to species/world rules.

## 15. Offline simulation

Permitted offline progression may include:

- time;
- allowed production;
- crops/ecology;
- scheduled consequences;
- Agent routines;
- bounded markets;
- low-risk logistics.

It must not silently:

- make high-stakes human decisions;
- spend protected resources outside delegated policy;
- erase protected creations;
- convert interpretation into evidence;
- modify HNK canon.

## 16. Work and professions

`ACTIVITY → SKILL → EVIDENCED EXPERIENCE → MASTERY CLUSTER → PROFESSION`

Professions emerge through demonstrated practice.

Examples include builder, farmer, gatherer, alchemist, researcher, engineer, merchant, linguist, explorer, educator, artist, architect, Agent designer, creature handler and governor.

Combat is one possible specialization.

## 17. Economy of life

Nova Aurora provides validated design DNA for household-to-city economy.

Life-scale flow:

`TIME + KNOWLEDGE + LABOR + RESOURCE + TOOL → PRODUCT / SERVICE → USE / TRADE / GIFT / INVEST`

The Life Model only owns household/person-level participation. Civilization-level market/governance remains a later bounded context.

## 18. Personal history and Chronicle

Life events must be preserved as causal history.

Examples include meeting someone, learning, building, receiving/giving, joining, founding, traveling, bonding, conflict, reconciliation, practice, profession change and portal crossing.

Significant records feed:

`PERSONAL_HISTORY + RELATIONSHIP_HISTORY + WORLD_HISTORY`

HNK-VERSE should additionally maintain a Chronicle-like derived history over the authoritative event ledger.

The Chronicle is a projection/record; it does not replace the event ledger.

## 19. Memory

Four categories must remain distinguishable:

### Runtime history
What the world ledger verifies occurred.

### Human-authored record
What the human intentionally writes or preserves.

### Persona/avatar memory
What an embodied game identity has retained or inferred.

### Agent memory
What a specific Agent retains according to its architecture.

Memory may be partial, mistaken, influenced or contaminated.

## 20. Perception

Not every entity/state must be automatically visible to every avatar.

Perception may depend on:

- physical presence;
- illumination;
- capability;
- knowledge;
- instruments;
- local phenomena;
- learned language;
- context.

This enables investigation and discovery without hidden omniscient UI.

## 21. Institutions

Institutions connect life, knowledge, professions and relationships:

- schools/academies;
- libraries;
- workshops;
- laboratories;
- markets;
- farms;
- guilds;
- Taijifu dojos;
- ritual/practice spaces;
- governance buildings;
- creature centers;
- transit/portal hubs.

Institutions may own Agents, schedules, rules, inventories, knowledge surfaces and services.

## 22. Mortality and continuity

Mortality is local WORLD_RULESET.

Possible worlds may use no death, incapacitation, respawn, permadeath, reincarnation, body replacement or other local continuity models.

`AVATAR_DEATH ≠ HNK_IDENTITY_DELETION`

Personal Verse continuity exists above local avatar mortality.

## 23. Family and generations

Architecturally supported but outside ZERO/initial release.

Future implementation must distinguish biological, legal/social, household, chosen/found-family and created-being relations.

## 24. Lifestyle freedom

> **The Verse recognizes how you choose to live without forcing one correct lifestyle.**

Scholar, builder, explorer, social player, artisan, farmer, merchant, martial practitioner or creator must all have meaningful progression surfaces.

## 25. ZERO life proof — revised

ZERO proves only:

1. one avatar exists in one HOME;
2. world time advances;
3. one soft life state changes;
4. one object exposes an interaction through capability/context;
5. one observation becomes Persona knowledge;
6. one action produces an authoritative domain event;
7. one delayed or immediate consequence changes world state;
8. one Agent interaction creates relationship history;
9. Agent testimony remains distinct from world truth;
10. one resource/work action changes persistent state;
11. one created object can be placed at HOME;
12. one reflection/record can be stored;
13. logout/login preserves life, event and relationship state;
14. narrative/perception never silently promote interpretation to evidence/canon.

## 26. Revised candidate lock decisions

1. Life is state + routine + relationship + perception + memory + consequence.
2. World truth and Persona knowledge are independent layers.
3. Needs are soft pressures rather than constant punishment.
4. Every world owns local time; real-world time remains separate provenance.
5. HOME is the first mechanically functional life anchor.
6. Object interactions are property-, capability-, perception- and context-aware.
7. Relationships are multidimensional and backed by causal history.
8. Agent knowledge, belief, memory and testimony are distinct from runtime truth.
9. Direct control and bounded autonomy coexist.
10. Offline simulation is permitted only inside explicit delegated bounds.
11. Professions emerge from evidenced practice rather than fixed class choice.
12. Combat is optional specialization.
13. Significant actions enter an event ledger and may create delayed consequences.
14. A Chronicle/history projection may be derived from events without replacing world truth.
15. Avatar mortality is local and cannot erase HNK Identity/Personal Verse by implication.
16. Family/generational systems remain future-compatible but outside ZERO.
17. Different lifestyles remain viable progression paths.
18. The existing Lucidity invariant is extended by explicit EVENT/PERCEPTION/MEMORY/TESTIMONY/CLAIM/EVIDENCE separation.
