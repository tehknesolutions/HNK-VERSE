# DISCOVERY 010 — VISUAL + UX MODEL LOCK

**Status:** LOCKED  
**Date:** 2026-09-22  
**Authority:** Creator-approved HNK-VERSE product canon  
**Depends on:** DISCOVERY 002–009 + LEGACY CONVERGENCE AUDIT V2

## 1. Design question

How should HNK-VERSE look, feel and communicate its systems so that a world this deep remains readable, inhabitable, buildable and usable on Web/PWA across desktop and mobile?

This model defines:

- camera and projection;
- visual hierarchy;
- environment readability;
- avatar readability;
- interaction language;
- build/creator UX;
- HUD;
- knowledge/perception overlays;
- CODEX-HNK and HNK-Idioma surfaces;
- Agent/social interaction;
- inventory;
- world editing;
- metaphysical/symbolic layers;
- responsive behavior;
- accessibility;
- asset/runtime validation;
- ZERO visual target.

## 2. Core visual fantasy

> **A LIVING ISOMETRIC WORLD THAT FEELS INHABITABLE FIRST, MYSTICAL SECOND, AND INCREASINGLY REVEALS THE HNK AS THE PLAYER LEARNS TO PERCEIVE IT.**

The visual design must support:

LIFE
+ EXPLORATION
+ CREATION
+ KNOWLEDGE
+ SOCIAL
+ MASTERY
+ MANIFESTATION

without making any single layer dominate every screen.

## 3. Primary visual direction

The recommended first production direction remains:

**2D / 2.5D ISOMETRIC — HD MYSTICAL LIFE-SIM**

Not:

- full 3D open world for ZERO;
- ultra-retro pixel art as a hard identity constraint;
- voxel/cube aesthetics copied from Minecraft;
- MMORPG UI overloaded with permanent panels;
- occult wallpaper applied to every surface.

The target is a modern, readable, authored world with enough dimensionality to support architecture, objects, rooms, land, vertical layering and future richer rendering.

## 4. Reference synthesis

### The Sims
Borrow:
- life readability;
- home as focus;
- direct object interaction;
- clear avatar intent;
- build/buy readability.

Do not inherit:
- full simulation complexity;
- identical UI language;
- camera dependence on full 3D.

### Stardew Valley
Borrow:
- warmth;
- readable day cycle;
- home/land transformation;
- compact world comprehension;
- daily rhythm.

Do not inherit:
- farming as the product identity;
- strict retro-pixel visual lock.

### Habbo
Borrow:
- isometric room readability;
- modular spaces;
- decorating;
- social presence;
- instantly readable ownership/personalization.

Do not inherit:
- chat-room limitation;
- rigid room-only world structure.

### Tibia
Borrow:
- persistent-world readability;
- object/inventory legibility;
- map clarity;
- exploration with strong spatial memory.

Do not inherit:
- visual age;
- grind-oriented presentation.

### RuneScape
Borrow:
- skill/status readability;
- world activity visibility;
- long-term progression surfaces;
- many playstyles.

Do not inherit:
- dense legacy UI by default.

### Minecraft
Borrow:
- directness of world modification;
- immediate creation feedback;
- strong distinction between play and build actions;
- readable object placement.

Do not inherit:
- voxel visual identity as default.

## 5. Camera

Primary candidate:

**fixed/controlled isometric or near-isometric camera with limited zoom and optional controlled rotation only if technical tests prove it improves interaction without multiplying asset cost.**

ZERO should prefer:

- predictable projection;
- stable object footprints;
- stable click/touch targets;
- clear occlusion rules;
- deterministic spatial editing.

Camera freedom must never make object interaction less reliable.

## 6. Isometric truth vs world truth

The renderer does not define world geometry.

DOMAIN WORLD
→ SPATIAL BINDING
→ ISOMETRIC PROJECTION
→ SCREEN

Therefore:

SCREEN POSITION ≠ WORLD IDENTITY

SCREEN OCCLUSION ≠ WORLD NONEXISTENCE

RENDER LAYER ≠ CANONICAL OWNERSHIP

This keeps future rendering upgrades possible.

## 7. Scale hierarchy

Visual scale must communicate the current gameplay scope.

Candidate transitions:

HOME
→ LAND
→ VILLAGE
→ CITY
→ REGION
→ WORLD

Each scale should change density and information abstraction.

The interface should not render every chair when viewing an entire city.

Simulation continues underneath while visualization changes level-of-detail.

## 8. Environment readability

Every important environment should answer quickly:

- where can I walk?
- what can I interact with?
- what belongs to me?
- what is dangerous?
- what is active?
- what changed?
- where can I go next?

Visual richness must not obscure those answers.

## 9. Functional spaces

Rooms/areas should communicate function through world design before labels.

Examples:

- sleeping/rest;
- storage;
- crafting;
- laboratory;
- dojo;
- farm;
- market;
- library;
- portal hub;
- workshop.

Iconography and labels support spatial storytelling; they do not replace it.

## 10. HNK visual presence

HNK identity should be layered.

Candidate intensity levels:

### AMBIENT
Geometry, materials, proportions, subtle patterns and color relationships.

### FUNCTIONAL
Glyphs, language, seals, diagrams and symbols used when an HNK-linked system is active.

### REVELATORY
Higher-order symbolic/metaphysical visual layers revealed by knowledge/perception capability.

### CEREMONIAL
Strong visual focus for major HNK practices, thresholds or canonical events.

This prevents visual saturation.

## 11. Perception-dependent visuals

D005/D006 establish that not all actors perceive the same information.

The renderer/UI may therefore reveal layers based on justified perception.

Example:

BASE OBJECT
→ visible physical form

+ MATERIAL KNOWLEDGE
→ material/property hint

+ LANGUAGE KNOWLEDGE
→ readable inscription

+ APPRAISAL
→ provenance/quality clue

+ HNK KNOWLEDGE
→ symbolic correspondence

+ CANONICALLY VALID METAPHYSICAL PERCEPTION
→ additional HNK layer

The underlying world state does not change merely because more is revealed.

## 12. Visual epistemics

UI must communicate epistemic status.

Candidate distinctions:

- observed;
- reported;
- inferred;
- hypothesized;
- supported;
- reproduced;
- contradicted;
- unknown.

Do not present hypotheses using the same visual treatment as verified runtime facts.

This is especially important for Chronicle, investigations and Agent testimony.

## 13. Avatar readability

The player avatar must remain readable at normal gameplay zoom.

Priorities:

- silhouette;
- facing;
- motion state;
- held/equipped tool;
- action intent;
- status feedback;
- identity customization.

Micro-detail that disappears at gameplay scale must not be treated as the primary identity carrier.

## 14. Avatar visual system

Candidate layers:

BODY / BASE
+ HAIR / FACE
+ CLOTHING
+ EQUIPMENT
+ PROFESSION / ROLE MARKERS
+ HNK / SYMBOLIC ELEMENTS
+ TEMPORARY EFFECTS

Customization should express history and lifestyle rather than only rarity.

## 15. Presentation independence

Locked architectural rule:

DOMAIN ACTION
→ GAMEPLAY STATE
→ PRESENTATION STATE
→ RUNTIME MAP
→ ASSET

Never:

ASSET PLAYED
→ therefore gameplay succeeded.

Animation, particles and sound reflect state; they do not create domain truth.

## 16. Asset promotion

Adopt the Legacy V2 pipeline principle:

SOURCE
→ PROVENANCE
→ CANDIDATE
→ TECHNICAL GATE
→ VISUAL GATE
→ RUNTIME MAP
→ REAL RUNTIME EVIDENCE
→ APPROVED ASSET

A beauty render alone cannot approve an HNK-VERSE asset.

## 17. World interaction language

Interactions should be discoverable but not permanently clutter the screen.

Candidate pattern:

HOVER / FOCUS / TAP
→ TARGET HIGHLIGHT
→ CONTEXT ACTIONS
→ PREVIEW
→ EXECUTE
→ WORLD FEEDBACK

Available actions come from:

OBJECT PROPERTIES
+ CAPABILITY
+ KNOWLEDGE
+ PERMISSION
+ WORLD RULE
+ CONTEXT

## 18. Interaction priority

When many objects overlap, targeting must resolve predictably by:

- pointer/touch location;
- world layer;
- selectable bounds;
- context;
- player proximity;
- cycling/alternate selection where required.

Occlusion must never make important objects impossible to select.

## 19. Object feedback

Objects may visually communicate:

- selectable;
- usable;
- unavailable;
- locked;
- owned;
- damaged;
- powered;
- automated;
- quest-relevant;
- newly discovered.

Do not encode these states only through color.

## 20. Build mode

Build/Creator UX should feel like editing the actual world, not entering a disconnected CAD application.

Candidate flow:

SELECT DEFINITION
→ PREVIEW GHOST
→ SNAP / FREE POSITION
→ VALIDATION
→ COST / REQUIREMENTS
→ PLACE
→ DOMAIN EVENT
→ PERSIST

The player should see why placement is denied.

## 21. Build affordances

Candidate tools:

- move;
- rotate;
- place;
- remove;
- copy where authorized;
- inspect;
- connect;
- configure;
- undo/rollback where allowed.

Advanced tools unlock progressively.

ZERO needs only place/move/remove for a small object set.

## 22. Construction layers

Creation UX should scale without changing mental model.

OBJECT
→ MODULE
→ STRUCTURE
→ LAND
→ SETTLEMENT
→ WORLD

The controls can become more abstract at higher scale while preserving the same entity/relationship truth.

## 23. Creator graph UX

Advanced creation may visualize:

- entities;
- connections;
- ports;
- behaviors;
- dependencies;
- automation.

This mode may be separate from ordinary play but must edit the same authoritative World State through validated commands.

## 24. HUD philosophy

The default HUD should be **quiet**.

Show only what is actionable now.

Persistent minimal candidates:

- current focus/target;
- contextual action;
- time/world status;
- critical avatar state;
- active objective when chosen;
- essential quick access.

Deeper systems belong in expandable surfaces.

## 25. Layered UI depth

Candidate UI levels:

### WORLD HUD
Minimal live information.

### QUICK PANEL
Inventory, current goals, relationships, skills.

### KNOWLEDGE SURFACE
Codex, Chronicle, research, language.

### CREATOR SURFACE
Build, entity properties, automation.

### SYSTEM SURFACE
World map, institutions, economy, Verse graph.

The user should not see all levels simultaneously.

## 26. Inventory

Inventory must remain readable and physical enough to support the Tibia/Minecraft lineage without becoming inventory-Tetris unless intentionally designed.

Candidate distinction:

- carried inventory;
- equipped;
- home/storage;
- shared/group storage;
- institutional storage.

Ownership and location are independent.

## 27. CODEX-HNK UX

CODEX-HNK integration should not feel like opening an unrelated website.

Candidate entry paths:

- discovered object;
- symbol;
- concept;
- practice;
- quest;
- Agent teaching;
- Chronicle reference.

A Codex entry may display:

- canonical content/version;
- source/provenance;
- Persona discovery state;
- linked HNK-Idioma elements;
- related practices;
- related world entities.

CODEX CANON remains distinct from Persona knowledge.

## 28. HNK-Idioma UX

HNK-Idioma should appear in-context.

Candidate progression:

UNKNOWN MARK
→ RECOGNIZED FORM
→ PARTIAL READING
→ UNDERSTOOD TERM
→ USABLE EXPRESSION
→ SYSTEMIC APPLICATION

Where justified, the UI may progressively reveal translation/meaning based on Persona language capability.

The Verse must consume approved HNK-Idioma canon only.

## 29. Chronicle UX

Chronicle should feel like accumulated life history, not generic achievement spam.

Candidate sections:

- personal history;
- discoveries;
- relationships;
- places;
- experiments;
- practices;
- creations;
- conflicts;
- institutions;
- world events.

Chronicle is derived from authoritative events plus human-authored records; it does not replace the ledger.

## 30. Agent interaction UX

An Agent interaction should preserve world presence.

Candidate modes:

- short world bubble;
- contextual dialogue panel;
- activity/action response;
- deeper conversation when chosen;
- trade/service/teaching surfaces;
- relationship/history inspection.

Do not turn every Agent interaction into a full-screen chatbot.

The user should remain aware that the Agent inhabits the same world.

## 31. Agent epistemic cues

The interface should be capable of distinguishing:

- Agent says;
- Agent believes;
- Agent remembers;
- verified world fact;
- player interpretation.

Never decorate Agent text in a way that implies automatic canonical truth.

## 32. Creature UX

Creature information should prioritize:

- identity;
- bond;
- current state;
- needs;
- behavior;
- capability;
- ecology;
- learned actions.

Combat stats are only one subset.

## 33. Social UX

Social presence may be communicated through:

- nearby avatars/Agents;
- shared spaces;
- invitations;
- household/group indicators;
- relationship context;
- institutions;
- activity markers.

Avoid constant social notification noise.

## 34. Economy UX

Economic interfaces should show causality.

Examples:

- why price changed;
- who owns item;
- contract obligations;
- production inputs;
- destination of resources;
- maintenance costs;
- reputation/access restrictions.

Do not reduce economy to a number in the corner.

## 35. Map UX

Maps should support multiple scales.

Candidate:

HOME / LOCAL
→ LAND
→ SETTLEMENT
→ REGION
→ WORLD
→ VERSE GRAPH

Higher scales abstract lower-level entities.

A Verse Graph is not required for ZERO.

## 36. Quest/objective UX

Quests should feel connected to the world.

The UI may show:

- source;
- purpose;
- current obligations;
- evidence/progress;
- affected actors/places.

Avoid checklist design when the world itself can communicate progress.

## 37. Notifications

Notifications should be tiered:

### IMMEDIATE
Action result, danger, direct failure.

### IMPORTANT
Relationship, contract, world event.

### PASSIVE
Production complete, minor discovery.

### ARCHIVAL
Chronicle update, background history.

Users need control over noise.

## 38. Visual states of authority

The UX must distinguish:

- can view;
- can interact;
- can modify;
- can govern;
- can publish;
- canon locked.

A user should understand whether a restriction comes from:

- missing skill;
- missing knowledge;
- missing resource;
- property permission;
- world law;
- canonical lock.

## 39. Desktop controls

Candidate first-class desktop inputs:

- keyboard movement;
- pointer targeting;
- contextual action;
- quick inventory/tool access;
- camera zoom;
- build controls;
- keyboard shortcuts for frequent creator actions.

Exact bindings remain implementation decisions.

## 40. Mobile controls

Web/PWA remains a target; mobile must be designed, not merely scaled down.

Candidate principles:

- large touch targets;
- contextual action button;
- tap-to-select;
- simplified build gestures;
- panels as sheets;
- no hover dependency;
- safe thumb zones;
- readable text at default zoom.

ZERO must be testable on mobile even if desktop is the primary authoring experience.

## 41. Responsive hierarchy

Do not preserve desktop layout by shrinking it.

Desktop may support simultaneous world + panel context.

Mobile should serialize deeper panels over/under the world while preserving state.

The world remains the primary surface whenever possible.

## 42. Accessibility

Candidate baseline:

- keyboard navigability for UI;
- visible focus;
- scalable text;
- reduced motion;
- contrast validation;
- non-color-only status encoding;
- caption/text equivalents for important audio cues;
- control remapping where feasible;
- adjustable UI density.

Accessibility must enter design before asset lock.

## 43. Motion

Motion should communicate:

- action;
- cause/effect;
- state transition;
- attention;
- world activity.

Avoid gratuitous permanent glow/pulse.

Reduced-motion mode must preserve meaning.

## 44. Color

Color belongs to a semantic system, not decoration only.

Potential categories:

- world/environment;
- interaction;
- ownership;
- danger;
- knowledge;
- HNK symbolic layers;
- creator validation;
- social/economic status.

Final palette remains a dedicated visual-design decision.

## 45. Audio UX

Even in a visual-first Discovery, sound has system roles:

- action confirmation;
- environment;
- time;
- danger;
- material interaction;
- creature identity;
- Agent presence;
- HNK ceremonial/revelatory moments.

Audio must not be the only carrier of critical information.

## 46. Visual density

The HNK aesthetic should avoid the trap:

MORE SYMBOLS + MORE GLOW + MORE GOLD = MORE HNK

Instead:

HNK VISUAL IDENTITY =
PROPORTION
+ GEOMETRY
+ MATERIAL
+ SYMBOLIC ACCURACY
+ RHYTHM
+ LIGHT
+ CONTEXT
+ RESTRAINT

Ordinary homes and streets need visual rest.

## 47. Mystical reveal

The game can become visually stranger as the player's perception expands.

Candidate progression:

ORDINARY / MATERIAL
→ SUBTLE SYMBOLIC
→ PATTERN RECOGNITION
→ HNK-LINKED LAYERS
→ LOCAL ANOMALY
→ HIGHER MANIFESTATION

This lets visual progression mirror knowledge progression.

## 48. Visual canon targets

Important characters, creatures, structures and HNK elements should have approved visual targets.

Following Alakazam/Taijifu asset lessons, approval should compare:

- target/reference;
- runtime static;
- runtime motion;
- normal gameplay scale;
- multiple relevant angles/states;
- desktop/mobile where applicable.

## 49. Asset fallback strategy

Development builds may use:

- procedural placeholder;
- primitive;
- temporary licensed/free asset;
- candidate art.

Release/promotion rules may require approved authored art.

Fallbacks must be explicit and must not silently become canon assets.

## 50. Performance

Visual ambition must respect Web/PWA constraints.

Candidate priorities:

- stable frame pacing;
- bounded texture/memory budgets;
- level-of-detail;
- sprite/asset batching where relevant;
- lazy loading;
- culling;
- deterministic lower-fidelity fallbacks.

A visually richer asset that destroys interaction/readability/performance is not automatically better.

## 51. ZERO visual target

ZERO must prove:

1. one readable isometric/near-isometric HOME/LAND scene;
2. one avatar clearly readable at gameplay scale;
3. one persistent Agent clearly distinct from player;
4. one resource;
5. one interactable object;
6. one create/place interaction;
7. one world-state visual change;
8. one day/time visual shift;
9. one contextual interaction surface;
10. one compact inventory/storage surface;
11. one Codex/knowledge surface;
12. one HNK-Idioma element shown in context;
13. one Chronicle/reflection entry;
14. one relationship state cue;
15. desktop usability;
16. mobile usability;
17. reduced-motion/accessibility basics;
18. runtime visuals correspond to authoritative domain state.

ZERO does not need:

- full city;
- full Verse Graph;
- complete asset library;
- advanced Creator Studio;
- cinematic 3D;
- every HNK symbolic layer.

## 52. Locked decisions

1. First production direction is HD 2D/2.5D isometric or near-isometric rather than full 3D or hard retro-pixel identity.
2. The world must feel inhabitable/readable before mystical decoration is layered onto it.
3. HNK visual presence is progressive and contextual rather than omnipresent visual noise.
4. Camera/projection must prioritize reliable interaction and editable-world readability.
5. Visual scale changes with world scale through level-of-detail/abstraction.
6. Perception/knowledge may reveal additional visual information without changing underlying world truth.
7. Epistemic status must be visually distinguishable.
8. Avatar identity must survive normal gameplay zoom through silhouette and functional readability.
9. Presentation assets remain projections of gameplay/domain state.
10. Assets require provenance, technical, visual and runtime promotion gates.
11. Object interactions are contextual and derived from capabilities/knowledge/permissions/rules.
12. Build UX follows preview → validate → command → event → persistence.
13. Default HUD is quiet and context-first.
14. UI depth is layered into World HUD, Quick Panels, Knowledge, Creator and System surfaces.
15. CODEX-HNK and HNK-Idioma are integrated into world context rather than isolated side products.
16. Chronicle presents persistent life history but remains downstream of authoritative events.
17. Agent interaction preserves world presence and does not default to a full-screen chatbot.
18. Agent claims/beliefs must remain visually distinct from verified world truth.
19. Mobile receives native interaction design rather than desktop shrink-down.
20. Accessibility, reduced motion and non-color-only status encoding are baseline requirements.
21. HNK visual identity uses geometry/material/symbolic accuracy/restraint rather than indiscriminate glow/ornament.
22. ZERO visual proof remains intentionally small and validates both desktop and mobile.
