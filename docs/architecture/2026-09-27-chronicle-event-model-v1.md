# HNK-VERSE — Chronicle / Event Model v1

Status: APPROVED ARCHITECTURAL BASELINE
Date: 2026-09-27
Parents:
- `docs/architecture/2026-09-27-hnk-verse-world-model-v2.md`
- `docs/architecture/2026-09-27-platform-state-vs-verse-state-contract-v1.md`
- `docs/architecture/2026-09-27-identity-avatar-presence-model-v1.md`
- `docs/architecture/2026-09-27-verse-capability-manifest-v1.md`

## 1. Purpose

Chronicle is the causal and temporal memory layer of HNK-VERSE. It records what occurred across platform, Verse and experience contexts while preserving identity, authority, provenance, ordering and lineage.

Chronicle is not CODEX-HNK canon.

Core invariant:

`RUNTIME EVENT != EVIDENCE != INTERPRETATION != CODEX-HNK CANON`

## 2. Event as immutable fact record

An Event represents an observed/accepted runtime occurrence under a declared authority and schema version.

Conceptual shape:

`Event = EventID + Type + Scope + Actor + Subject + Context + Time + Causation + Correlation + Payload + Authority + Provenance + SchemaVersion`

Once committed, the event record is immutable. Corrections are represented by subsequent events, not silent mutation.

## 3. Event identity

Every committed event has a globally/stably referable Event ID within the HNK-VERSE contract.

Event identity is distinct from:
- entity HNK-ID;
- session ID;
- transaction ID;
- correlation ID;
- causation ID;
- Chronicle stream ID.

## 4. Event scopes

Events declare ownership scope:

- `PLATFORM`
- `VERSE`
- `EXPERIENCE`
- `PROJECTION`
- `SYSTEM/INFRASTRUCTURE` where appropriate and non-sensitive.

Scope determines authority and retention/publishing policy. It does not determine canonical truth outside that scope.

## 5. Event classes

Initial event families include:

### Identity/session
- session opened/closed;
- presence entered/left/changed;
- avatar selected/changed;
- embodiment created/loaded/projected;
- delegation granted/revoked.

### World/entity
- entity created/updated/retired;
- relation created/removed;
- entity moved;
- object placed/edited;
- Space/world published/versioned.

### Transition
- portal requested;
- capability negotiation completed;
- transition accepted/rejected;
- Verse entered/exited;
- projection/translation/transfer/clone created.

### Experience/game
- quest/event state changed;
- encounter started/ended;
- Verse-defined gameplay event.

### Creator
- draft created;
- validation completed;
- publish requested/completed/rejected;
- version superseded.

Event taxonomies are versioned and extensible.

## 6. Time model

Chronicle distinguishes at least:

- event occurrence time, when known;
- record/commit time;
- Verse-local simulated time where applicable.

These values must not be silently conflated.

Conceptually:

`occurredAt != recordedAt != verseTime`

Clock precision and authority are explicit metadata where required.

## 7. Causation and correlation

### Causation

`causedByEventId` points to the immediate causal predecessor when one exists.

### Correlation

`correlationId` groups events participating in one higher-level operation, such as a portal transition.

Example:

`PortalRequested → CapabilityNegotiated → ProjectionCreated → VerseEntered`

All may share one correlation ID while retaining explicit causal links.

## 8. Causal graph, not only a linear log

Chronicle can be viewed chronologically, but its semantic structure is a causal graph.

An event may:
- have one immediate causal predecessor;
- reference multiple input/evidence events;
- produce multiple downstream events;
- belong to a branch/timeline;
- correlate with events emitted by another scope.

This supports distributed and cross-Verse behavior without pretending all events have one perfect global sequence.

## 9. Ordering

Chronicle does not require a single total ordering across the entire metaverse.

Ordering guarantees are scoped and explicit.

Possible guarantees:
- stream-local sequence;
- transaction-local sequence;
- causal ordering;
- Verse-local ordering;
- best-effort wall-clock ordering for presentation.

When two events are concurrent and no causal relation exists, Chronicle must not invent one.

## 10. Streams

Events may be indexed into streams such as:

- identity stream;
- entity stream;
- Space/world stream;
- Verse stream;
- experience stream;
- transition/correlation stream;
- creator/project stream.

One event may be referenced by multiple indexes without being duplicated as multiple authoritative events.

## 11. Commands, intents and events

Chronicle distinguishes requested action from resulting fact.

`INTENT/COMMAND != EVENT`

Example:

`RequestPortalTravel` is an intent/command.

Possible events:
- `PortalTravelAccepted`;
- `PortalTravelRejected`;
- `ProjectionCreated`;
- `VerseEntered`.

Rejected commands can produce events describing the rejection without pretending the requested world change occurred.

## 12. Observation and evidence

An event may have evidence/provenance references, but the event record is not automatically proof of claims outside its runtime authority.

Chronicle may preserve:
- source system;
- source entity/session;
- asset/data refs;
- validation result;
- signature/hash refs;
- external evidence refs where separately governed.

Core distinction:

`EVENT RECORD != EXTERNAL TRUTH CLAIM`

## 13. Interpretation/projection

Analytics, summaries, AI interpretations, memories, recommendations and narrative renderings are projections over Chronicle unless explicitly authored as events of their own class.

`CHRONICLE → QUERY/PROJECTION → INTERPRETATION`

An interpretation must not overwrite its source events.

## 14. Branches and timelines

Branch creation emits explicit lineage.

A branch/timeline Chronicle references:
- parent branch/timeline;
- branching event/point;
- source state/version;
- branch authority;
- resulting stream/context.

Events in one branch do not silently mutate another branch.

## 15. Replayability

Some events may be replayable to reconstruct deterministic state. Others may be audit/history only.

Capability metadata distinguishes:
- deterministic/replayable;
- replayable with referenced deterministic inputs;
- non-replayable observation;
- external side-effect record.

HNK-VERSE must not promise universal event sourcing merely because Chronicle stores events.

## 16. Idempotency

Commands/operations that may be retried should use idempotency/correlation mechanisms so network retries do not silently duplicate world effects.

Duplicate transport delivery does not imply duplicate committed Event IDs.

## 17. Event payloads

Payload schemas are typed and versioned.

Payload should contain the minimum state necessary to describe the occurrence plus references to larger entities/assets/state where appropriate.

Large mutable world snapshots should not be embedded into every event by default.

## 18. Privacy and redaction

Chronicle has visibility/access policy separate from event existence.

Sensitive data such as authentication credentials, secrets and unnecessary personal/device data must not be written into public/game Chronicle payloads.

Where redaction is required, the platform preserves audit-safe metadata according to policy without exposing protected payload content.

## 19. Authority

Every event identifies the authority/context allowed to assert that event type.

Examples:
- platform identity service may assert platform presence lifecycle;
- Alakazam Verse authority may assert Alakazam progression events;
- an experience runtime may assert its session-local events;
- creator publishing service may assert publish lifecycle results.

A client cannot make an event authoritative merely by submitting a payload.

## 20. Cross-Verse transitions

A cross-Verse operation uses one correlation chain spanning authorities.

Conceptual example:

`PortalRequested`
→ `TargetManifestResolved`
→ `CapabilityNegotiated`
→ `SourceStateEvaluated`
→ `ProjectionCreated` or `TranslationCreated`
→ `SourcePresenceExited`
→ `TargetEmbodimentLoaded`
→ `TargetPresenceEntered`
→ `TransitionCompleted`

Failure produces explicit failure/compensation events as appropriate.

## 21. Transactions and compensation

Not all distributed operations can be globally atomic.

Chronicle supports explicit transaction/correlation boundaries and compensating events.

`FAILED STEP != SILENT ROLLBACK`

If a committed effect must be undone, the undo/compensation is itself traceable.

## 22. Snapshots

Snapshots may accelerate state loading but do not replace event provenance.

A snapshot identifies:
- state scope;
- state/schema version;
- last included event/sequence;
- authority;
- integrity/provenance refs.

Snapshots are derived artifacts unless a contract explicitly gives them authoritative state semantics.

## 23. Chronicle queries

Candidate query dimensions:
- Event ID;
- HNK-ID/entity;
- actor;
- Verse;
- Space/world;
- event type;
- time range;
- correlation;
- causation;
- branch/timeline;
- authority;
- provenance.

Query results respect visibility and authorization.

## 24. Relationship to CODEX-HNK

Chronicle is runtime memory. CODEX-HNK is the central HNK registry/canon/Bible-Grimoire authority.

Therefore:

`CHRONICLE EVENT → possible evidence/reference → explicit review/governance → possible CODEX action`

There is no automatic promotion path.

`CHRONICLE != CODEX-HNK`

## 25. Relationship to TKN-OS

TKN-OS may preserve institutional know-how, development lineage, artifacts and project history from the HNK ecosystem. Chronicle may provide provenance references useful to that process, but runtime event storage and institutional knowledge remain distinct responsibilities.

## 26. Relationship to HNK-KODE

HNK-KODE may eventually:
- emit permitted Verse/runtime events;
- subscribe/query permitted Chronicle streams;
- define typed event handlers;
- react to events through capability-bounded runtime contracts.

HNK-KODE cannot forge event authority or bypass privacy/permission boundaries.

## 27. HNK-VERSE ZERO subset

ZERO should prove:

1. stable Event IDs;
2. platform, Verse and experience scopes;
3. identity/presence lifecycle events;
4. object placement/edit event;
5. portal transition correlation chain;
6. accepted projection or translation event;
7. rejected transfer/capability event;
8. causation/correlation references;
9. basic visibility policy;
10. query by identity/entity/Verse/correlation;
11. no automatic CODEX-HNK promotion.

## 28. Acceptance scenario — portal

A user in Hub enters Experience A.

Expected causal chain:

`PortalTravelRequested`
→ `CapabilityNegotiationSucceeded`
→ `ExternalGameplayStateRejected`
→ `AvatarProjectionCreated`
→ `HubPresenceExited`
→ `ExperienceEmbodimentLoaded`
→ `ExperiencePresenceEntered`
→ `PortalTravelCompleted`

All events share the transition correlation ID. Causal links remain explicit. Rejected gameplay state does not prevent accepted avatar projection if the manifest permits that combination.

## 29. Acceptance scenario — failure

If the target Verse becomes unavailable after negotiation but before entry:

- the failure is recorded;
- any committed temporary projection is expired/compensated according to policy;
- source identity/state ownership is preserved;
- presence resolves to a valid context/state;
- no false `VerseEntered` event is emitted.

## 30. Core invariants

1. Committed events are immutable.
2. Corrections/undo are new events.
3. Event identity is distinct from entity/session/correlation identity.
4. `INTENT/COMMAND != EVENT`.
5. Chronicle is a causal graph, not merely a timestamp list.
6. No global total order is invented where none exists.
7. Concurrent events remain concurrent unless causality is known.
8. Payload schemas are typed/versioned.
9. Event authority is explicit.
10. Chronicle visibility is permission controlled.
11. Replayability is declared, not assumed.
12. `RUNTIME EVENT != CODEX-HNK CANON`.

## 31. Next architecture artifact

With runtime causality and history defined, the next architecture artifact is:

**Creator / Publishing Lifecycle v1**

It will define drafts, ownership, collaboration, validation, test/sandbox, versions, publication, discovery, updates, rollback/supersession and the boundary between user-created content, Verse authority and platform distribution.