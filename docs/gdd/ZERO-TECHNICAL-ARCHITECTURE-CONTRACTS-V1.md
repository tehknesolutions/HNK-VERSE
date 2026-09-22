# HNK-VERSE — ZERO TECHNICAL ARCHITECTURE + CONTRACTS V1

**Status:** LOCKED — Creator-approved ZERO technical architecture + contracts V1  
**Date:** 2026-09-22  
**Parent:** HNK-VERSE GDD V0.1 / ZERO Persistence Schema + Fixture V1 LOCK  
**Scope:** technical boundaries and first executable TypeScript contracts

## 1. Objective

Translate the locked ZERO design into a small technical core that can be executed, replayed, persisted and rendered without collapsing domain truth into UI state.

The first implementation target is not a complete game client.

It is a deterministic executable spine:

CONTRACTS  
→ DOMAIN REDUCER  
→ FIXTURE EVENT STREAM  
→ GOLDEN STATE  
→ PERSISTENCE PORTS  
→ FUTURE COMMAND HANDLERS / ADAPTERS  
→ RENDERER / UI

## 2. Core architecture

apps/web  
→ packages/ui  
→ packages/renderer  
→ domain commands / queries  
→ packages/domain  
→ packages/persistence  
→ durable adapter

External canonical sources:

CODEX-HNK  
→ codex-bridge  
→ domain

HNK-Idioma  
→ language-bridge  
→ domain

Agents:

agent cognition/runtime  
→ validated domain commands  
→ domain events

Never:

renderer → authoritative mutation

LLM output → direct event append

client inventory → authoritative quantity

## 3. Package responsibilities

### @hnk-verse/contracts — IMPLEMENTED BOOTSTRAP

Owns wire/domain boundary contracts that must remain stable and versionable.

Now includes:

- AuthorityStatus;
- CanonicalCodexRef;
- PendingCodexRef;
- CodexRef union;
- LanguageRef;
- HnkCommand;
- HnkEvent;
- CommandReceipt;
- ZERO command registry;
- ZERO event registry;
- rejection-code registry;
- stable ZERO IDs;
- pending Malkuth CODEX reference;
- VALI language reference;
- Lucidity invariants.

Critical correction:

CodexRef no longer requires every reference to fake a canonical ID.

ZERO may truthfully represent:

canonicalId = null  
resolution = pending  
bridgeStatus = PENDING_CANONICAL_ID

## 4. @hnk-verse/domain — IMPLEMENTED BOOTSTRAP

Owns deterministic World-state semantics.

Now includes:

- ZeroWorldState;
- reduceZeroEvent;
- replayZeroEvents;
- derived progression predicates.

Current reducer handles the first authoritative ZERO state changes:

- VALI observed;
- VALI known;
- practical Malkuth knowledge discovered;
- Wood gathered;
- Wood consumed;
- Skill Evidence recorded;
- entity created;
- entity placed;
- ownership transferred;
- Agent memory created;
- relationship history appended;
- human reflection appended;
- Rest/World Time state.

The reducer does not own UI text, animation or dialogue prose.

## 5. Derived milestone predicates

Implemented predicate surface:

- hasObservedVali
- knowsVali
- hasPracticalKnowledge
- hasGatheredRequiredWood
- hasFirstSkillEvidence
- ownsWoodenBox
- hasPlacedWoodenBox
- metatronRemembersBox
- hasCompletedGift
- hasChronicleReflection

These prove:

PROGRESS = DERIVED DOMAIN FACTS

not:

tutorialStep = truth.

## 6. @hnk-verse/persistence — IMPLEMENTED PORTS

Owns storage interfaces, not vendor decisions.

Current ports:

### EventStore
- append with expected sequence;
- read after sequence;
- latest sequence.

### SnapshotStore
- load latest;
- save snapshot.

### CommandReceiptStore
- find by world/actor/idempotency key.

Also implemented:

restoreFromSnapshot

which reconstructs:

snapshot state + later events → current state.

No PostgreSQL/Supabase adapter is committed yet.

## 7. @hnk-verse/fixtures — IMPLEMENTED BOOTSTRAP

Owns deterministic test/game-development fixtures.

Current fixture:

HNK-ZERO-MALKUTH-FIXTURE-V1  
version 1.0.0

It defines:

- fixed HNK/Verse/World/Home/Agent IDs;
- fixed injected real clock;
- fixed initial World Time;
- Wood node = 4;
- initial knowledge = unknown;
- no initial Box;
- no Agent Box/Gift memory;
- complete deterministic event stream;
- final golden state via replay;
- assertion function for golden invariants.

## 8. Fixture event stream

Current deterministic stream includes:

IdentitySessionStarted  
→ LexemeFormObserved  
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
→ AgentMemoryCreated(Box)  
→ TransferOffered  
→ OwnershipTransferred  
→ RelationshipHistoryAppended  
→ AgentMemoryCreated(Gift)  
→ HumanReflectionAppended  
→ AvatarRested  
→ IdentitySessionEnded

This is a deterministic development fixture, not a claim that every derived production event must have exactly this final shape.

## 9. Golden-state invariants implemented in fixture

The fixture assertion currently requires:

- VALI observed;
- VALI meaning known;
- provisional practical knowledge discovered;
- Wood node = 0;
- Player Wood = 0;
- Metatron Wood = 1;
- exactly one Skill Evidence record;
- exactly one Wooden Box instance;
- Player owns the Box;
- Box has a spatial binding;
- Metatron has Box + Gift memories;
- exactly one relationship Gift history;
- exactly one fixture reflection;
- Rest restores fixture Energy;
- World Time advances.

## 10. Renderer independence

Renderer consumes authoritative/derived state.

Example:

domain entity:
ENTITY-WOODEN-BOX-ZERO-001

spatial binding:
land + logical coordinates + orientation

renderer:
selects runtime asset / sprite / projection

The entity remains the same if:

- art changes;
- sprite changes;
- 2D renderer becomes richer 2.5D;
- occlusion implementation changes.

## 11. Command handling — NEXT IMPLEMENTATION

Contracts exist, but authoritative command handlers are not yet implemented.

Next handlers should include:

- ObserveLexeme;
- RequestLexemeTeaching;
- DiscoverKnowledge;
- GatherResource;
- AttemptPractice;
- CraftEntity;
- ValidatePlacement;
- PlaceEntity;
- OfferTransfer;
- TransferOwnership;
- AppendReflection;
- Rest.

A command handler must:

1. load relevant authoritative state;
2. validate actor/world/version;
3. validate domain prerequisites;
4. produce event proposal(s);
5. persist atomically with command receipt;
6. return accepted/rejected result;
7. never mutate renderer/client state as source of truth.

## 12. In-memory persistence adapter — NEXT IMPLEMENTATION

Before a database vendor is locked, implement a deterministic in-memory adapter for:

- EventStore;
- SnapshotStore;
- CommandReceiptStore.

Purpose:

- execute command-handler unit tests;
- prove optimistic sequence checks;
- prove idempotency;
- prove snapshot restore;
- prove event replay;
- prove crash/restart simulation.

This adapter is test infrastructure, not production persistence.

## 13. Production persistence adapter — LATER TECHNICAL LOCK

Candidate:

PostgreSQL/Supabase.

Do not implement vendor-specific schema until:

- ports are green;
- fixture replay is green;
- command contracts are stable enough;
- transaction boundaries are tested in-memory.

Production adapter requirements:

- append-only World stream;
- transactions;
- unique idempotency constraints;
- optimistic concurrency;
- JSON/versioned payloads;
- snapshots;
- authorization/RLS;
- migrations;
- diagnostics.

## 14. Event application vs event creation

Reducer:
EVENT → STATE

Command handler:
STATE + COMMAND → ACCEPT / REJECT + EVENTS

These are separate.

The reducer must not validate whether an event should have existed.

The command handler must not silently mutate state without producing authoritative events.

## 15. Read models

Read models may derive:

- actionable Workbench processes;
- milestone guidance;
- relationship summary;
- Chronicle;
- inventory display;
- contextual interactions;
- placement validation hints.

Read models are disposable/rebuildable projections.

They do not become Event Ledger truth.

## 16. Agent boundary

Metatron runtime owns:

- cognition;
- decision policy;
- dialogue generation;
- memory retrieval strategy.

Domain owns:

- Agent stable identity;
- Agent permissions;
- authoritative memory records;
- inventory;
- relationship history;
- accepted actions.

Metatron cannot append arbitrary World events.

## 17. CODEX bridge boundary

Pending ZERO Malkuth reference is now representable by type.

Current fixture ref:

internalRef:
ZERO-KNOWLEDGE-MALKUTH-MANIFESTATION-V0

canonicalId:
null

bridgeStatus:
PENDING_CANONICAL_ID

When a real CODEX-HNK ID exists:

- create canonical-resolution migration;
- preserve historical provenance;
- do not rewrite old events dishonestly.

## 18. Language bridge boundary

VALI is represented by:

canonicalId = LEX-013  
surface = VALI  
authority = FROZEN  
zeroBinding = TRANSVERSAL at event/state level  
curriculumBindingL07 = false

The language bridge consumes the source registry.

The game may not silently alter source meaning or promote new grammar.

## 19. Tool/capability seed

Survival RPG reference absorption adds an important future boundary:

recipe knowledge alone is not universal execution authority.

The ZERO Workbench is the first capability-bearing fixture.

Future generalization:

KNOWLEDGE  
+ TOOL CAPABILITY  
+ TARGET/WORLD PROPERTY  
+ SKILL  
+ PERMISSION  
→ ACTION.

ZERO proves the concept only through Workbench + Wooden Box.

## 20. Testing layers

### Contract tests
Validate discriminated refs, IDs, registries and event/command shape.

### Reducer tests
Given events, resulting state is deterministic.

### Fixture replay test
Initial state + fixture events = golden state.

### Command-handler tests
Valid commands emit expected events; invalid commands return reason codes.

### Idempotency tests
Retries do not duplicate resources/entities/transfers.

### Concurrency tests
Stale sequence/version loses deterministically.

### Persistence restore tests
Snapshot + events = same state as full replay.

### E2E domain test
Golden command path reaches golden state without renderer or production AI.

### UI E2E later
Renderer/browser drives same command surface and observes same domain result.

## 21. Runtime package order

Recommended implementation order:

1. contracts — bootstrap present;
2. domain reducer — bootstrap present;
3. fixtures — bootstrap present;
4. persistence ports — bootstrap present;
5. command handlers;
6. in-memory persistence;
7. contract/reducer/fixture tests;
8. command/idempotency/concurrency tests;
9. production persistence adapter;
10. codex-bridge;
11. language-bridge;
12. Agent deterministic runtime;
13. renderer projection;
14. Web/PWA interaction loop;
15. production AI enrichment after deterministic Agent path is green.

## 22. Build discipline

No package should be created merely to match an architecture diagram.

Create a package when it owns a real boundary and executable contract.

Likewise:

- no microservices by default;
- no event broker required for ZERO;
- no distributed CQRS infrastructure required;
- no unrestricted scripting;
- no LLM dependency for deterministic tests.

The architecture is modular within one deployable product first.

## 23. Current code status

Implemented in this proposal branch:

- packages/contracts/src/index.ts expanded;
- packages/domain scaffolded;
- packages/domain/src/zero-state.ts;
- packages/persistence scaffolded;
- packages/persistence/src/ports.ts;
- packages/fixtures scaffolded;
- packages/fixtures/src/zero-fixture-v1.ts.

Not yet claimed green:

- TypeScript compilation in CI;
- unit tests;
- command handlers;
- in-memory adapter;
- database adapter;
- browser runtime.

Those require the next implementation pass and must not be reported as complete until actually executed.

## 24. Locked decisions

1. TypeScript contracts are the first executable boundary derived from the GDD locks.
2. CodexRef is a resolved/pending union; pending Malkuth uses canonicalId = null.
3. ZERO command/event/rejection registries are explicit and versionable.
4. Stable fixture IDs live in contracts and must not derive from display names.
5. Domain reducer is deterministic and presentation-independent.
6. ZERO milestones are pure derived predicates.
7. Persistence is initially expressed through vendor-neutral ports.
8. Restore is snapshot + subsequent event replay.
9. Fixture V1 owns a fixed clock, fixed IDs, fixed initial state and deterministic event stream.
10. Golden state assertions must remain executable independent from renderer and production AI.
11. Command handling is a separate layer from event reduction.
12. In-memory persistence is the next adapter and must precede vendor-specific persistence.
13. Production persistence vendor remains uncommitted in this lock.
14. Agent runtime may propose actions but cannot bypass domain commands.
15. CODEX pending-reference resolution preserves provenance rather than rewriting history.
16. VALI remains a consumed FROZEN source asset with no false L07 binding.
17. Workbench is the first capability-bearing world fixture and seed of future Tool Capability design.
18. Current bootstrap code is not declared CI-green until compilation/tests are actually executed.
