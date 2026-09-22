# HNK-VERSE — ZERO INTERACTION + EVENT CONTRACT V0.1

**Status:** PROPOSAL — awaiting Creator lock  
**Date:** 2026-09-22  
**Parent:** HNK-VERSE GDD V0.1 / ZERO Home + Land V0.1 LOCK  
**Scope:** deterministic first playable loop

## 1. Purpose

This document converts the locked ZERO content and spatial design into executable interaction semantics.

It defines:

- player intents;
- domain commands;
- validation gates;
- authoritative events;
- state transitions;
- Agent reactions;
- ownership conservation;
- Chronicle derivation;
- persistence checkpoints;
- deterministic E2E assertions.

The objective is to make the first 10-minute experience testable without depending on production AI or presentation assets.

## 2. Core rule

> **PLAYER INPUT DOES NOT CHANGE WORLD STATE DIRECTLY.**

Authoritative path:

INPUT  
→ INTENT  
→ DOMAIN COMMAND  
→ VALIDATION  
→ EVENT(S)  
→ REDUCER  
→ AUTHORITATIVE STATE  
→ DERIVED VIEW  
→ RENDERER / UI

For Agent actions:

AGENT INTENT  
→ DOMAIN COMMAND  
→ VALIDATION  
→ EVENT(S)  
→ STATE

Presentation-only interactions may remain local UI state if no domain state changes.

## 3. Truth hierarchy

Authoritative truth lives in:

1. immutable Event Ledger;
2. deterministic reducer state / persisted snapshots derived from accepted events;
3. versioned canonical bridge references where applicable.

Not authoritative by itself:

- animation;
- dialogue text;
- HUD state;
- quest/tutorial widget;
- Chronicle prose;
- Agent AI output;
- client inventory cache.

## 4. Command envelope

Every consequential ZERO command should include equivalent fields:

- commandId
- commandType
- schemaVersion
- actorId
- verseId
- worldId
- sessionId
- targetId when applicable
- issuedAtReal
- issuedAtWorld
- correlationId
- causationId when applicable
- idempotencyKey
- payload

Requirements:

- commandId globally unique;
- idempotencyKey prevents duplicated side effects;
- actorId identifies requesting domain actor;
- verseId/worldId prevent cross-world mutation;
- schemaVersion supports migration;
- correlationId groups an interaction chain;
- causationId links follow-up work.

## 5. Event envelope

Every authoritative ZERO event should include:

- eventId
- eventType
- schemaVersion
- verseId
- worldId
- actorId
- targetId when applicable
- realTimestamp
- worldTimestamp
- correlationId
- causationId when applicable
- payload
- provenance

Events are append-only, immutable after acceptance, ordered within a World stream, replayable and versioned.

Corrections happen through new/compensating events, never by rewriting historical events.

## 6. ZERO aggregate boundaries

Minimum authoritative aggregates:

### HNK Identity
Account-level identity references and Personal Verse link.

### Personal Verse
World references and Verse-level provenance.

### World
World time, entity registry and local event stream.

### Land/Home
Spatial permissions and fixed fixture relationships.

### Avatar
Safe position, carried inventory references, soft state and Persona progression references.

### Persona Knowledge
Discovered lexeme and knowledge states.

### Skill Record
Evidence references and derived mastery state.

### Resource Node
Remaining resource quantity.

### Entity Instance
Object identity, owner, capabilities and spatial binding.

### Agent
Identity, goals, memory, inventory, relationship references and bounded autonomy state.

### Relationship
Vector state and causal history.

### Chronicle
Derived references plus human-authored reflections.

## 7. Progress is derived, not commanded

ZERO does not use a primary tutorialStep field as world truth.

Milestones are read-model predicates derived from domain facts:

- M0_STARTED
- M1_VALI_OBSERVED
- M2_VALI_KNOWN
- M3_PRACTICAL_KNOWLEDGE_AVAILABLE
- M4_WOOD_GATHERED
- M5_FIRST_PRACTICE_EVIDENCED
- M6_BOX_CREATED
- M7_BOX_PLACED
- M8_METATRON_REACTED
- M9_GIFT_TRANSFERRED
- M10_CHRONICLE_READY
- M11_PERSISTENCE_PROVEN

The UI may display milestones but cannot author them.

## 8. Interaction classes

ZERO interactions fall into:

### NAVIGATION
Move, focus and select.

### OBSERVATION
Inspect object, lexeme, Agent or state.

### TRANSFORMATION
Gather, work, craft and place.

### SOCIAL
Talk, teach, offer, accept/refuse and update relationship history.

### RECORD
Chronicle/reflection and session boundary.

## 9. Movement

Intent: MOVE_AVATAR  
Command: MoveAvatar

Validation:

- actor controls Avatar;
- destination is walkable;
- destination is accessible;
- collision rules permit.

ZERO does not need one permanent ledger event per animation frame or logical step.

Recommended:

- movement runs in runtime state;
- safe significant position is checkpointed periodically and at session boundary;
- meaningful World entry/exit and placement remain authoritative.

Persisted event candidate: AvatarPositionCheckpointed.

## 10. VALI observation

Intent: INSPECT_TARGET  
Command: ObserveLexeme

First meaningful observation produces:

LexemeFormObserved

Payload must preserve:

- lexemeRef = LEX-013;
- form = VALI;
- meaningRevealed = false;
- sourceAuthority = @hnk/linguas;
- languageAuthority = FROZEN.

This proves observation of the form, not understanding.

## 11. VALI teaching

Preconditions:

- LexemeFormObserved for LEX-013 exists;
- Metatron is accessible;
- Persona does not already know the meaning.

Intent: ASK_ABOUT_VALI  
Command: RequestLexemeTeaching

Validation:

- target is AGENT-ZERO-CARTOGRAPHER-001;
- Agent has permission/source-bounded knowledge;
- access/relationship gate permits teaching.

Events:

1. AgentTeachingOffered
2. LexemeMeaningLearned

LexemeMeaningLearned records:

- lexemeRef = LEX-013;
- meaning = trabalho / trabalhar;
- canonical linguistic source/version;
- zeroBinding = TRANSVERSAL;
- curriculumBindingL07 = false;
- causation = AgentTeachingOffered.

Result:

knowsLexeme(LEX-013) = true.

## 12. Practical Malkuth knowledge

The ZERO practical knowledge still lacks a published CODEX-HNK canonical runtime ID.

Stored authority metadata:

- internalRef = ZERO-KNOWLEDGE-MALKUTH-MANIFESTATION-V0;
- canonicalRef = null;
- bridgeStatus = PENDING_CANONICAL_ID;
- authority = SOURCE_SUPPORTED_DERIVATION.

Event:

KnowledgeUnitDiscovered

The event must never label this item as published CODEX canon.

Derived capability:

canAttemptPracticalWork = true

once required knowledge conditions are satisfied.

## 13. Gather Wood

Command: GatherResource

Payload:

- nodeId = RESOURCE-NODE-WOOD-ZERO-001
- resourceDefId = RESOURCE-WOOD-ZERO-V0
- quantity = 1

Validation:

- Avatar in range;
- node remaining >= 1;
- actor has gather permission;
- practical gate satisfied;
- inventory can receive unit.

Authoritative event:

ResourceGathered

Reducer effect:

nodeQuantity - 1  
playerOwnedWood + 1

Initial state:

nodeQuantity = 4

After four successful unique gathers:

nodeQuantity = 0  
playerOwnedWood = 4

## 14. Gather idempotency

A duplicate retry with the same idempotencyKey must not gather twice.

First accepted command emits event.

Duplicate retry returns the original accepted result with no additional event or resource mutation.

This is a release-blocking anti-duplication invariant.

## 15. Workbench availability

Before knowledge requirements:

- Workbench inspectable;
- Wooden Box process unavailable;
- read model explains missing requirement.

After gates:

Workbench exposes Create Wooden Box.

Action availability is derived from domain validation, not hard-coded tutorial sequence.

## 16. Practical work attempt

Command: AttemptPractice

Payload:

- skillId = SKILL-PRACTICAL-WORK-ZERO-V0
- processId = PROCESS-WOODEN-BOX-ZERO-V0
- contextEntity = ENTITY-WORKBENCH-ZERO-001

Validation:

- practical knowledge available;
- player owns >= 3 Wood;
- Workbench usable;
- player in range;
- World rules permit creation.

Events:

1. PracticeAttempted
2. PracticeSucceeded or PracticeFailed

ZERO golden path is deterministic success after valid prerequisites.

## 17. Skill evidence

PracticeSucceeded causes:

SkillEvidenceRecorded

Payload:

- skillId;
- sourceEventRefs;
- context;
- result = SUCCESS;
- guided status;
- quality/validity;
- repeatability metadata when applicable.

Skill state derives from evidence.

XP may summarize progress but cannot independently create mastery.

## 18. Craft Wooden Box

Command: CraftEntity

Preconditions:

- successful valid practice;
- player owns >= 3 Wood.

Atomic authoritative effects:

1. ResourceConsumed
2. EntityCreated

Conservation:

Before:
- playerWood = 4
- boxCount = 0

After:
- playerWood = 1
- boxCount = 1

EntityCreated must contain:

- definitionId = ENTITY-WOODEN-BOX-ZERO-V0;
- stable instanceId;
- ownerId = Player;
- capabilities = CONTAINER, PLACEABLE, MOVABLE_BY_OWNER, STORAGE, INSPECTABLE;
- spatialBinding = null;
- provenance = Workbench craft;
- causation = PracticeSucceeded.

## 19. Unplaced Box state

A crafted Box exists authoritatively before placement.

State:

- owner = Player;
- spatialBinding = null;
- location = carried/unplaced-owned entity state.

This proves:

ENTITY IDENTITY ≠ SPATIAL BINDING.

## 20. Placement preview

Intent: PREVIEW_PLACE_ENTITY

No authoritative mutation event.

UI may render a placement ghost.

Pure validation query:

ValidatePlacement

returns:

- valid/invalid;
- reason code;
- candidate logical coordinates.

## 21. Place Wooden Box

Command: PlaceEntity

Payload:

- entityInstanceId;
- landId;
- logicalX;
- logicalY;
- orientation.

Validation:

- actor owns or is allowed to place the Box;
- Land/Home scope permits PLACE;
- target cells unoccupied;
- footprint fits;
- object movable/unplaced;
- World rules permit;
- no system/canon lock blocks target.

Event:

EntityPlaced

Reducer sets:

- spatialBinding;
- parent/location relation;
- lastModifiedBy;
- entity state version.

First manifestation invariant:

HOME_STORAGE_ZONE is occupied by the exact created Box instance.

Reload must restore the same instance ID and binding.

## 22. Placement rejection

Invalid placement creates no mutation event.

Stable rejection codes include:

- OUT_OF_BOUNDS
- OCCUPIED
- NO_PERMISSION
- INVALID_FOOTPRINT
- ENTITY_NOT_OWNED
- WORLD_RULE_DENIED

UI maps codes to readable messages.

## 23. Metatron observes placement

Metatron has local access to the Home/Work area.

EntityPlaced may cause:

1. AgentPerceivedWorldEvent
2. AgentMemoryCreated

Memory records:

- episodeType = PLAYER_CREATED_AND_PLACED_BOX;
- observedEventRef = EntityPlaced;
- source = direct observation;
- actor = Player;
- object = exact Box instance.

Memory is downstream of World truth.

## 24. Agent dialogue

Dialogue may be generated from:

- Agent memory;
- relationship;
- current goal;
- observed event.

Rendered prose is not automatically authoritative.

If teaching/testimony changes domain state, the structured semantic event is stored separately from presentation text.

## 25. Offer Wood to Metatron

Command: OfferTransfer

Payload:

- fromActor = Player
- toActor = Metatron
- resource = Wood
- quantity = 1

Before Box placement:

result = REFUSED  
reason = FIRST_MANIFESTATION_INCOMPLETE

No ownership transfer occurs.

After Box placement, if Player owns 1 Wood and Metatron can receive it:

Agent policy = ACCEPT.

## 26. Transfer ownership

Command: TransferOwnership

Events:

1. OwnershipTransferred
2. RelationshipHistoryAppended
3. AgentMemoryCreated

Conservation:

Before:
- playerWood = 1
- metatronWood = 0

After:
- playerWood = 0
- metatronWood = 1

Global Wood quantity remains consistent with prior consumption/gather history.

No client call may mint an extra unit.

## 27. Relationship history

The gift creates authoritative history first.

RelationshipHistoryAppended records:

- relationshipId;
- type = GIFT_RECEIVED;
- sourceEvent = OwnershipTransferred;
- from = Player;
- to = Metatron;
- resource;
- quantity.

Numeric trust change remains balancing/derived logic.

Historical cause cannot disappear when balance coefficients change.

## 28. Chronicle derivation

Chronicle derived records reference:

- VALI observed;
- VALI learned;
- practical knowledge discovered;
- Wood gathered;
- first Skill evidence;
- Wooden Box created;
- Wooden Box placed;
- first gift;
- relationship event.

Chronicle prose never replaces the events.

## 29. Human reflection

Command: AppendReflection

Payload:

- text;
- linkedEventRefs;
- visibility;
- authorId.

Event:

HumanReflectionAppended

Authority class:

HUMAN_AUTHORED_INTERPRETATION.

It never auto-promotes to Evidence or Canon.

## 30. Session end

Command: EndSession

May trigger:

- safe Avatar position checkpoint;
- snapshot/checkpoint request;
- session metadata flush.

Important rule:

accepted domain events must already be durable.

If browser crashes after acknowledged EntityPlaced, the Box must survive even without graceful EndSession.

## 31. Restore

LoadPersonalVerse must restore:

- HNK Identity;
- Personal Verse;
- World;
- Land/Home;
- fixtures;
- Avatar;
- Persona knowledge;
- Skill evidence;
- Wood node quantity;
- inventories/ownership;
- Box instance/binding;
- Metatron identity/memory/inventory;
- Relationship history;
- Chronicle/reflections.

Tutorial code may not recreate missing state.

## 32. Golden causation chain

Expected causal/correlated lineage:

LexemeFormObserved  
→ AgentTeachingOffered  
→ LexemeMeaningLearned  
→ KnowledgeUnitDiscovered  
→ ResourceGathered ×4  
→ PracticeAttempted  
→ PracticeSucceeded  
→ SkillEvidenceRecorded  
→ ResourceConsumed  
→ EntityCreated  
→ EntityPlaced  
→ AgentPerceivedWorldEvent  
→ AgentMemoryCreated  
→ OwnershipTransferred  
→ RelationshipHistoryAppended  
→ AgentMemoryCreated  
→ HumanReflectionAppended

Exact direct causation vs correlation grouping may vary, but lineage must be inspectable.

## 33. Correlation groups

Recommended:

### CORR-LEARN
VALI observation + teaching + knowledge.

### CORR-GATHER
Wood gathering.

### CORR-CREATE
Practice + evidence + consumption + Box creation.

### CORR-PLACE
Placement + Agent observation + memory.

### CORR-GIFT
Offer + transfer + relationship + memory.

### CORR-RECORD
Chronicle/reflection.

## 34. Deterministic rejection tests

Required tests:

1. gather when node = 0 → denied;
2. duplicate gather idempotency key → no duplicate Wood;
3. craft with <3 Wood → denied;
4. craft without knowledge → denied;
5. place outside owned Land → denied;
6. place on occupied cell → denied;
7. gift before Box placement → refused;
8. gift quantity > owned → denied;
9. Agent direct world mutation without command → impossible;
10. Chronicle/reflection attempting to set Canon → impossible.

## 35. Derived predicates

Pure read-model predicates:

- hasObservedVali(state)
- knowsVali(state)
- hasPracticalKnowledge(state)
- hasGatheredRequiredWood(state)
- hasFirstSkillEvidence(state)
- ownsWoodenBox(state)
- hasPlacedWoodenBox(state)
- metatronRemembersBox(state)
- hasCompletedGift(state)
- hasChronicleReflection(state)

Guidance UI reads these predicates; it never sets them.

## 36. Interaction UX contract

Every target exposes:

- target identity;
- primary contextual action;
- optional secondary actions;
- disabled-action reason;
- authority/ownership cue where relevant.

Desktop:

- pointer/select;
- keyboard movement;
- contextual action.

Mobile:

- tap target;
- bottom action sheet;
- large controls;
- placement ghost snapped to logical cell.

No essential interaction depends on hover.

## 37. Error semantics

Stable machine-readable reason codes are domain-owned.

Examples:

- KNOWLEDGE_REQUIRED
- RESOURCE_INSUFFICIENT
- NODE_DEPLETED
- OUT_OF_RANGE
- NO_PERMISSION
- CELL_OCCUPIED
- INVALID_TRANSFER
- MILESTONE_REQUIRED
- CANON_LOCKED

UI owns wording and localization.

## 38. Snapshot strategy

Event Ledger remains historical authority.

Snapshots may accelerate restore.

Snapshot includes:

- World reducer state;
- Avatar;
- resource nodes;
- entity bindings;
- Agent state;
- relationships;
- Persona knowledge;
- Skills;
- Chronicle indexes;
- lastEventId/stream position;
- schemaVersion;
- checksum.

Restore:

snapshot + later events → current state.

## 39. Atomic transaction boundaries

### GatherResource
Node decrement + player inventory increment commit together.

### CraftEntity
Resource consumption + Box creation commit together.

### PlaceEntity
Spatial binding + entity version commit together.

### TransferOwnership
Player decrement + Metatron increment + ownership change commit together.

Relationship/memory side effects may be in the same transaction or deterministic downstream handling, but duplication must be impossible.

## 40. Concurrency

ZERO must tolerate:

- double-click Gather;
- repeated mobile tap;
- duplicate placement request;
- network retry after transfer.

Use:

- optimistic version checks;
- idempotency keys;
- transaction constraints.

Renderer never assumes a pending command already succeeded.

## 41. Presentation command lifecycle

UI state:

IDLE  
→ PENDING  
→ ACCEPTED or REJECTED  
→ RENDER UPDATED

Optimistic previews are allowed only when reversible.

## 42. AI independence

The deterministic ZERO golden path must not require a live LLM.

Metatron may initially use:

- deterministic dialogue templates;
- rule-based policy;
- structured memory.

AI may later enrich presentation/reasoning behind the same Agent identity and contracts.

## 43. Telemetry

Telemetry may record:

- command requested;
- accepted/rejected;
- latency;
- UI path;
- abandoned interaction;
- E2E result.

Telemetry is not domain truth.


## 44A. Rest / Bed interaction — Survival RPG reference absorption

The locked ZERO Bed becomes a real domain verb rather than scenery.

Command:

Rest

Target:

ENTITY-BED-ZERO-001

Validation:

- Avatar has access to Home;
- Bed is usable;
- Avatar is within valid interaction context;
- no World rule blocks Rest.

Accepted result:

1. AvatarRested
2. WorldDayAdvanced only when the configured time advance crosses the day boundary.

Reducer effects:

- Energy/Rest moves toward the configured recovered state;
- World Time advances by a deterministic configured amount;
- Avatar remains at a valid Home/Bed context;
- state persists.

Important boundaries:

- Rest is optional for ordinary ZERO progression;
- no mandatory hunger/thirst loop is added;
- no survival punishment is created by refusing to Rest;
- the exact time advance and recovery amount are balancing values, not canon;
- Rest does not invent dreams, visions or metaphysical evidence.

This absorbs the useful Survival RPG pattern of sleeping as time/recovery utility while preserving the HNK-VERSE soft-needs lock.

## 44B. Workbench as capability-bearing World fixture

The Workbench is not a menu portal.

ENTITY-WORKBENCH-ZERO-001 must expose a capability equivalent to:

PRACTICAL_WOODWORK_CONTEXT

The Wooden Box process requires:

- practical knowledge gate;
- 3 Wood;
- valid Workbench capability/context;
- player permission;
- World rule permission.

Therefore:

RECIPE KNOWN ≠ PROCESS EXECUTABLE EVERYWHERE.

This becomes the first seed of the post-ZERO Tool Capability model.


## 44. Golden final assertions

### Knowledge
- LexemeFormObserved exists;
- LexemeMeaningLearned exists for LEX-013;
- Persona knows VALI;
- provisional Malkuth knowledge exists with canonicalRef = null.

### Resource
- Wood node = 0;
- Player Wood = 0 after gift;
- Metatron Wood = 1;
- gathered/consumed/transferred quantities reconcile.

### Mastery
- PracticeSucceeded exists;
- SkillEvidenceRecorded references practice;
- Skill advanced from evidence.

### Creation
- exactly one Wooden Box instance exists;
- owner = Player;
- spatialBinding = Home storage zone.

### Agent
- same Metatron Agent ID;
- memory references placement;
- memory references gift.

### Relationship
- gift history references OwnershipTransferred.

### Chronicle
- required derived records exist;
- optional reflection is typed interpretation.

### Persistence
- reload reproduces all assertions without tutorial reconstruction.

## 45. Initial ZERO event registry

- IdentitySessionStarted
- AvatarPositionCheckpointed
- LexemeFormObserved
- AgentTeachingOffered
- LexemeMeaningLearned
- KnowledgeUnitDiscovered
- ResourceGathered
- PracticeAttempted
- PracticeSucceeded
- PracticeFailed
- SkillEvidenceRecorded
- ResourceConsumed
- EntityCreated
- EntityPlaced
- EntityMoved
- EntityRemoved
- AgentPerceivedWorldEvent
- AgentMemoryCreated
- TransferOffered
- TransferRefused
- OwnershipTransferred
- RelationshipHistoryAppended
- HumanReflectionAppended
- AvatarRested
- WorldDayAdvanced
- IdentitySessionEnded

Names remain versioned domain contract identifiers.

## 46. Initial ZERO command registry

- StartSession
- MoveAvatar
- ObserveLexeme
- RequestLexemeTeaching
- DiscoverKnowledge
- GatherResource
- AttemptPractice
- CraftEntity
- ValidatePlacement
- PlaceEntity
- MoveEntity
- RemoveEntity
- InteractWithAgent
- OfferTransfer
- TransferOwnership
- AppendReflection
- Rest
- EndSession

Queries/read models remain separate from commands.

## 47. Security and authority invariants

1. Client cannot set inventory quantity directly.
2. Client cannot set Skill mastery directly.
3. Client cannot write Agent memory directly.
4. Agent runtime cannot write World events without validated domain commands.
5. Client cannot promote interpretation to Evidence or Canon.
6. Client cannot assign HNK canonical authority.
7. language bridge accepts approved canonical language source references only.
8. provisional Malkuth knowledge cannot masquerade as a published CODEX ID.
9. ownership mutation is domain-authoritative.
10. placement is domain-authoritative.

## 48. Candidate lock decisions

1. ZERO uses command → validation → event → reducer → state as the only authoritative mutation path.
2. Event Ledger events are immutable, versioned and causally traceable.
3. ZERO progression is derived from domain facts, not a primary tutorial-step field.
4. VALI observation and learning are separate events.
5. Provisional Malkuth knowledge preserves canonicalRef = null until CODEX-HNK publishes an ID.
6. Wood gathering is atomic and idempotent.
7. The finite Wood node starts with 4 and reconciles exactly through craft + gift.
8. Practice success creates explicit Skill evidence; XP alone cannot advance mastery.
9. Wooden Box identity exists independently from placement/spatial binding.
10. Placement preview is non-authoritative; EntityPlaced is authoritative.
11. Metatron memory is caused by observed World events.
12. Gift is refused before Box placement and accepted after the first manifestation gate when all transfer rules pass.
13. Ownership transfer conserves resource quantity and appends causal relationship history.
14. Chronicle derives from events; free-form reflection is typed human interpretation.
15. Accepted domain events survive browser/session failure independently of graceful logout.
16. Restore loads authoritative state; tutorial code may not reconstruct completed state.
17. Deterministic golden path works without a production AI model.
18. Stable domain rejection codes are separate from UI wording.
19. Atomic transactions, idempotency and concurrency protection are required in ZERO.
20. Golden E2E validates knowledge, conservation, mastery evidence, creation, placement, Agent memory, relationship history, Chronicle and reload persistence.
21. Rest is an optional authoritative Bed interaction that recovers the soft Energy/Rest state and advances World Time without adding punitive survival meters.
22. Workbench capability/context is required for the first Wooden Box process; recipe knowledge alone does not make the process executable anywhere.
23. Survival RPG-inspired mining, farming, fishing, combat, biomes, dungeons and tool chains remain post-ZERO.
