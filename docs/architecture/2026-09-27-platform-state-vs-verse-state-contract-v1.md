# HNK-VERSE — Platform State vs Verse State Contract v1

Status: APPROVED ARCHITECTURAL BASELINE
Date: 2026-09-27
Parent: `docs/architecture/2026-09-27-hnk-verse-world-model-v2.md`

## 1. Purpose

This contract defines ownership, persistence, transfer, projection and translation rules for state crossing boundaries inside the HNK-VERSE metaverse platform.

Core rule:

> Crossing a boundary preserves identity by default; gameplay state crosses only through explicit contracts.

## 2. State scopes

### Platform State

Owned by HNK-VERSE platform contracts and potentially reusable across Verses.

Examples:
- persistent identity reference;
- platform profile;
- platform permissions;
- presence references;
- cross-Verse social references where supported;
- stable HNK-ID references;
- platform-level provenance and Chronicle references.

### Verse State

Owned by one Verse.

Examples:
- progression/level;
- inventory;
- powers/abilities;
- Verse economy;
- factions/reputation;
- world simulation state;
- Verse-specific relationships and mechanics.

### Experience State

Owned by a bounded experience within a Verse/context.

Examples:
- quest step;
- match/session state;
- encounter state;
- temporary modifiers;
- local score;
- ephemeral entities.

### Projection State

A contextual representation of an identity/entity/state inside another context without transferring ownership of the source state.

Examples:
- cosmetic representation of an external item;
- translated avatar embodiment;
- read-only badge/title derived from another Verse;
- temporary local equivalent of an external capability.

## 3. Core invariants

`IDENTITY PRESERVATION != STATE TRANSFER`

`REFERENCE != COPY`

`COPY != PROJECTION`

`PROJECTION != OWNERSHIP`

`TRANSLATION != EQUIVALENCE`

`PLATFORM STATE != VERSE STATE != EXPERIENCE STATE != PROJECTION STATE`

No state changes ownership implicitly.

## 4. Boundary crossing protocol

A transition between contexts follows:

`SOURCE CONTEXT → IDENTITY RESOLUTION → TARGET CAPABILITY MANIFEST → TRANSFER POLICY → PROJECTION/TRANSLATION → TARGET STATE → CHRONICLE`

Required checks:
1. resolve stable identity;
2. resolve source state ownership;
3. inspect target capabilities;
4. evaluate explicit transfer policies;
5. reject, reference, project, translate or transfer each requested element;
6. preserve provenance;
7. emit traceable transition result.

## 5. Transfer outcomes

Every candidate state element crossing a boundary receives one explicit outcome:

### REJECT
Target does not accept the element.

### REFERENCE
Target may reference source identity/state without importing it.

### PROJECT
Target creates a contextual representation while source remains authoritative.

### TRANSLATE
Target maps source semantics into a target-owned representation under a declared mapping/version.

### TRANSFER
Ownership/state actually crosses the boundary. This is exceptional and requires explicit permission from source and target contracts.

### CLONE
A new independent entity/state is created with provenance to the source. Clone receives distinct identity unless an explicit identity policy states otherwise.

## 6. Example: item crossing Verses

An `Alakazam Sword` entering HNK-Alchemy may be handled as:

- REJECT — unavailable there;
- REFERENCE — visible in profile/history only;
- PROJECT — cosmetic representation;
- TRANSLATE — mapped to an allowed HNK-Alchemy object/effect;
- TRANSFER — only if both contracts explicitly support shared ownership/state;
- CLONE — create a new Alchemy-owned derivative with lineage.

The target Verse must not silently inherit Alakazam combat semantics.

## 7. Avatar and embodiment

Persistent identity may have different embodiments across Verses.

`PLATFORM IDENTITY → VERSE EMBODIMENT → EXPERIENCE PROJECTION`

Examples:
- one platform identity may appear as a humanoid avatar in the Hub;
- as a Verse-specific character in Alakazam;
- as another representation in HNK-Alchemy.

Visual continuity is optional. Identity continuity is explicit.

## 8. Capability negotiation

Each Verse/context publishes a versioned Capability Manifest describing supported platform interactions.

Candidate declarations:
- accepts platform avatar;
- supports custom embodiment;
- accepts cosmetic projections;
- supports external item references;
- supports translated items;
- supports shared social presence;
- supports persistent creator objects;
- supports Chronicle export;
- supports external scripts/HNK-KODE artifacts;
- supports branch/timeline transitions.

Absence of a capability means unsupported by default.

## 9. Transfer policy

Transfer policies are explicit, versioned and directional.

A policy from Verse A to Verse B does not imply the reverse policy.

Conceptual key:

`source Verse + target Verse + state type + contract version → policy`

Policies must identify:
- allowed outcome(s);
- required permissions;
- schema versions;
- translation mapper if applicable;
- provenance requirements;
- persistence scope;
- rollback/error behavior.

## 10. Translation

Translation maps source semantics into target semantics without asserting they are identical.

A translation record contains conceptually:

`SourceRef + SourceSchema + TargetSchema + MapperVersion + ResultRef + Provenance`

Translation must be deterministic where the same contract/version promises determinism.

Lossy translation must be marked as lossy.

## 11. Projection

Projection creates a contextual representation whose authority remains elsewhere.

Projection must retain:
- source HNK-ID/ref;
- source authority;
- target context;
- projection type;
- projection version;
- lifecycle/expiry;
- provenance.

Destroying a projection must not destroy its source entity unless an explicit ownership contract states otherwise.

## 12. Conflict resolution

State conflicts are resolved by ownership authority first, not last-write-wins across unrelated scopes.

Examples:
- Platform owns platform profile fields.
- Alakazam owns Alakazam progression.
- HNK-Alchemy owns Alchemy progression.
- An experience owns its temporary session state.

Cross-scope writes require a declared contract/action.

## 13. Persistence rules

Persistence scopes remain explicit:
- ephemeral;
- experience-local;
- Verse-persistent;
- platform-persistent.

Projection persistence cannot exceed source/contract validity unless converted into a new owned artifact through an explicit operation.

## 14. Security and permissions

Boundary crossing never grants permissions merely because identity is preserved.

Target context reevaluates:
- access;
- role;
- ownership;
- edit rights;
- execution capabilities;
- social visibility;
- creator/developer permissions.

`SAME IDENTITY != SAME PERMISSIONS`

## 15. Chronicle and provenance

Boundary operations emit Chronicle/provenance events sufficient to reconstruct:
- source context;
- target context;
- identity;
- requested transfer set;
- applied policies;
- rejected elements;
- projections/translations created;
- resulting state refs;
- contract versions.

Runtime Chronicle remains distinct from CODEX-HNK canon.

## 16. Offline/failure behavior

A boundary transition must fail safely when target contracts or required authority data cannot be resolved.

No silent fallback may convert an unsupported transfer into a clone, projection or canonical artifact.

Partial transitions require explicit transactional semantics or compensating events.

## 17. HNK-KODE relationship

HNK-KODE may eventually declare or invoke transfer/projection operations through stable HNK-VERSE APIs/SDK contracts.

The language cannot bypass ownership, authority, permission or capability negotiation merely because it can express an operation.

## 18. HNK-VERSE ZERO subset

ZERO needs only:
- platform identity preservation;
- Hub state;
- two target experience contexts;
- capability manifests;
- portal transition;
- avatar/embodiment projection;
- one example of rejected Verse-specific state;
- one example of accepted projection;
- Chronicle/provenance record.

This proves the boundary model without implementing universal inventory/economy.

## 19. Acceptance scenarios

### Scenario A — identity continuity
User leaves Hub and enters Verse A. HNK-ID remains stable; Verse A creates/loads its own embodiment/state.

### Scenario B — state isolation
Verse A level/inventory does not appear in Verse B without an explicit mapping.

### Scenario C — cosmetic projection
Verse A artifact is displayed cosmetically in Hub through a projection; Hub does not become owner of source artifact.

### Scenario D — translation
A supported external artifact maps into a Verse-owned equivalent with mapper version and provenance.

### Scenario E — unsupported transfer
Target lacks required capability; operation is rejected and Chronicle records why.

### Scenario F — return
Returning to Verse A restores Verse A-owned persistent state rather than reconstructing it from Hub state.

## 20. Next architecture artifact

With state boundaries defined, the next contract is:

**Identity / Avatar / Presence Model v1**

It will define persistent identity, Verse embodiments, avatars, sessions, presence, ownership and multi-context representation.