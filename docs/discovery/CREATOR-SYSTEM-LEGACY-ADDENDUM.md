# DISCOVERY INPUT — CREATOR SYSTEM LEGACY ADDENDUM

**Status:** PROPOSAL INPUT  
**Date:** 2026-09-22  
**Primary source:** Tehkné Studio  
**Related lock:** DISCOVERY 004 — WORLD + CREATION MODEL

## Why this exists

DISCOVERY 004 already locked the principle:

> **THE WORLD IS PLAYABLE MATTER.**

Tehkné Studio provides mature internal evidence for *how* editable matter can be represented without coupling authoring, simulation and rendering.

This document does not modify the D004 lock. It proposes implementation/design architecture for a future Creator Model.

## Candidate model

`DEFINITION → ENTITY → RELATIONSHIP GRAPH → SPATIAL BINDING → BEHAVIOR → COMMAND → EVENT → WORLD STATE → RENDERER`

### Definitions

Reusable versioned templates contain:

- properties;
- capabilities;
- ports;
- compatibility;
- metadata;
- provenance.

### Entities

Instances have stable identity independent from rendering.

### Relationships

Systems emerge from relations between entities rather than giant monolithic object classes.

Candidate world relations may eventually include:

- contains;
- attachedTo;
- connectedTo;
- poweredBy;
- controlledBy;
- dependsOn;
- supplies;
- drainsTo;
- linkedTo;
- inhabits;
- owns;
- protects;
- teaches;
- tradesWith;
- portalTo.

This list is illustrative, not canonical.

### Ports

Ports describe compatible connection surfaces.

Potential HNK-VERSE domains:

- structural;
- mechanical;
- electrical;
- fluid/resource;
- data/signal;
- control;
- biological/ecological;
- linguistic;
- symbolic;
- metaphysical, only where HNK canon defines a valid interface.

### Spatial binding

Position/rotation/scale are a projection/binding of an entity into a world space.

They must not become the only identity of the entity.

### Behaviors

Data-driven triggers and actions may define automation without hard-coding every machine/object.

### Command authority

`UI / VOICE / AGENT / AUTOMATION / SYSTEM → COMMAND BUS`

No privileged Agent shortcut to WORLD_STATE.

The same command must pass:

- identity;
- permissions;
- local WORLD_RULESET;
- capability;
- resource requirements;
- provenance/event logging.

### AI-assisted authoring

AI may:

- resolve intent;
- propose components;
- identify compatible connections;
- draft behaviors;
- explain failures;
- produce creator plans.

AI must:

- surface ambiguity;
- fail closed on missing authority;
- use normal domain commands for execution;
- never silently promote generated content to HNK canon.

## ZERO implication

ZERO does not need a full Creator Studio.

It only needs the architectural seed:

1. one object definition;
2. one object instance;
3. one spatial binding;
4. one capability;
5. one permitted placement/mutation command;
6. one authoritative event;
7. persisted state;
8. renderer projection.

If this chain is correct, future Creator Mode can grow without replacing the world model.
