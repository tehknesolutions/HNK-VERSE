# HNK-VERSE — World Model v2

Status: APPROVED ARCHITECTURAL BASELINE
Date: 2026-09-27
Parent: `docs/product/2026-09-27-hnk-verse-pdd-gdd-2.0.md`

## 1. Purpose

World Model v2 defines the structural model used by the HNK-VERSE metaverse platform to represent persistent worlds, spaces, entities, relationships, transitions and Verse-specific realities without collapsing all experiences into one universal game model.

HNK-VERSE is the metaverse platform. HNK-KODE remains the HNK idiom + full-stack language and is a sibling/transversal project that may target this model through explicit contracts.

## 2. Core model

The apparent spatial/cosmological hierarchy is:

`VERSE → UNIVERSE → GALAXY → SYSTEM → PLANET → CONTINENT → REGION → CITY → LOT/AREA → SPACE/ROOM → ENTITY`

All levels are optional except the contextual identity required by the platform contract.

A minimal social Verse may use:

`VERSE → SPACE → ENTITY`

A large cosmological Verse may use the full scale.

`WORLD` remains a generic/composable abstraction and does not impose a cosmological ceiling.

## 3. Hierarchy is a projection; the real model is a typed graph

The hierarchy is useful for navigation, authoring and human comprehension, but the canonical runtime structure is a typed graph.

Nodes may have a primary containment/location path while also participating in non-hierarchical relationships.

Initial relationship vocabulary includes:

- `CONTAINS`
- `INSIDE`
- `CONNECTED_TO`
- `PORTAL_TO`
- `INSTANCE_OF`
- `BRANCH_OF`
- `TIMELINE_OF`
- `MIRRORS`
- `PROJECTS_TO`
- `BELONGS_TO`

The vocabulary is extensible through versioned platform/Verse contracts. A Verse must not silently redefine the semantics of an existing platform relationship.

This graph permits portals, parallel realities, timelines, instances, projections and non-Euclidean structures without destroying primary location semantics.

## 4. Entity as universal atom

`Entity` is the universal runtime atom of HNK-VERSE.

Conceptual contract:

`Entity = HNK-ID + Type + Components + Relations + Capabilities + State + Authority + Provenance + ChronicleRefs`

Possible specializations/compositions include:

- avatar;
- character;
- NPC;
- creature;
- item;
- vehicle;
- object;
- door/portal;
- building;
- room/space representation;
- city representation;
- planet representation;
- other Verse-defined entities.

`Verse`, `World` and cosmological/spatial structures may expose specialized container/context contracts while still being referable through stable platform identity.

Entity universality does not mean all entities share all components or mechanics.

## 5. Identity and address are separate

### HNK-ID

`HNK-ID` answers:

> Who/what is this?

It is stable identity and must survive ordinary movement, transitions and changes of address.

Illustrative form only:

`entity:alakazam:001`

The final HNK-ID encoding is not frozen by this document.

### HNK-Address

`HNK-Address` answers:

> Where is this entity located/projected in the current graph context?

An address can change without changing HNK-ID.

Illustrative path:

`Verse / Universe / Galaxy / System / Planet / Region / Space`

An entity can traverse a portal, change region or enter a timeline while retaining stable identity, subject to explicit identity/branching rules.

## 6. Location, projection and multiplicity

The model distinguishes:

- **Identity** — stable referent.
- **Primary Location** — principal containment/address in a runtime context.
- **Projection** — representation of an identity in another context.
- **Instance** — bounded runtime realization.
- **Branch** — derived state/history with explicit lineage.

Therefore:

`IDENTITY != LOCATION != PROJECTION != INSTANCE != BRANCH`

Multiple projections must not silently imply multiple canonical identities.

## 7. Three state scopes

World Model v2 establishes three principal state scopes.

### Platform State

Cross-Verse platform concerns such as:

- persistent user identity;
- platform profile;
- platform permissions;
- platform presence references;
- stable cross-Verse references;
- platform-level social relationships where explicitly supported.

### Verse State

State owned by one Verse, such as:

- Verse progression;
- Verse inventory;
- Verse-specific abilities;
- Verse economy;
- Verse factions;
- Verse world state;
- Verse-specific simulation rules.

### Experience State

State owned by a bounded experience/session/campaign/quest/match or similar context, such as:

- current quest step;
- match score;
- temporary modifiers;
- session-local entities;
- encounter state.

Core invariant:

`PERSISTENT IDENTITY != UNIVERSAL GAMEPLAY STATE`

Travel between Verses preserves identity but does not automatically transfer inventory, level, magic, economy or other Verse-owned mechanics.

## 8. Entity components

Components provide composable state/behavior surfaces.

Candidate platform-level components include:

- identity reference;
- transform/location;
- ownership/authority;
- lifecycle;
- persistence policy;
- provenance;
- Chronicle linkage;
- capability manifest;
- presentation references.

Verse-specific components may add combat, needs, magic, crafting, AI behavior, dialogue or any other mechanic without promoting those mechanics into the universal platform contract.

## 9. Capabilities

Capabilities describe what an entity, space, Verse or runtime context supports.

Examples:

- movable;
- interactable;
- ownable;
- editable;
- enterable;
- portal-capable;
- persistent;
- simulated;
- social-presence-enabled;
- scriptable.

Capability negotiation is preferred over assuming every Verse implements every platform feature.

## 10. Authority and provenance

Every persistent or published entity should be able to identify:

- creator/source;
- owning authority/context;
- schema/contract version;
- creation/update lineage;
- source asset or generated artifact references where applicable;
- Chronicle references.

Runtime creation does not imply CODEX-HNK canonicalization.

`CREATED != PUBLISHED != CANONICAL`

## 11. Chronicle relationship

World Model nodes and relations may emit/receive Chronicle events.

Examples:

- entity created;
- entity moved;
- portal traversed;
- relation created/removed;
- object edited;
- Verse entered/exited;
- branch created;
- projection instantiated.

Chronicle records causal/runtime history. It does not automatically transform events into HNK canon.

## 12. HNK-Math and Mandala relationship

World Model v2 reserves explicit integration points for HNK-Math and, through appropriate HNK-KODE contracts, Mandala-HNK structures.

Potential uses include:

- deterministic identity/signature;
- structured addressing;
- coordinates;
- relation signatures;
- spatial/systemic encoding.

This document does not invent mathematical semantics or assign unvalidated meanings to Mandala positions.

World Model remains usable before the final HNK-Math/Mandala encoding is frozen.

## 13. HNK-KODE relationship

HNK-KODE may author or manipulate World Model structures through explicit platform contracts.

Conceptually:

`HNK-KODE → compiled/validated program → Verse SDK / World Model contract → HNK-VERSE runtime`

HNK-VERSE does not own HNK-KODE grammar, compiler or Mandala-HNK specification.

## 14. Travel and portals

A transition is an explicit graph operation.

Conceptual flow:

`IDENTITY → CURRENT ADDRESS → TRANSITION EDGE → POLICY/CAPABILITY CHECK → TARGET CONTEXT → NEW ADDRESS/PROJECTION → CHRONICLE EVENT`

A portal can connect nodes that are distant or incomparable in the apparent hierarchy.

Transitions must define what happens to:

- identity;
- avatar/embodiment;
- platform state;
- Verse state;
- experience state;
- permissions;
- projections;
- Chronicle lineage.

## 15. Timelines and branches

Timeline support is modeled through typed lineage rather than duplicate identity by default.

Candidate relations:

`TIMELINE_OF`

`BRANCH_OF`

A branch must preserve explicit provenance to its source state/context.

Whether a branch creates a new entity identity or a projection/version of an existing identity is a policy decision defined by the relevant Verse/platform contract; it must never be implicit.

## 16. Persistence

Persistence is capability/policy driven.

Possible scopes:

- ephemeral;
- experience-local;
- Verse-persistent;
- platform-persistent.

The platform must not force all runtime entities to be globally persistent.

## 17. Creation model

The model supports progressive authoring:

`OBJECT → SPACE → LOT/AREA → CITY → REGION → WORLD → VERSE`

but authoring tools may skip levels.

Creators can start with a room, template or existing world without understanding the complete cosmological model.

Advanced creators/developers can access lower-level graph, SDK and HNK-KODE capabilities as they become available.

## 18. HNK-VERSE ZERO implications

The first vertical slice needs only a bounded subset of World Model v2:

- one platform identity;
- avatar/entity;
- Hub Verse/context;
- personal Space;
- shared Space;
- placeable/editable object entities;
- two portal edges;
- two minimal target experience contexts;
- persistent location/object state;
- presence;
- Chronicle events.

The ZERO slice validates the architecture without requiring galaxy/planet/timeline features to be implemented immediately.

## 19. Invariants

1. `HNK-ID != HNK-Address`.
2. `IDENTITY != LOCATION != PROJECTION != INSTANCE != BRANCH`.
3. The apparent hierarchy is not the runtime ontology; the runtime ontology is a typed graph.
4. Cosmological levels are optional.
5. `World` is composable and does not impose the maximum scale.
6. Entity is the universal runtime atom, not a universal mechanic bundle.
7. Shared platform identity does not imply shared Verse gameplay state.
8. Verse mechanics remain Verse-owned unless promoted through an explicit platform contract decision.
9. Runtime events do not become CODEX-HNK canon automatically.
10. HNK-Math/Mandala integration points are reserved without inventing semantics.
11. Every cross-context transition must be explicit and traceable.
12. Every branch/projection/instance must preserve lineage.

## 20. Next contract

With World Model v2 established, the next architecture artifact is:

**Platform State vs Verse State Contract v1**

It must define ownership, persistence, transfer, projection and conflict rules for data crossing Verse boundaries, followed by the Identity / Avatar / Presence model.