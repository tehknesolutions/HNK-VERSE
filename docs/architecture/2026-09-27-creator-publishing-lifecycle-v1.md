# HNK-VERSE — Creator / Publishing Lifecycle v1

Status: APPROVED ARCHITECTURAL BASELINE
Date: 2026-09-27
Parents:
- `docs/product/2026-09-27-hnk-verse-pdd-gdd-2.0.md`
- `docs/architecture/2026-09-27-hnk-verse-world-model-v2.md`
- `docs/architecture/2026-09-27-platform-state-vs-verse-state-contract-v1.md`
- `docs/architecture/2026-09-27-identity-avatar-presence-model-v1.md`
- `docs/architecture/2026-09-27-verse-capability-manifest-v1.md`
- `docs/architecture/2026-09-27-chronicle-event-model-v1.md`

## 1. Purpose

This contract defines how HNK-VERSE participants move from consuming experiences to creating, testing, versioning, publishing and evolving objects, spaces, worlds, systems and experiences.

Core creator loop:

`INTENTION → CREATE → EDIT → VALIDATE → TEST → PUBLISH → DISCOVER/ENTER → OBSERVE → EVOLVE`

Creation is progressive: code is not required for basic creation, while advanced creators/developers may eventually use HNK-KODE and the Verse SDK.

## 2. Creation scales

The platform supports creation at multiple scales:

`OBJECT → SPACE/ROOM → LOT/AREA → CITY → REGION → WORLD → VERSE`

and experience composition:

`EVENT → QUEST → SYSTEM → GAME MODE → EXPERIENCE/GAME → VERSE`

Tools may skip levels. A creator can begin with a room or object without understanding cosmological structure.

## 3. Creator artifact

A Creator Artifact is any authored unit managed by this lifecycle.

Conceptually:

`Artifact = ArtifactID + Type + Owner + Contributors + Source + Version + State + Dependencies + Capabilities + Provenance + Validation + PublicationRefs`

Candidate artifact types:
- object/entity template;
- asset/presentation package;
- Space/room;
- map/area;
- world graph;
- event/quest;
- NPC/entity definition;
- system/game mode;
- experience;
- Verse package;
- HNK-KODE artifact where supported.

## 4. Artifact identity and version identity

Artifact identity remains stable across revisions.

Each immutable published/testable revision receives a distinct version identity.

`ARTIFACT ID != VERSION ID`

Editing a draft does not silently mutate an already published version.

## 5. Lifecycle states

Initial lifecycle:

`DRAFT → VALIDATING → VALIDATED → TESTING → READY → PUBLISHED → SUPERSEDED/RETIRED`

Failure/side states include:
- `VALIDATION_FAILED`;
- `TEST_FAILED`;
- `PUBLISH_REJECTED`;
- `SUSPENDED` where governance/moderation requires it;
- `ARCHIVED`.

Transitions are explicit and Chronicle-visible where appropriate.

## 6. Drafts

Drafts are mutable working state.

A draft has:
- owner;
- collaborators;
- working version/revision;
- target Verse/context;
- dependencies;
- capability requirements;
- source assets/data;
- provenance.

Draft existence does not make content public or canonical.

`DRAFT != PUBLISHED != CODEX-HNK CANON`

## 7. Ownership and collaboration

Ownership and edit/control permissions are distinct.

Candidate roles on an artifact:
- Owner;
- Maintainer;
- Editor;
- Contributor;
- Tester;
- Reviewer;
- Publisher.

`OWNER != EDITOR != PUBLISHER`

Collaboration grants are scoped, revocable and traceable.

## 8. Validation

Validation checks whether an artifact satisfies structural and policy requirements before runtime testing/publication.

Candidate checks:
- schema validity;
- World Model validity;
- HNK-ID/reference integrity;
- dependency resolution;
- capability compatibility;
- permission/ownership integrity;
- asset compatibility;
- state-boundary compliance;
- security/runtime restrictions;
- HNK-KODE compile/contract validation where applicable.

Validation success does not prove gameplay quality or fun.

## 9. Test/Sandbox

Creators need an isolated environment where artifacts can run without mutating published state.

`DRAFT/REVISION → SANDBOX INSTANCE → TEST EVENTS → TEST RESULT`

Sandbox characteristics:
- isolated state;
- explicit test identities/presences or safe projections;
- no silent writes to published Verse state;
- Chronicle/test provenance;
- capability constraints equivalent to or stricter than target runtime;
- deterministic fixtures where useful.

## 10. Preview and playtest

Preview is optimized for creator inspection.

Playtest is optimized for experiencing the artifact under runtime-like conditions.

They may share infrastructure but remain distinct modes.

A creator may invite authorized testers to a private/unlisted playtest without publishing publicly.

## 11. Readiness gate

An artifact becomes `READY` only after required validation and test gates for its type/context pass.

The target Verse Capability Manifest may define additional readiness requirements.

A simple object can have a lighter gate than a full Verse package.

## 12. Publication

Publication creates an immutable distributable version/ref from an approved revision.

Conceptual operation:

`READY REVISION + PUBLISH AUTHORITY + TARGET + VISIBILITY → PUBLISHED VERSION`

Publication records:
- Artifact ID;
- Version ID;
- publisher;
- target context;
- dependency lock/refs;
- capability requirements;
- provenance;
- visibility/discovery policy;
- publication time;
- Chronicle correlation.

## 13. Visibility/distribution

Candidate visibility states:
- private;
- collaborators only;
- invite-only;
- unlisted;
- public;
- Verse-internal;
- platform-discoverable.

Visibility is independent from ownership.

`PUBLIC != PLATFORM-OWNED`

## 14. Discovery

Published artifacts may become discoverable through platform/Verse catalogs, portals, creator profiles, tags/categories, search or curated surfaces.

Discovery metadata is a projection over published artifacts and must not redefine their underlying authority/state.

Ranking/recommendation systems, if added, are separate from publication authority.

## 15. Dependencies

Published versions lock or explicitly range their dependencies according to the artifact contract.

Dependencies may include:
- platform contract versions;
- Verse SDK versions;
- Verse capability requirements;
- asset packages;
- entity/templates;
- HNK-KODE runtime/compiler compatibility;
- other creator artifacts.

A dependency update must not silently mutate an immutable published version.

## 16. Updates

Updating a published artifact creates a new version.

`v1 PUBLISHED → new DRAFT/REVISION → VALIDATE/TEST → v2 PUBLISHED`

Consumers/worlds may:
- stay pinned to v1;
- opt into compatible updates;
- follow a declared release channel;
- migrate through explicit rules.

## 17. Supersession and rollback

A newer version may supersede an older one without erasing history.

Rollback means changing the active/reference target to a prior valid version or publishing a corrective version; it does not rewrite Chronicle history.

`ROLLBACK != DELETE HISTORY`

## 18. Retirement and deletion

Retiring an artifact stops/restricts new use according to policy while preserving required provenance/history.

Deletion of mutable drafts may be permitted by policy. Published artifacts referenced by worlds/events require referential integrity and retention/tombstone rules.

A referenced HNK-ID/version must not silently point to unrelated content after deletion.

## 19. Fork / Remix / Derivation

Where permissions/license/policy permit, a creator may derive a new artifact from another.

Derivation creates:
- new Artifact ID;
- source lineage/provenance;
- declared dependency or copied-source relationship;
- independent ownership according to policy.

`FORK/REMIX != MUTATE SOURCE`

## 20. Templates

Templates accelerate creation without forcing all creators to start from blank worlds.

Candidate templates:
- social room;
- personal space;
- RPG map;
- quest/event;
- NPC;
- game mode;
- Verse starter.

Instantiating a template creates a new artifact with provenance to the template/version.

## 21. No-code → low-code → full-code continuum

HNK-VERSE creator tooling should support progressive power:

### No-code
- place objects;
- edit properties;
- build rooms/maps;
- connect portals;
- configure templates/events.

### Low-code / visual logic
- event graphs;
- triggers;
- conditions;
- state transitions;
- reusable behaviors.

### Full-code
- HNK-KODE and Verse SDK integration where supported.

The existence of full-code capability must not make basic creation depend on programming.

## 22. HNK-KODE relationship

HNK-KODE is a sibling/transversal language project.

When a Verse supports it, Creator artifacts may reference compiled/validated HNK-KODE outputs.

HNK-KODE does not bypass:
- Creator permissions;
- validation;
- sandboxing;
- Verse Capability Manifest;
- publishing authority;
- runtime capability restrictions.

## 23. Verse SDK relationship

The Verse SDK exposes stable platform contracts for:
- artifact schemas;
- validation hooks;
- sandbox/test lifecycle;
- publish/version operations;
- capability negotiation;
- world/entity references;
- Chronicle integration;
- runtime loading.

A Verse may provide additional creator extensions while remaining within platform contracts.

## 24. Moderation/governance boundary

Publication and discoverability may require moderation/governance checks depending on artifact type, visibility and platform policy.

Moderation is not CODEX-HNK canonization.

`MODERATION APPROVAL != HNK CANON`

Platform safety/distribution authority and Verse narrative/canonical authority remain distinct.

## 25. Economy boundary

Creator artifacts may eventually participate in Verse/platform economy interfaces, but creation/publication must not assume monetization.

Commerce, payments, royalties or marketplaces require separate economic/legal/security contracts.

`PUBLISHABLE != SELLABLE`

## 26. Chronicle events

Candidate lifecycle events:
- `ArtifactCreated`;
- `CollaboratorGranted`;
- `RevisionSaved`;
- `ValidationStarted`;
- `ValidationPassed/Failed`;
- `SandboxCreated`;
- `PlaytestStarted/Completed`;
- `ArtifactReady`;
- `PublishRequested`;
- `ArtifactPublished`;
- `VersionSuperseded`;
- `ArtifactRetired`;
- `ArtifactForked`.

Commands/intents remain distinct from resulting events.

## 27. HNK-VERSE ZERO subset

ZERO should prove a minimal but complete creator loop:

1. user owns a personal Space;
2. user enters edit/create mode;
3. user places or edits one object Entity;
4. change is stored as mutable draft/working state;
5. validation succeeds/fails explicitly;
6. creator previews/tests the change;
7. creator publishes a version of the Space/object configuration;
8. published state persists after leaving/re-entering;
9. Chronicle records lifecycle/world events;
10. published version remains separate from subsequent draft edits.

This is enough to prove HNK-VERSE is not only consumptive.

## 28. Acceptance scenario — personal room

A Creator opens their personal Space, places an object, changes its transform/property and saves.

Expected:

`ArtifactCreated/Loaded → RevisionSaved → ValidationPassed → Sandbox/Preview → ArtifactReady → PublishRequested → ArtifactPublished`

After publication, a new edit creates a new working revision while the published version remains stable.

## 29. Acceptance scenario — incompatible capability

A creator adds a feature requiring `timeline.supported`, but the target Verse Manifest declares timelines unsupported.

Validation fails with an explicit capability diagnostic. The platform does not silently remove or reinterpret the feature.

## 30. Acceptance scenario — fork

Creator B forks a remixable room/template from Creator A.

The fork receives a new Artifact ID, preserves source/version provenance and cannot mutate Creator A's artifact without separate authority.

## 31. Core invariants

1. `ARTIFACT ID != VERSION ID`.
2. Drafts are mutable; published versions are immutable.
3. `OWNER != EDITOR != PUBLISHER`.
4. Validation is not playtesting.
5. Sandbox state does not silently mutate published state.
6. Publishing creates a traceable version/ref.
7. Updates create new versions rather than rewriting published history.
8. Rollback does not delete history.
9. Fork/remix preserves lineage and receives independent identity.
10. No-code creation remains possible even when HNK-KODE exists.
11. `PUBLISHED != CODEX-HNK CANON`.
12. `PUBLISHABLE != SELLABLE`.

## 32. Next architecture artifact

With creation and publication defined, the next major architecture artifact is:

**HNK-VERSE ZERO Vertical Slice Specification v1**

It will combine World Model, state boundaries, identity/avatar/presence, Verse Capability Manifests, Chronicle and Creator Lifecycle into one executable product slice before the Verse SDK v0.1 contract is frozen.