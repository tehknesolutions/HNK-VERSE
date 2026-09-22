# DISCOVERY 005 — LIFE MODEL

**Status:** PROPOSAL — awaiting Creator lock  
**Date:** 2026-09-22  
**Depends on:** DISCOVERY 002–004

## 1. Design question

What does it mean to **live** inside HNK-VERSE?

The Life Model defines the relationship between avatar embodiment, time, daily routine, home, needs, work, relationships, autonomy, Agents, creatures and life events.

Its purpose is not to turn HNK-VERSE into a needs-management simulator. Its purpose is to make the Verse feel inhabited, persistent and consequential.

## 2. Core principle

> **LIFE IS NOT A TIMER BAR. LIFE IS A NETWORK OF STATES, ROUTINES, RELATIONSHIPS AND CONSEQUENCES.**

The Sims informs simulation readability, Stardew informs rhythm and home, Habbo informs social inhabitation, Westworld informs persistent character continuity, and HNK provides the deeper experiential/metaphysical structure.

## 3. Embodiment model

A playable avatar is an embodied presence inside a specific world.

`HNK_IDENTITY → PERSONAL_VERSE → AVATAR → BODY_STATE + MIND_STATE + SOCIAL_STATE + PRACTICE_STATE + WORLD_CONTEXT`

These are runtime state categories, not claims about the real-world body, psychology or spirituality of the human user.

### BODY_STATE

May include:

- energy;
- rest;
- nourishment;
- comfort;
- movement;
- environmental exposure;
- temporary conditions defined by the local WORLD_RULESET.

### MIND_STATE

May include:

- focus;
- stress/load;
- curiosity;
- confidence;
- attention;
- learned knowledge;
- active goals.

### SOCIAL_STATE

May include:

- familiarity;
- trust;
- affinity;
- obligations;
- group membership;
- shared history;
- reputation.

### PRACTICE_STATE

May include:

- current practices;
- rituals/quests completed;
- reflections;
- symbolic correspondences;
- HNK-language usage;
- progression records.

### WORLD_CONTEXT

Defines which local laws currently affect the avatar.

## 4. Needs model

HNK-VERSE should avoid constantly punishing the player with rapidly draining bars.

Needs should operate as **soft simulation pressures** and contextual states.

Candidate needs:

- rest;
- nourishment;
- safety/shelter;
- comfort;
- social connection;
- focus/mental bandwidth;
- purpose/meaningful activity.

Needs may influence efficiency, available actions, animation, dialogue and routine, but should rarely hard-lock the player.

Different worlds may define different needs or disable some entirely.

## 5. Life rhythm

The Verse needs time because time creates routine, anticipation and history.

Each world defines:

`WORLD_TIME = CALENDAR + DAY_CYCLE + SEASONS + LOCAL_EVENTS + TIME_SCALE`

The Personal Verse additionally records provenance in real-world timestamps.

World time and real-world time must remain distinguishable.

### Proposed default

HNK-official worlds should use an accelerated day cycle suitable for gameplay while preserving optional links to real-world date/time for specific practices, events or seasonal content.

Real-world synchronization must never be required for ordinary play.

## 6. Daily loop

A healthy baseline daily loop is:

`WAKE → ORIENT → CHOOSE → LEARN / WORK / EXPLORE / CREATE / SOCIALIZE → RETURN → REFLECT → REST`

The player is not required to perform all branches each day.

The goal is agency plus rhythm.

A player may spend an entire day:

- building;
- studying;
- farming;
- exploring;
- trading;
- socializing;
- crafting;
- training;
- governing;
- caring for creatures;
- doing nothing productive.

The system should allow lifestyle identity to emerge from repeated choices.

## 7. Home as life anchor

HOME is the first persistent center of life.

A home is simultaneously:

- spawn/return point;
- shelter;
- storage;
- identity expression;
- social space;
- creation surface;
- practice space;
- memory container;
- progression anchor.

The home should visibly evolve as the user learns, creates and forms relationships.

Objects inside the home may carry both gameplay function and symbolic/metaphysical correspondence.

## 8. Object interaction

Life simulation depends on objects doing things.

Objects should expose actions according to:

`OBJECT_PROPERTIES + AVATAR_CAPABILITY + WORLD_RULES + CONTEXT`

An object may support:

- use;
- sit/rest;
- store;
- inspect;
- read;
- craft;
- cook/process;
- research;
- practice;
- communicate;
- decorate;
- repair;
- upgrade;
- automate;
- trade;
- gift;
- activate symbolic/metaphysical interactions when canonically defined.

The interaction system should be data-driven rather than hard-coded object by object.

## 9. Relationship model

Relationships must not collapse to a single "friendship points" number.

Proposed relationship vector:

`RELATIONSHIP = FAMILIARITY + TRUST + AFFINITY + HISTORY + OBLIGATION + ROLE + CURRENT_STATE`

Examples:

Two characters may have high familiarity but low trust.

Two may disagree often but hold strong mutual respect.

An Agent may remember a promise even after affinity changes.

A creature may have high bond but no human-style dialogue.

Relationship state must preserve significant events that caused change.

## 10. Relationship targets

The same foundational model can support:

- human ↔ human;
- human ↔ Agent;
- avatar ↔ Agent;
- avatar ↔ creature;
- Agent ↔ Agent;
- Agent ↔ creature;
- organization ↔ individual;
- community ↔ individual.

The UI and available mechanics differ by relationship type.

## 11. Household and group life

A HOME may eventually become a shared household.

A household may include:

- multiple avatars;
- invited humans;
- persistent Agents;
- creatures;
- shared inventories;
- permissions;
- responsibilities;
- schedules;
- rooms;
- production.

Household membership must not imply equal ownership or canonical authority.

## 12. Autonomy

HNK-VERSE should combine direct control with configurable autonomy.

### Player avatars

Default to direct player control.

Optional routines/automation may allow the player to schedule or delegate repetitive actions.

The game must never fabricate consequential player choices while the player is absent.

### Agents

Persistent Agents may act autonomously within goals, permissions, memory and WORLD_RULESET constraints.

### Creatures

Creatures may exhibit needs, routines, habitat preferences, work capability and relationships depending on species/world rules.

## 13. Offline simulation

The world may continue to progress while the user is offline, but only within explicit bounded rules.

Offline simulation may:

- advance clocks;
- complete permitted production;
- run Agent routines;
- change markets within limits;
- progress crops/ecology;
- record scheduled events.

Offline simulation must not:

- make irreversible high-stakes choices for the human;
- spend protected resources without authorization;
- reinterpret user experience as evidence;
- alter HNK canon;
- destroy protected creations without explicit world rules and safeguards.

## 14. Work and professions

A profession is learned through practice and knowledge, not selected as a permanent class at character creation.

`ACTIVITY → SKILL → MASTERY CLUSTER → PROFESSION`

Examples may include:

- builder;
- farmer;
- gatherer;
- alchemist;
- researcher;
- engineer;
- merchant;
- linguist;
- explorer;
- educator;
- healer/support role within game fiction;
- artist;
- architect;
- Agent designer;
- creature handler;
- governor.

Combat proficiency is one possible specialization, not the default measure of value.

## 15. Economy of life

The Life Model needs household-scale economics before civilization-scale economics.

Candidate flow:

`TIME + KNOWLEDGE + LABOR + RESOURCE → PRODUCT / SERVICE → USE / TRADE / GIFT / INVEST`

Economic systems should recognize:

- production;
- consumption;
- maintenance;
- scarcity;
- value;
- trade;
- services;
- ownership;
- commons;
- taxation/policy at higher scales.

## 16. Life events

Life becomes history through events.

Examples:

- meeting someone;
- learning a skill;
- receiving a gift;
- building a room;
- discovering a place;
- joining a group;
- adopting/bonding with a creature;
- completing a practice;
- founding an organization;
- conflict/reconciliation;
- changing profession;
- moving home;
- crossing a portal.

Significant events become part of:

`PERSONAL_HISTORY + RELATIONSHIP_HISTORY + WORLD_HISTORY`

## 17. Event correspondence

A life event may simultaneously produce:

- runtime state change;
- narrative meaning;
- symbolic meaning;
- HNK metaphysical correspondence;
- experience record;
- interpretation;
- evidence record.

The Lucidity invariant remains mandatory.

## 18. Mortality, defeat and continuity

Mortality is a local WORLD_RULESET decision.

Some worlds may support:

- no death;
- incapacitation;
- respawn;
- permadeath;
- reincarnation;
- body replacement;
- avatar loss with HNK Identity continuity.

The HNK Identity and Personal Verse exist above any one avatar's local mortality rules.

Therefore:

`AVATAR_DEATH ≠ HNK_IDENTITY_DELETION`

unless an exceptional platform-level account action explicitly occurs.

## 19. Memory

Memory is central to life simulation.

Three memories must remain distinguishable:

### Human record
What the human explicitly records or consents to preserve.

### Runtime history
Verified events that occurred in the Verse.

### Agent memory
What a specific Agent stores/remembers according to its architecture.

Agent memory may be incomplete, mistaken or interpretive.

It is not equivalent to runtime truth.

## 20. Social spaces

Social design should support both intimate and public scales:

`HOME → SHARED_ROOM → GUILD / INSTITUTION → VILLAGE → CITY → INTER-VERSE SPACE`

Habbo-style legibility and personalization can inform shared spaces, while the deeper world model preserves function and persistence.

## 21. Institutions

Life becomes richer when knowledge and professions have places.

Candidate institutions:

- schools;
- academies;
- workshops;
- guilds;
- libraries;
- laboratories;
- markets;
- farms;
- temples/ritual spaces;
- governance buildings;
- creature centers;
- portals/transit hubs.

Institutions combine structures, Agents, professions, quests and social identity.

## 22. Family and generations

Family/generational simulation is architecturally allowed but is **not required for ZERO or the first release**.

If implemented later, the system must distinguish:

- biological relation;
- legal/social relation;
- household relation;
- chosen/found family;
- Agent/created-being relation.

No single relationship model should force every world to reproduce real-world human family structures.

## 23. Life and player freedom

The player should not be punished for choosing a non-optimal life.

A central design value is:

> **The Verse recognizes how you choose to live without forcing one correct lifestyle.**

A builder, explorer, scholar, farmer, merchant, creator or social player should each have meaningful progression paths.

## 24. ZERO life proof

ZERO must prove only:

1. one avatar wakes/appears in one home;
2. world time advances;
3. one soft life state changes over time;
4. one object supports a functional interaction;
5. one learning/activity choice can be performed;
6. one resource/work action changes state;
7. one Agent interaction creates persistent relationship history;
8. one home object can be created/placed;
9. one reflection/record can be stored;
10. rest/end-of-day advances the cycle;
11. logout/login preserves life and relationship state;
12. no metaphysical interpretation auto-promotes itself to evidence/canon.

## 25. Candidate lock decisions

1. Life is modeled as state + routine + relationship + consequence, not needs bars alone.
2. Needs are soft pressures rather than constant punishment.
3. Every world owns its local time model; real-world time remains separately recorded.
4. HOME is the first life anchor and must be mechanically functional.
5. Object interactions are data-driven and capability-aware.
6. Relationships are multidimensional and history-backed.
7. Direct control and bounded autonomy coexist.
8. Offline simulation is permitted only within explicit safe/authorized bounds.
9. Professions emerge from practiced mastery rather than fixed character classes.
10. Combat is optional specialization, not the universal measure of progression.
11. Avatar mortality is governed locally and does not erase HNK Identity/Personal Verse continuity.
12. Significant life events feed persistent personal, relationship and world history.
13. Family/generational simulation remains future-compatible but outside ZERO.
14. Different lifestyles must remain viable forms of progression.
