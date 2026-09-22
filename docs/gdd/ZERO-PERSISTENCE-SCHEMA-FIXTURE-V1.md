# HNK-VERSE — ZERO PERSISTENCE SCHEMA + DETERMINISTIC FIXTURE V1

**Status:** LOCKED — Creator-approved ZERO persistence schema + deterministic fixture  
**Date:** 2026-09-22  
**Parent:** HNK-VERSE GDD V0.1 / ZERO Interaction + Event Contract LOCK  
**Scope:** persistence, restore, snapshots and deterministic fixture for ZERO

## 1. Objective

This document defines the minimum persistent data model required to prove:

- one stable HNK Identity;
- one stable Personal Verse;
- one stable Malkuth World Instance;
- one Land + Home;
- one Avatar;
- one persistent Metatron Agent;
- VALI observation/learning;
- provisional Malkuth knowledge;
- one evidence-backed Skill;
- one finite Wood resource node;
- one created Wooden Box;
- one persistent spatial placement;
- one ownership transfer;
- one relationship history;
- one Chronicle/reflection;
- Rest/World Time;
- reload without tutorial reconstruction.

The schema is storage-technology neutral but should map cleanly to PostgreSQL/Supabase if that stack is selected later.

## 2. Persistence principle

> **Accepted domain events must be durable before the client is told they succeeded.**

Persistence authority hierarchy:

EVENT LEDGER
→ REDUCER STATE
→ SNAPSHOT
→ READ MODELS / UI

Snapshot is acceleration.

Event history remains authoritative.

## 3. Stable identity rules

Persistent IDs must survive:

- logout/login;
- browser/device changes;
- renderer changes;
- AI model/provider changes;
- snapshot rebuilds;
- application deploys.

IDs must not be generated from display names.

Examples:

- Metatron display name may change later;
- AGENT-ZERO-CARTOGRAPHER-001 remains stable.

## 4. Minimum logical persistence entities

Required logical records:

1. hnk_identities
2. personal_verses
3. worlds
4. lands
5. homes
6. actors
7. avatars
8. agents
9. persona_knowledge
10. language_knowledge
11. skill_records
12. skill_evidence
13. resource_nodes
14. inventories
15. inventory_entries
16. entity_instances
17. spatial_bindings
18. relationships
19. relationship_history
20. agent_memories
21. chronicle_entries
22. reflections
23. world_events
24. command_receipts
25. snapshots
26. world_time_state

Names are logical contracts, not final SQL table names.

## 5. hnk_identities

Minimum fields:

- identity_id
- primary_personal_verse_id
- created_at
- status
- schema_version

ZERO invariant:

one fixture HNK Identity → one primary Personal Verse.

No gameplay state should depend on account email/name as identity key.

## 6. personal_verses

Fields:

- verse_id
- hnk_identity_id
- primary_world_id
- created_at
- provenance
- schema_version

ZERO contains one Verse.

Architecture remains compatible with multiple Worlds later.

## 7. worlds

Fields:

- world_id
- verse_id
- world_template_ref
- world_ruleset_version
- world_state_version
- created_at
- provenance
- status

ZERO world:

WORLD-ZERO-MALKUTH-001

World Template and World Instance remain separate concepts.

## 8. lands and homes

LAND record:

- land_id
- world_id
- owner_scope_id
- logical_width = 18
- logical_height = 14
- permission_policy_version
- schema_version

HOME record:

- home_id
- land_id
- owner_scope_id
- logical_footprint
- spawn_binding
- status

ZERO IDs:

LAND-ZERO-MALKUTH-001  
HOME-ZERO-MALKUTH-001

## 9. actors

Common actor record:

- actor_id
- actor_type = AVATAR | AGENT
- world_id
- display_name
- active
- schema_version

This provides a shared target for:

- commands;
- ownership;
- relationships;
- events.

## 10. avatar state

Avatar fields:

- actor_id
- hnk_identity_id
- current_world_id
- current_land_id
- logical_position
- safe_position
- energy_rest_value
- state_version
- updated_at

The renderer may interpolate motion, but persisted safe position is domain state.

## 11. Agent state

Metatron Agent fields:

- actor_id = AGENT-ZERO-CARTOGRAPHER-001
- world_id
- display_name = Metatron
- home_context
- current_position
- goal_profile_ref
- cognition_profile_ref
- autonomy_policy_ref
- state_version

Agent identity must not contain a model-provider ID as identity.

Model provider belongs to cognition configuration, not actor identity.

## 12. Persona language knowledge

Language knowledge must preserve canonical source authority.

Fields:

- knowledge_record_id
- actor_id
- canonical_source = hnk-idioma
- canonical_id = LEX-013
- surface = VALI
- source_version
- source_authority = FROZEN
- observed_at_event_id
- learned_at_event_id nullable
- understanding_state = OBSERVED | KNOWN
- zero_binding = TRANSVERSAL
- curriculum_binding_l07 = false

The record must never silently rewrite the source language registry.

## 13. Provisional CODEX/HNK knowledge

Current package contract gap:

existing CodexRef requires canonicalId: string.

ZERO requires an explicit pending-reference state.

Recommended union:

### CanonicalCodexRef
- source = codex-hnk
- canonical_id = non-null
- version
- status = approved/candidate
- hash optional

### PendingCodexRef
- source = codex-hnk
- canonical_id = null
- internal_ref
- bridge_status = PENDING_CANONICAL_ID
- source_refs[]
- authority = SOURCE_SUPPORTED_DERIVATION

ZERO uses PendingCodexRef for:

ZERO-KNOWLEDGE-MALKUTH-MANIFESTATION-V0

No fake string such as TODO, MALKUTH-001 or UNKNOWN may be stored as if canonical.

## 14. Skill records

Skill record fields:

- skill_record_id
- actor_id
- skill_definition_id = SKILL-PRACTICAL-WORK-ZERO-V0
- derived_state
- evidence_count
- state_version
- updated_at

Skill state is reducer-derived from evidence.

Client cannot set derived_state directly.

## 15. Skill evidence

Fields:

- evidence_id
- skill_record_id
- source_event_id
- context_entity_id
- result
- quality
- guided
- created_at_world
- created_at_real
- provenance

Golden path requires at least one accepted evidence record caused by PracticeSucceeded.

## 16. Resource node

RESOURCE-NODE-WOOD-ZERO-001 fields:

- node_id
- world_id
- resource_definition_id = RESOURCE-WOOD-ZERO-V0
- initial_quantity = 4
- remaining_quantity
- logical_position
- state_version

Golden initial:

remaining_quantity = 4.

Golden completed:

remaining_quantity = 0.

## 17. Inventories

Each relevant owner may have an Inventory aggregate.

ZERO requires:

- Player inventory
- Metatron inventory
- Wooden Box storage inventory after placement

Inventory fields:

- inventory_id
- owner_id
- inventory_type
- capacity_policy
- state_version

Inventory entries:

- inventory_id
- resource_or_entity_ref
- quantity
- ownership_ref

For unique entities such as Wooden Box, prefer entity ownership/reference rather than stack quantity semantics.

## 18. Ownership

Ownership should be representable independently from possession/location.

Required relation:

- owned_object_or_resource
- owner_id
- ownership_type
- acquired_event_id
- status

For stackable Wood, ownership may be represented via authoritative inventory quantity if the inventory itself is owned.

For unique entities, explicit owner_id on the Entity Instance is recommended.

## 19. Entity instances

Wooden Box runtime entity fields:

- entity_instance_id
- definition_id = ENTITY-WOODEN-BOX-ZERO-V0
- world_id
- owner_id
- state
- created_event_id
- state_version
- provenance

Before placement:

spatial binding = none.

After placement:

same entity_instance_id gains one binding.

## 20. Spatial bindings

Fields:

- binding_id
- entity_instance_id
- world_id
- land_id
- logical_x
- logical_y
- orientation
- footprint_version
- placed_event_id
- state_version

ZERO invariant:

Entity identity survives movement/removal/replacement of spatial binding.

## 21. Relationships

Relationship record:

- relationship_id
- actor_a_id
- actor_b_id
- familiarity
- trust
- history_count
- state_version

ZERO UI may expose only a subset.

Full future vector remains compatible.

## 22. Relationship history

Fields:

- history_id
- relationship_id
- event_type
- source_event_id
- actor_from
- actor_to
- object_or_resource_ref
- quantity
- occurred_at_world
- occurred_at_real

Golden required record:

GIFT_RECEIVED caused by OwnershipTransferred.

## 23. Agent memories

Fields:

- memory_id
- agent_id
- memory_type
- source_event_id
- epistemic_source = DIRECT_OBSERVATION | TOLD | INFERRED | OTHER
- subject_refs[]
- summary_structured
- confidence
- occurred_at_world
- created_at_real
- schema_version

ZERO requires at least:

1. memory of Box placement
2. memory of Gift transfer

Rendered dialogue is not stored as truth unless separately needed as transcript/UI data.

## 24. Chronicle entries

Chronicle entry fields:

- chronicle_entry_id
- verse_id
- world_id
- entry_type
- source_event_refs[]
- derived_title_key
- derived_data
- created_at_world
- schema_version

Chronicle should preferably derive entries deterministically from events.

If materialized for performance, preserve source refs.

## 25. Human reflections

Fields:

- reflection_id
- author_actor_id
- linked_event_refs[]
- text
- authority_class = HUMAN_AUTHORED_INTERPRETATION
- visibility
- created_at

Schema must not contain a writable field that promotes reflection directly to CANON or EVIDENCE.

Promotion, if ever allowed, requires a separate governed process.

## 26. World time state

Fields:

- world_id
- world_time
- day_index
- time_scale_policy_version
- last_advanced_event_id
- state_version

Rest may advance World Time.

WorldDayAdvanced is emitted only if the time advance crosses the day boundary.

Exact Rest advance is a balancing configuration, not a canonical fact.

## 27. Event Ledger

world_events fields:

- sequence_no
- event_id
- event_type
- schema_version
- verse_id
- world_id
- actor_id nullable
- target_id nullable
- real_timestamp
- world_timestamp
- correlation_id
- causation_id nullable
- payload
- provenance
- checksum optional

Constraints:

- event_id unique;
- sequence_no monotonic within World stream;
- append-only;
- payload immutable;
- event type/version validated.

## 28. Command receipts

command_receipts protect idempotency.

Fields:

- command_id
- idempotency_key
- actor_id
- world_id
- command_type
- request_hash
- result_status
- result_event_ids[]
- rejection_code nullable
- created_at
- expires_or_retention_policy

Unique constraint:

world_id + actor_id + idempotency_key

must prevent duplicate side effects.

A retry returns original result when request hash matches.

A conflicting payload with same key must be rejected.

## 29. Snapshots

Snapshot fields:

- snapshot_id
- world_id
- stream_sequence_no
- schema_version
- state_hash
- state_payload or normalized snapshot refs
- created_at

Restore:

latest valid snapshot  
+ events after stream_sequence_no  
→ current state

Snapshot is invalid if checksum/hash fails.

System must be able to replay from ledger in test mode.

## 30. Persistence transaction boundaries

Atomic durability required for:

### GatherResource
- node decrement
- Player inventory increment
- ResourceGathered event
- idempotency receipt

### CraftEntity
- Wood decrement
- Wooden Box entity creation
- ResourceConsumed / EntityCreated events
- idempotency receipt

### PlaceEntity
- spatial binding creation/update
- EntityPlaced event
- idempotency receipt

### TransferOwnership
- Player Wood decrement
- Metatron Wood increment
- OwnershipTransferred
- idempotency receipt

Relationship history and Agent memory may be deterministic downstream handlers, but replay must never duplicate them.

## 31. Derived-event idempotency

Downstream projections/handlers use source-event uniqueness.

Examples:

- one EntityPlaced source event → at most one placement memory of that type for that Agent;
- one OwnershipTransferred source event → at most one corresponding gift history record;
- one PracticeSucceeded → at most one matching SkillEvidence record under ZERO rule.

Use unique keys such as:

agent_id + memory_type + source_event_id

relationship_id + history_type + source_event_id

skill_record_id + source_event_id

## 32. Schema versioning

Every durable contract carries schema version where evolution is expected.

Migration principles:

- do not mutate event meaning silently;
- old events remain readable;
- reducers can upcast legacy payload versions;
- snapshots may be invalidated/rebuilt after incompatible reducer/schema changes;
- stable IDs and provenance preserved.

## 33. Canonical bridge migration

When CODEX-HNK publishes the actual Malkuth canonical ID:

1. do not rewrite old Event Ledger history falsely;
2. add a governed bridge migration event/reference;
3. PendingCodexRef becomes linked to CanonicalCodexRef;
4. preserve original source-supported derivation provenance;
5. future reads may show canonical resolution.

Suggested event:

CanonicalReferenceResolved

This remains future implementation detail until actual canonical ID exists.

## 34. Deterministic fixture identity

Fixture:

HNK-ZERO-MALKUTH-FIXTURE-V1

Fixture version:

1.0.0

Fixture must not rely on:

- wall-clock randomness;
- production AI;
- random UUID generation during expected assertions;
- external network content;
- mutable remote canonical files at runtime.

All expected fixture IDs are stable.

## 35. Fixture stable IDs

Recommended deterministic IDs:

HNK Identity:
HNKID-ZERO-001

Personal Verse:
VERSE-ZERO-001

World:
WORLD-ZERO-MALKUTH-001

Land:
LAND-ZERO-MALKUTH-001

Home:
HOME-ZERO-MALKUTH-001

Avatar:
AVATAR-ZERO-PLAYER-001

Metatron:
AGENT-ZERO-CARTOGRAPHER-001

Bed:
ENTITY-BED-ZERO-001

Workbench:
ENTITY-WORKBENCH-ZERO-001

VALI Surface:
ENTITY-VALI-SURFACE-ZERO-001

Cartography Table:
ENTITY-CARTOGRAPHY-TABLE-ZERO-001

Wood Node:
RESOURCE-NODE-WOOD-ZERO-001

Player Inventory:
INVENTORY-ZERO-PLAYER-001

Metatron Inventory:
INVENTORY-ZERO-METATRON-001

Relationship:
REL-ZERO-PLAYER-METATRON-001

Skill:
SKILLREC-ZERO-PRACTICAL-WORK-001

World event stream:
STREAM-ZERO-MALKUTH-001

## 36. Fixture initial state

At fixture start:

### Identity
- HNK Identity exists.
- Personal Verse exists.
- World exists.
- Land/Home ownership exists.

### Avatar
- inside Home;
- safe spawn valid;
- Energy/Rest at configured baseline.

### Knowledge
- VALI form not yet observed;
- VALI meaning not known;
- provisional practical Malkuth knowledge not discovered.

### Skill
- zero Skill evidence;
- initial derived state.

### Wood
- Wood Node quantity = 4;
- Player Wood = 0;
- Metatron Wood = 0.

### Creation
- no Wooden Box instance exists;
- Home storage zone empty.

### Agent
- Metatron stable ID exists;
- no Box memory;
- no gift memory;
- deterministic goal/policy loaded.

### Relationship
- relationship record exists;
- no gift history.

### Chronicle
- no ZERO progress entries;
- no human reflection.

### Time
- deterministic fixture World Time set to a fixed value.

## 37. Fixture initial World Time

Recommended deterministic value:

Day 1, 08:00 local World Time.

The exact serialized representation should be implementation-defined but deterministic.

Real timestamp fields in fixture tests should use a fixed injected clock.

Example test clock:

2026-01-01T00:00:00Z

This is test provenance only, not story canon.

## 38. Golden path deterministic commands

The fixture test executes in order:

1. StartSession
2. ObserveLexeme LEX-013
3. RequestLexemeTeaching from Metatron
4. DiscoverKnowledge provisional Malkuth unit
5. GatherResource ×4 with four unique idempotency keys
6. AttemptPractice
7. CraftEntity Wooden Box
8. ValidatePlacement Home storage zone
9. PlaceEntity Wooden Box
10. OfferTransfer 1 Wood to Metatron
11. TransferOwnership after accepted offer
12. AppendReflection
13. Rest at Bed
14. EndSession
15. discard in-memory runtime
16. LoadPersonalVerse from persistence

The Rest step proves the Survival RPG-inspired optional time/recovery verb without making it required for earlier progression.

## 39. Deterministic event expectations

At minimum, the completed fixture should contain:

- IdentitySessionStarted
- LexemeFormObserved
- AgentTeachingOffered
- LexemeMeaningLearned
- KnowledgeUnitDiscovered
- ResourceGathered ×4
- PracticeAttempted
- PracticeSucceeded
- SkillEvidenceRecorded
- ResourceConsumed
- EntityCreated
- EntityPlaced
- AgentPerceivedWorldEvent
- AgentMemoryCreated for Box
- TransferOffered
- OwnershipTransferred
- RelationshipHistoryAppended
- AgentMemoryCreated for Gift
- HumanReflectionAppended
- AvatarRested
- optional WorldDayAdvanced depending configured Rest time
- AvatarPositionCheckpointed when applicable
- IdentitySessionEnded

Exact event count must be locked only after deciding whether projections emit separate durable events versus materialized deterministic views.

## 40. Golden state after command sequence

Required final state before reload:

### Resource conservation
- Wood Node = 0
- Player Wood = 0
- Metatron Wood = 1
- Wood consumed by Box = 3
- total reconciles to initial 4

### Box
- exactly 1 Wooden Box
- owner = Player
- stable instance ID
- placed in Home storage zone
- spatial binding valid

### Knowledge
- VALI = KNOWN
- source = LEX-013 FROZEN
- curriculumBindingL07 = false
- provisional Malkuth knowledge present
- canonicalRef = null

### Skill
- one or more valid evidence refs
- derived state advanced

### Agent
- same Metatron ID
- memory of Box
- memory of Gift
- owns 1 Wood

### Relationship
- gift history present
- source event references ownership transfer

### Chronicle
- derived discovery/creation/relationship records present
- human reflection remains interpretation

### Time/Rest
- Energy/Rest updated according to configured rule
- World Time advanced according to configured rule

## 41. Reload assertions

After discarding runtime memory and restoring from persistence:

Every golden state assertion must still pass.

Additionally:

- no duplicate Box created;
- no duplicate Wood appears;
- no duplicate Agent memory;
- no duplicate relationship history;
- no duplicate Skill evidence;
- event sequence remains unchanged;
- same stable IDs remain;
- read-model milestones derive correctly.

## 42. Replay assertion

A test-only full replay should be able to:

1. start from empty reducer state;
2. replay fixture event stream;
3. produce state equivalent to restored golden snapshot state.

Equivalence should compare normalized domain state, not timestamps/implementation caches that are explicitly non-semantic.

## 43. Idempotency test set

Required:

### Duplicate gather
Replay same GatherResource command with same idempotency key.

Expected:
- no second ResourceGathered;
- no extra Wood.

### Duplicate craft
Same CraftEntity idempotency key.

Expected:
- same result;
- one Box only.

### Duplicate place
Same PlaceEntity idempotency key.

Expected:
- one binding/event.

### Duplicate transfer
Same TransferOwnership idempotency key.

Expected:
- Player remains 0 Wood;
- Metatron remains 1 Wood;
- one ownership event.

## 44. Concurrency test set

At least:

- two GatherResource requests racing for last unit;
- two PlaceEntity requests for same Box/cell;
- duplicate transfer network retry;
- stale aggregate version update.

Only one valid mutation may win where operations conflict.

Other command receives deterministic rejection/conflict.

## 45. Failure/restart test

Required durability test:

1. PlaceEntity returns accepted/committed.
2. Simulate browser/runtime crash before EndSession.
3. Restart/load Verse.
4. Same Box must still be present.

This proves acknowledged event durability independent of graceful logout.

## 46. Pending canonical reference contract gap

Current contract package has:

CodexRef.canonicalId: string

ZERO needs pending Malkuth authority without fake canonical ID.

Before runtime implementation, contracts package must evolve to a discriminated union or equivalent representing:

- resolved canonical refs;
- pending canonical bridge refs.

This is a prerequisite for honest ZERO implementation.

## 47. Persistence implementation options

GDD does not yet hard-lock vendor.

Preferred characteristics:

- transactional relational storage;
- JSON/versioned event payload support;
- unique constraints;
- optimistic concurrency;
- durable append-only events;
- snapshot storage;
- row-level authorization support;
- straightforward TypeScript integration.

PostgreSQL/Supabase is a strong candidate because it aligns with existing Tehkné patterns, but final technical architecture lock remains separate.

## 48. Security requirements

Persistence layer must enforce:

- actor/world scope checks;
- server/domain ownership mutation;
- idempotency uniqueness;
- no direct client event insertion;
- no direct client Agent-memory writes;
- no direct client Skill state writes;
- no direct client canonical authority mutation;
- protected event history;
- private reflection access rules.

## 49. Observability

Persistence diagnostics should expose:

- last World sequence number;
- snapshot sequence number;
- reducer version;
- failed command/rejection code;
- idempotency hit/miss;
- replay mismatch;
- checksum mismatch;
- restore duration.

Observability cannot mutate truth.

## 50. Locked decisions

1. Event Ledger is the historical authority; snapshots accelerate restore.
2. Durable accepted events must survive session/browser failure before success is acknowledged.
3. Stable IDs are independent from display name, renderer and AI provider.
4. ZERO persistence uses explicit logical records for identity, Verse, World, actors, knowledge, skills, resources, entities, bindings, relationships, Agent memory, Chronicle, events, receipts and snapshots.
5. Pending Malkuth CODEX reference must be representable with canonical ID = null; fake canonical strings are forbidden.
6. Persona language knowledge preserves LEX-013 authority/version and explicitly keeps curriculumBindingL07 = false.
7. Skill state derives from durable Skill Evidence.
8. Resource Node quantity and inventory mutations are transactionally conserved.
9. Wooden Box identity and spatial binding are persisted separately.
10. Relationship history and Agent memories preserve source-event provenance.
11. Human reflection is persisted as INTERPRETATION, never automatic Evidence/Canon.
12. World Time and Energy/Rest persist and Rest may advance both according to configured rules.
13. Command receipts enforce idempotency and preserve accepted/rejected results.
14. Downstream projections use source-event uniqueness to avoid duplicated memory/history/evidence.
15. Snapshots include stream position/version/checksum and remain replay-verifiable.
16. HNK-ZERO-MALKUTH-FIXTURE-V1 uses fixed IDs, fixed starting state and injected deterministic clocks.
17. The golden fixture executes the complete ZERO loop without production AI or external network dependencies.
18. Reload after discarding runtime memory must reproduce the golden state exactly.
19. Full event replay must produce state equivalent to snapshot restore.
20. Idempotency, concurrency and crash-after-commit tests are release-blocking.
21. contracts package must add a truthful PendingCodexRef shape before ZERO runtime implementation.
22. Persistence vendor remains an implementation architecture decision; schema semantics are locked independently from vendor.
