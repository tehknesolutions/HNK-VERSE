# DISCOVERY 008 — AGENTS + CREATURES MODEL LOCK

**Status:** LOCKED  
**Date:** 2026-09-22  
**Authority:** Creator-approved HNK-VERSE product canon  
**Depends on:** DISCOVERY 002–007 + LEGACY CONVERGENCE AUDIT V2

## 1. Design question

What makes an HNK-VERSE Agent a persistent individual rather than a disposable chatbot/NPC, and how do creatures become living participants in the world rather than combat collectibles?

This model defines:

- Agent identity;
- memory;
- perception;
- beliefs and knowledge;
- goals;
- relationships;
- autonomy;
- professions;
- homes/property;
- learning;
- continuity;
- lifecycle;
- cognition/runtime providers;
- offline behavior;
- simulation level-of-detail;
- creature identity;
- ecology;
- bonds;
- training;
- work;
- social behavior;
- generations;
- inter-world continuity.

## 2. Core principle

> **AN AGENT IS A PERSISTENT WORLD INDIVIDUAL. AN AI MODEL IS NOT THE AGENT; IT IS ONLY A COGNITIVE RUNTIME USED BY THAT INDIVIDUAL.**

Therefore:

AGENT IDENTITY ≠ MODEL PROVIDER

AGENT IDENTITY ≠ CURRENT PROMPT

AGENT MEMORY ≠ CHAT HISTORY ONLY

AGENT BELIEF ≠ WORLD TRUTH

AGENT SPEECH ≠ HNK CANON

AGENT INTENTION ≠ AUTHORIZED WORLD MUTATION

## 3. Persistent Agent minimum

The minimum persistent Agent contract remains:

STABLE_ID
+ MEMORY
+ HISTORY
+ RELATIONSHIPS
+ GOALS
+ WORLD_STATE
+ CONTINUITY

D008 expands it to:

AGENT =
IDENTITY
+ EMBODIMENT
+ PERCEPTION
+ KNOWLEDGE
+ BELIEFS
+ MEMORY
+ GOALS
+ RELATIONSHIPS
+ SKILLS
+ PROFESSION/ROLE
+ INVENTORY
+ HOME/LOCATION
+ PERMISSIONS
+ HISTORY
+ COGNITIVE_RUNTIME
+ CONTINUITY

Not every field must be complex in ZERO, but the architecture must preserve the separation.

## 4. Agent identity

An Agent has a stable world identity independent from:

- current avatar/visual model;
- current LLM/model version;
- current prompt;
- current session;
- current device;
- current conversation thread.

Identity may include:

- stable Agent ID;
- name;
- origin/provenance;
- creation/birth event;
- world/Verse of origin;
- current embodiment;
- roles;
- affiliations;
- authored traits;
- historical milestones.

Changing the cognitive model must not silently create a new Agent.

## 5. Agent cognition stack

Candidate cognition loop:

PERCEIVE
→ RETRIEVE RELEVANT MEMORY
→ UPDATE LOCAL BELIEFS/KNOWLEDGE
→ EVALUATE GOALS
→ FORM INTENT
→ PROPOSE ACTION
→ AUTHORIZATION
→ DOMAIN COMMAND
→ WORLD EVENT
→ OBSERVE RESULT
→ MEMORY / RELATIONSHIP UPDATE

The Agent does not directly mutate WORLD_STATE.

## 6. Command authority

All consequential Agent actions pass through:

AGENT INTENT
→ DOMAIN COMMAND
→ IDENTITY / PERMISSION CHECK
→ WORLD_RULESET
→ CAPABILITY / RESOURCE CHECK
→ EXECUTION
→ EVENT LEDGER
→ WORLD STATE

Therefore:

AI OUTPUT ≠ EXECUTED ACTION

This follows the Tehkné Studio CommandBus principle and the existing HNK-VERSE governance invariants.

## 7. Cognitive runtime abstraction

The Agent domain must not hard-code one AI provider/model.

Candidate abstraction:

AGENT
→ COGNITIVE PROFILE
→ MODEL/ENGINE ADAPTER
→ CONTEXT BUILDER
→ STRUCTURED INTENT
→ DOMAIN COMMAND

A cognitive runtime may be:

- deterministic rules;
- behavior tree/state machine;
- small local model;
- large language model;
- multimodal model;
- hybrid orchestration.

Different Agent types may use different engines.

The persistent Agent identity remains above all of them.

## 8. Memory architecture

Agent memory should be typed.

### Episodic memory
Specific experienced events.

### Semantic memory
Generalized knowledge the Agent believes/knows.

### Social memory
People, relationships, promises, debts, conflicts, cooperation.

### Spatial memory
Places, routes, homes, resources and locations.

### Procedural memory
Practiced skills, routines and learned actions.

### Institutional memory
Roles, rules, guild/organization knowledge.

### Narrative/self memory
How the Agent represents its own history and identity.

Memory may be partial, fallible, outdated or contradicted.

Runtime truth remains in authoritative world/event state.

## 9. Memory provenance

Memories should be able to distinguish:

- directly observed;
- told by another Agent/human;
- read from a document;
- inferred;
- generated from repeated experience;
- institutionally taught;
- imported from canonical knowledge access.

This enables Crônicas-style source independence.

A memory's origin matters.

## 10. Belief and knowledge

Agents may hold:

- correct knowledge;
- incomplete knowledge;
- hypothesis;
- unsupported belief;
- false belief;
- contradiction;
- uncertainty.

Candidate relationship:

WORLD TRUTH
→ PERCEPTION
→ MEMORY
→ CLAIM/BELIEF
→ ACTION

Agents are not omniscient unless a specific world role explicitly grants unusual access.

## 11. Agent perception

Agent perception depends on:

- location;
- line/context of access;
- sensory capability;
- language;
- knowledge;
- tools;
- social access;
- local phenomena;
- world rules.

An Agent should not know that a player opened a hidden chest across the world unless information reaches it through a valid channel.

## 12. Goals

Goals create persistence beyond reactive dialogue.

Goal types may include:

- survival;
- profession;
- relationship;
- household;
- research;
- exploration;
- economic;
- institutional;
- civic;
- creative;
- training;
- spiritual/symbolic according to HNK/world canon;
- protection;
- curiosity.

Goals may conflict.

Agents should be able to prioritize rather than execute all goals simultaneously.

## 13. Personality and behavioral traits

Personality may influence:

- risk tolerance;
- sociability;
- curiosity;
- patience;
- generosity;
- ambition;
- discipline;
- caution;
- openness;
- conflict response.

Traits should shape choice, not override world rules or create arbitrary immunity.

A personality descriptor is not an authority claim about real psychology.

## 14. Relationships

Agents use the locked D005/D007 multidimensional relationship model.

RELATIONSHIP =
FAMILIARITY
+ TRUST
+ RESPECT
+ AFFECTION/AFFINITY
+ FEAR
+ SUSPICION
+ OBLIGATION
+ ROLE
+ HISTORY
+ CURRENT_STATE

Relationship history may affect:

- dialogue;
- disclosure;
- cooperation;
- teaching;
- trade;
- invitations;
- contracts;
- forgiveness;
- conflict;
- loyalty.

## 15. Agent-to-Agent society

Agents may form relationships with each other without the human player being present.

Possible outcomes:

- friendship;
- rivalry;
- mentorship;
- employment;
- trade;
- household;
- group membership;
- shared project;
- rumor transmission;
- conflict;
- reconciliation.

This is essential for a world that feels alive rather than player-centric.

## 16. Profession and mastery

Agents use the same D006 principle:

ACTIVITY → PRACTICE → EVIDENCE → SKILL → MASTERY CLUSTER → PROFESSION

Agents do not receive hidden mastery merely because a language model can describe a skill.

Their world capability state must be grounded in domain rules/evidence.

## 17. Agent economy

Agents may:

- work;
- produce;
- consume;
- trade;
- own/use property;
- accept/refuse contracts;
- join institutions;
- pay/receive wages;
- save;
- invest;
- move roles.

All economic actions use authoritative transactions.

## 18. Agent home and embodiment

A persistent Agent should normally have a place in the world.

Possible state:

- home/residence;
- current location;
- workplace;
- institution;
- inventory;
- owned/shared property;
- current schedule;
- embodiment/avatar.

This makes Agent continuity spatial and social, not only conversational.

## 19. Agent schedules

Agents may have routines:

- sleep/rest;
- work;
- study;
- training;
- travel;
- social activity;
- maintenance;
- exploration;
- institution duty.

Schedules are intentions/policies, not guaranteed outcomes.

World events may interrupt them.

## 20. Offline autonomy

Agents may continue bounded activity while a human is offline.

Allowed examples:

- routine work;
- scheduled movement;
- crop/production tasks;
- low-risk trade;
- study/practice;
- relationship interactions;
- institution duties.

Disallowed by default:

- irreversible decisions on behalf of the human;
- destructive use of protected human property;
- high-risk contractual commitments using human-owned resources;
- canon modification;
- evidence fabrication.

## 21. Simulation level-of-detail

A persistent world cannot run every Agent at full cognitive fidelity continuously.

HNK-VERSE should support simulation tiers.

Candidate:

### ACTIVE
Full perception/cognition/behavior near a player or important event.

### NEAR
Reduced-frequency decision simulation.

### BACKGROUND
Schedule/economy/social aggregate simulation using deterministic rules.

### DORMANT
No active simulation; state advances only through bounded scheduled consequences.

Promotion/demotion between tiers must preserve identity and continuity.

Low-fidelity simulation must not fabricate impossible high-fidelity events.

## 22. Agent lifecycle

Possible lifecycle events:

- creation/birth;
- arrival;
- education;
- profession;
- relationships;
- migration;
- injury;
- aging where world rules permit;
- death;
- reincarnation/body change where world rules permit;
- retirement;
- archival continuity.

Local mortality rules apply.

AGENT BODY DEATH ≠ NECESSARILY AGENT IDENTITY DELETION

but continuity after death exists only where world rules/HNK canon explicitly define it.

## 23. Generated Agents and provenance

Generated Agents require provenance.

Candidate fields:

- generator/version;
- creation context;
- world seed/input;
- canonical template references;
- authored modifications;
- owner/creator where applicable;
- creation timestamp/event.

Generated personality/dialogue never becomes HNK canon automatically.

## 24. Agent continuity across model upgrades

When the AI backend changes:

- stable ID remains;
- memories remain;
- history remains;
- relationships remain;
- skills remain;
- world permissions remain;
- current goals may be re-evaluated;
- cognitive behavior may improve/change, but the system must avoid presenting the backend swap as a metaphysical identity event unless intentionally authored.

This is central to long-lived Personal Verses.

## 25. Agent privacy boundaries

Agents may only access information authorized by:

- world visibility;
- relationship disclosure;
- institution role;
- explicit user permission;
- platform/plugin permission where relevant.

An Agent must not receive private human/account data merely because it exists outside the game.

## 26. Agent narrative agency

Agents may generate diegetic history through valid actions.

They may:

- found groups;
- make discoveries;
- teach;
- trade;
- build;
- fight;
- form relationships;
- create local stories.

But:

AGENT-GENERATED HISTORY ≠ HNK CANON

It is Verse/world history unless explicitly canon-promoted.

## 27. Scripted NPC vs persistent Agent

HNK-VERSE may still use simpler NPCs.

Candidate tiers:

### STATIC NPC
Authored interaction, no meaningful persistence.

### SIMULATED NPC
Persistent state/schedule but limited cognition.

### PERSISTENT AGENT
Stable identity, memory, goals, relationships, capability and continuity.

### CANON CHARACTER
Any of the above plus explicit canonical authority/reference where approved.

Not every shopkeeper needs a full LLM.

## 28. Creature principle

> **A CREATURE IS A LIVING SYSTEM PARTICIPANT, NOT ONLY A COMBAT UNIT OR INVENTORY ITEM.**

Creature systems may include:

- species;
- individual identity;
- needs;
- habitat;
- ecology;
- behavior;
- social structure;
- learning;
- bond;
- work capability;
- communication;
- training;
- health;
- reproduction/generation where world rules permit.

## 29. Species vs individual creature

Separate:

SPECIES DEFINITION
≠
CREATURE INDIVIDUAL

Species may define:

- morphology;
- habitat;
- diet;
- abilities;
- behavior tendencies;
- lifecycle;
- reproduction;
- social structure;
- ecological role.

Individual creatures may differ by:

- history;
- bond;
- learned behaviors;
- condition;
- traits;
- skills;
- relationships;
- provenance.

## 30. Creature ecology

Creatures exist inside ecosystems.

They may:

- migrate;
- feed;
- compete;
- cooperate;
- reproduce;
- affect resources;
- alter vegetation;
- respond to climate;
- respond to HNK phenomena/world anomalies;
- form groups/territories.

AFTERWORLD provides strong internal precedent.

## 31. Creature bond

Bond is relational, not ownership alone.

Candidate dimensions:

- familiarity;
- trust;
- attachment;
- fear;
- respect;
- training history;
- cooperation.

A creature may cooperate without being owned.

Ownership/guardianship depends on world rules.

## 32. Creature training

Training should follow mastery principles.

OBSERVE / INTERACT
→ BUILD TRUST
→ TEACH / CONDITION
→ PRACTICE
→ REPEAT
→ APPLY IN CONTEXT
→ ADAPT

A creature should not learn an advanced behavior merely because the player spent abstract points.

## 33. Creature work

Palworld informs the design question, but HNK-VERSE should use its own systemic ethics/rules.

Creature roles may include:

- transport;
- gathering;
- detection;
- farming;
- production;
- protection;
- exploration;
- rescue;
- companionship;
- ecological services.

Work depends on species capability, training, bond, needs and world rules.

## 34. Creature combat

Combat may exist, but creature identity must survive outside it.

A creature's value is not reducible to:

LEVEL + ATTACK + HP

Combat capability is one subset of a richer creature state.

## 35. Creature communication

Communication may range from:

- behavioral cues;
- learned signals;
- symbolic interaction;
- limited vocabulary;
- full language in specific species/worlds.

HNK-Idioma or other language bridges may matter only where canon/world rules support them.

## 36. Creature generations

Where enabled, generation systems may model:

- lineage;
- inherited traits;
- learned culture;
- social transmission;
- habitat adaptation.

AFTERWORLD's generation/culture concepts are relevant.

ZERO does not require breeding/generational simulation.

## 37. Agent vs creature boundary

The categories may overlap in some worlds.

A creature with:

- stable identity;
- memory;
- goals;
- language;
- social roles;
- advanced cognition

may function as an Agent-like actor.

The ontology should allow capability-driven overlap rather than rigidly assuming "human-shaped = Agent" and "animal-shaped = creature."

## 38. Cross-world continuity

An Agent or creature may cross worlds only when:

- portal/access rules permit;
- entity type is transferable;
- provenance is preserved;
- destination WORLD_RULESET can represent the entity;
- restricted inventory/resources are handled.

A destination world may translate, constrain or reject capabilities.

## 39. Inter-Verse Agents

Future Personal Verse intersections may permit:

- invited Agent visits;
- shared institutions;
- trade representatives;
- expedition companions;
- migration;
- temporary projections.

An Agent should not be duplicated into divergent identities accidentally.

If branching/copying is intentional, provenance must record the fork.

## 40. Agent creation by players

Future Creator tools may allow users to author Agents.

Candidate authored elements:

- identity seed;
- appearance;
- role;
- initial knowledge boundaries;
- goals;
- personality tendencies;
- capabilities;
- home;
- institution;
- permissions.

Player creation does not grant canonical status.

## 41. HNK metaphysical boundary

Within HNK-VERSE cosmology, Agents and events may participate in symbolic/metaphysical correspondences defined by HNK canon.

However the software must not claim that a language model has verified consciousness, soul or supernatural personhood.

"Agent personhood" in system design means persistent individual identity and agency inside the Verse.

The existing Lucidity invariant remains mandatory.

## 42. Pantheon / Westworld design inheritance

Pantheon contributes the question of continuity of identity across digital embodiment.

Westworld contributes:

- persistent memory;
- repeated experience;
- character history;
- emergent behavior;
- Agent-to-Agent narrative.

HNK-VERSE adopts these as design questions and system patterns, not as copied lore.

## 43. Pokémon / Palworld design inheritance

Pokémon contributes:

- discovery;
- species ecology;
- individual bond;
- training;
- collection/study.

Palworld contributes:

- creatures participating in work/base systems;
- automation;
- world interaction.

HNK-VERSE must avoid reducing its creature model to either battle collection or labor automation alone.

## 44. ZERO Agent + Creature proof

ZERO requires only one persistent Agent.

Agent proof:

1. stable Agent ID;
2. one home/location;
3. one goal;
4. one relationship vector with player;
5. one episodic memory;
6. one belief/knowledge item distinct from world truth;
7. one permitted autonomous action;
8. action passes through normal domain command;
9. result enters event ledger;
10. Agent remembers/reacts later;
11. logout/login preserves identity/history;
12. changing presentation/model adapter does not change Agent identity.

Creature architecture may be represented by schema/fixture only in ZERO unless a creature is necessary to prove another vertical-slice goal.

If one creature is included, prove only:

1. species definition;
2. individual ID;
3. one need/behavior;
4. one bond value/history;
5. one non-combat world interaction;
6. persistence.

## 45. Locked decisions

1. A persistent Agent is a world individual; the AI model/runtime is not the Agent identity.
2. Stable identity, memory, history, relationships, goals, world state and continuity are minimum Agent requirements.
3. Agent cognition follows perception → memory/knowledge → goals → intent → authorized command → event → result.
4. Agents never mutate WORLD_STATE directly through privileged AI output.
5. Cognitive runtimes are replaceable adapters beneath persistent Agent identity.
6. Agent memory is typed and provenance-aware.
7. Agents may hold incomplete or false beliefs; Agent belief/speech is not world truth or HNK canon.
8. Agent perception is bounded by world access, capability, language, tools and context.
9. Agents have goals and may act autonomously within explicit permissions.
10. Agent-to-Agent relationships and social history continue without requiring the player to be present.
11. Agents progress through the same evidence-backed mastery principles as other actors.
12. Persistent Agents normally occupy spatial/social roles such as home, workplace, inventory and institution.
13. Offline Agent autonomy is bounded and cannot make high-stakes human decisions by default.
14. Simulation level-of-detail is required for scalable persistent populations.
15. Backend/model upgrades preserve Agent identity, history, memory and relationships.
16. Generated Agents require provenance; generated content is not canon automatically.
17. Simpler NPC tiers remain valid; not every NPC requires full AI cognition.
18. Creatures are ecological/social participants, not only combat units.
19. Species definitions and creature individuals are separate layers.
20. Creature bond/training/work use relationship, capability and practice rather than abstract ownership/XP alone.
21. Creature systems support non-combat roles and ecology.
22. Agent/creature boundaries may overlap according to capability rather than morphology.
23. Cross-world Agent/creature transfer requires provenance and destination-rule compatibility.
24. "Agent personhood" is a game-system concept of persistent identity/agency, not a software claim of consciousness or soul.
