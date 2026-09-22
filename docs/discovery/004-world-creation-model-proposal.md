# DISCOVERY 004 — WORLD + CREATION MODEL

**Status:** PROPOSAL — awaiting Creator lock  
**Date:** 2026-09-22  
**Depends on:** DISCOVERY 002 and 003

## 1. Design question

What is a world in HNK-VERSE, what may be changed inside it, how does creation scale from one object to an entire Verse, and how do physical, symbolic and metaphysical layers remain coherent?

## 2. Proposed world hierarchy

`PERSONAL_VERSE → WORLD → REGION → CITY → VILLAGE → LAND → STRUCTURE → MODULE → OBJECT → MATERIAL`

This hierarchy is compositional, not merely navigational.

A higher layer is built from and influenced by lower layers, while still being able to define rules for them.

## 3. World as persistent state

A world is not only a map.

A world is:

`SPACE + RULES + ENTITIES + RESOURCES + HISTORY + CULTURE + ECONOMY + ECOLOGY + KNOWLEDGE + SYMBOLIC/METAPHYSICAL CORRESPONDENCE + PROVENANCE`

Rendering is only one representation of that state.

## 4. Creation principle

HNK-VERSE adopts the principle:

> **The world is playable matter.**

Anything represented as editable WORLD_STATE should be potentially transformable through some valid combination of:

`PERMISSION + KNOWLEDGE + SKILL + RESOURCE + TOOL + PROCESS + TIME`

Exceptions include immutable platform infrastructure, security boundaries, protected canon and deliberately fixed world laws.

## 5. Creation ladder

Creation should scale progressively:

1. **PLACE** — move/place an existing object.
2. **DECORATE** — customize surfaces, arrangement and appearance.
3. **ASSEMBLE** — combine components.
4. **CRAFT** — produce functional objects.
5. **BUILD** — create structures.
6. **ENGINEER** — connect systems and automation.
7. **DESIGN** — author reusable blueprints/templates.
8. **PLAN** — organize settlements and infrastructure.
9. **GOVERN** — define local policies and systems.
10. **WORLD-BUILD** — define geography, ecosystems and world rules.
11. **VERSE-BUILD** — connect worlds and higher-order rule systems.

## 6. Knowledge-driven crafting

Crafting must not reduce to arbitrary recipe memorization.

Preferred causality:

`OBSERVE → APPRAISE → LEARN PROPERTY → DISCOVER PROCESS → GATHER → PROCESS → COMBINE → CREATE → TEST → RECORD`

Knowledge may come from:

- CODEX-HNK;
- HNK-Idioma;
- experimentation;
- mentors;
- Agents;
- institutions;
- exploration;
- world history;
- professions;
- discoveries.

The system should support both known recipes and discovery of new recipes/processes.

## 7. Materials and properties

Materials should have properties, not only item IDs.

Candidate property families:

- physical;
- structural;
- thermal;
- biological;
- energetic;
- technological;
- symbolic;
- linguistic;
- metaphysical;
- economic;
- ecological.

Not every world exposes every property family.

## 8. Structures as systems

A structure is not merely decorative geometry.

Structures may expose functions such as:

- shelter;
- storage;
- production;
- research;
- education;
- commerce;
- social gathering;
- worship/ritual;
- transport;
- defense;
- governance;
- Agent residence;
- creature habitat;
- automation.

This allows a HOME to evolve into a workshop, laboratory, school, guild, market, temple, farm, factory, portal hub or other functional space.

## 9. Settlement simulation

The proposed external scale is:

`HOME → LAND → VILLAGE → CITY → REGION → NATION → WORLD → WORLDS → VERSE`

Each scale unlocks a new simulation concern:

- **HOME** — life, objects, relationships.
- **LAND** — resources, production, ecology.
- **VILLAGE** — community, roles, shared facilities.
- **CITY** — services, infrastructure, economy, zoning/organization.
- **REGION** — logistics, ecology, routes and resource networks.
- **NATION** — governance, policy, culture, large-scale technology/economy.
- **WORLD** — planetary/global rules and systems.
- **WORLDS** — portals, inter-world trade, travel and divergence.
- **VERSE** — higher-order world relationships and rule orchestration.

## 10. World laws

Each world has a versioned `WORLD_RULESET`.

Candidate rule domains:

- time scale;
- day/night;
- gravity/movement;
- building permissions;
- destructibility;
- resource regeneration;
- death/respawn;
- combat/PvP;
- magic;
- technology;
- economy;
- Agent autonomy;
- creature ecology;
- language constraints;
- climate;
- portals;
- progression;
- access control.

World laws may differ radically between worlds, but changes require provenance and authority.

## 11. HNK deep structure

World rules are local.

HNK meta-architecture remains deeper than local world rules.

A creator may author a world with a completely different surface culture, magic system or technology model while the Verse still preserves:

- HNK Identity;
- Personal Verse continuity;
- canonical authority boundaries;
- Lucidity invariants;
- provenance;
- HNK deep meta-architecture.

## 12. Metaphysical correspondence

A created object/event may have multiple simultaneous representations:

`PHYSICAL_STATE`
`SYMBOLIC_STATE`
`METAPHYSICAL_CORRESPONDENCE`
`INTERPRETATION_STATE`
`EVIDENCE_STATE`

These must not be collapsed.

Example:

A player places a symbolic object in a room.

- The **physical** fact is placement and persistence.
- The **symbolic** layer describes its defined HNK meaning.
- The **metaphysical** layer records its canonical HNK correspondence.
- The **interpretation** layer records what user/Agent thinks it means in context.
- The **evidence** layer records what can actually be demonstrated.

## 13. Player-created worlds

A World Creator should eventually be able to define:

- terrain;
- biomes;
- structures;
- resource systems;
- creatures;
- Agents;
- institutions;
- technologies;
- magic systems;
- quests;
- economy;
- laws;
- progression;
- language surfaces;
- portals;
- access permissions.

Generated content is not automatically HNK canon.

## 14. Creator tooling

The long-term Creator experience should support at least three levels:

### In-world creation
Build while playing.

### Visual authoring
Edit terrain, structures, rules and systems with creator tools.

### Advanced authoring
Use schemas, scripting, AI-assisted generation and reusable packages.

The same canonical world state should survive all three interfaces.

## 15. Destruction and reversibility

World modification must include intentional destruction, rollback and provenance.

Candidate invariant:

`CREATE / MODIFY / DESTROY → EVENT LOG → VERSIONED STATE → RECOVERABLE HISTORY`

Important player-authored structures should support permissions and recovery to prevent griefing or accidental irreversible loss.

## 16. ZERO creation proof

ZERO should prove only:

1. one land exists;
2. one home exists;
3. one resource can be gathered;
4. the resource has at least one meaningful property;
5. one knowledge item explains or unlocks a process;
6. one creation recipe/process exists;
7. one object can be created;
8. the object can be placed in the world;
9. placement changes persistent WORLD_STATE;
10. logout/login preserves the modification;
11. telemetry preserves provenance;
12. the created object has at least one gameplay function beyond decoration.

## 17. Candidate lock decisions

1. Treat the world as persistent, compositional, editable state rather than a static map.
2. Keep 2D/2.5D isometric rendering independent from a deeper editable world model.
3. Make knowledge, skill, resources and permission prerequisites for meaningful transformation.
4. Support progressive creation from object placement to Verse creation.
5. Give structures systemic functions, not decoration only.
6. Make settlement/civilization scale unlock new simulation layers.
7. Make world laws versioned and creator-configurable at sufficient authority.
8. Preserve HNK meta-architecture beneath divergent local worlds.
9. Preserve physical/symbolic/metaphysical/interpretive/evidentiary separation.
10. Require provenance and recoverability for persistent world modification.
