# HNK-VERSE ZERO — Vertical Slice Specification v1

Status: APPROVED PRODUCT/ARCHITECTURE BASELINE
Date: 2026-09-27

## 1. Mission

HNK-VERSE ZERO is the first integrated, playable proof that HNK-VERSE is a metaverse platform rather than one game.

It must prove one persistent identity can inhabit a shared Hub, create persistent content, socialize/be present, cross portals into two mechanically distinct experience contexts, return without identity loss, and leave a causal Chronicle trail.

ZERO is deliberately small in content and complete in architecture.

## 2. Product loop

`ENTER → EXIST → SOCIALIZE → CREATE → PUBLISH → TRAVEL → EXPERIENCE → RETURN → EVOLVE`

The slice must feel like one platform containing multiple realities, not a menu that launches unrelated demos.

## 3. Required contexts

### HNK-VERSE HUB
Platform-native social/spatial context.

Contains:
- entry/spawn space;
- persistent avatar embodiment;
- personal Space portal;
- shared/social Space;
- portal nexus;
- visible creator/edit affordance;
- basic presence representation.

### PERSONAL SPACE
Owned creator space for the active identity.

Contains:
- persistent layout;
- placeable/editable object;
- draft/published distinction;
- preview/test mode;
- publication/version action.

### EXPERIENCE A
A tiny experience proving isolated Verse state and Verse-native embodiment.

Candidate role: compact Alakazam/Strangeverse proof context.

Requirements:
- platform identity accepted;
- Verse-native embodiment;
- one local gameplay/state variable;
- external gameplay state rejected;
- portal return.

### EXPERIENCE B
A tiny experience proving different interoperability policy.

Candidate role: compact HNK-Alchemy proof context.

Requirements:
- platform identity accepted;
- different embodiment/presentation policy from A;
- one accepted projection or translation;
- isolated local state;
- portal return.

The exact narrative/content of A/B can evolve; their architectural difference is mandatory.

## 4. User journey

1. User enters ZERO with one persistent platform identity.
2. Hub loads the selected platform avatar and creates presence.
3. User can enter Personal Space.
4. User switches to Creator mode and places/edits one object.
5. User saves a mutable revision, validates/previews it, then publishes.
6. Published state remains stable while later draft edits remain unpublished.
7. User returns to Hub/shared Space and can observe another presence (real second user or deterministic bot/test identity for first proof).
8. User enters Experience A through a portal.
9. Capability negotiation rejects unsupported external gameplay state and loads A's embodiment/state.
10. User performs one meaningful local interaction and returns.
11. User enters Experience B.
12. B accepts one declared projection/translation and exposes different local behavior.
13. User returns to Hub with the same platform identity/avatar continuity.
14. Chronicle can reconstruct the major causal path.

## 5. Minimum world graph

`HUB`
- `ENTRY_SPACE`
- `SHARED_SPACE`
- `PORTAL_NEXUS`
- `PERSONAL_SPACE[identity]`
- `PORTAL_A → EXPERIENCE_A`
- `PORTAL_B → EXPERIENCE_B`

The graph must use stable node/entity IDs and explicit transition edges.

## 6. Minimum Entity set

- Platform Identity reference;
- Hub Avatar Entity;
- Hub Presence;
- Personal Space;
- Shared Space;
- placeable Object Entity;
- Portal A Entity/edge;
- Portal B Entity/edge;
- Experience A Embodiment;
- Experience B Embodiment/projection;
- test/secondary Presence where required.

Each persistent entity/reference follows the World Model distinction between HNK-ID and HNK-Address/location.

## 7. State boundaries

### Platform State
- identity;
- selected platform avatar;
- platform presence refs;
- personal Space ownership/ref;
- basic social/presence refs;
- Chronicle correlation refs.

### Hub/Verse State
- Hub object/layout state;
- published personal Space version;
- Hub-specific creator configuration.

### Experience A State
- A embodiment;
- one local progression/interaction variable.

### Experience B State
- B embodiment/projection;
- one local progression/interaction variable;
- one accepted projection/translation result.

No A/B gameplay variable becomes universal platform state.

## 8. Capability manifests

ZERO ships three manifests.

### Hub Manifest
Must support:
- platform identity/avatar;
- presence;
- personal/shared Spaces;
- object placement/edit;
- persistence;
- publishing;
- portals;
- cosmetic/projection display;
- Chronicle events.

### Experience A Manifest
Must support:
- platform identity;
- Verse-native embodiment;
- portal enter/return;
- isolated Verse state;
- Chronicle transition events.

Must reject at least one external gameplay-state class.

### Experience B Manifest
Must support:
- platform identity;
- portal enter/return;
- isolated Verse state;
- a different embodiment policy;
- at least one PROJECT or TRANSLATE path;
- Chronicle transition events.

## 9. Identity/avatar/presence proof

ZERO proves:

`1 IDENTITY → SESSION → HUB PRESENCE → A PRESENCE → HUB → B PRESENCE → HUB`

Identity remains stable.

Embodiments may differ.

For v1 UI, one active interactive session is sufficient, while contracts remain compatible with future multi-presence.

## 10. Creator proof

Personal Space must exercise:

`DRAFT → VALIDATE → PREVIEW/TEST → READY → PUBLISH`

After publish:
- published Version 1 remains immutable;
- editing again creates a new working revision;
- reload/re-entry resolves the published state unless creator explicitly opens draft/edit state.

## 11. Chronicle proof

Minimum event families:
- session/presence entered;
- Space entered/exited;
- object placed/edited;
- revision saved;
- validation passed/failed;
- artifact published;
- portal travel requested;
- capability negotiation result;
- rejected external state;
- projection/translation created in B;
- source presence exited;
- target embodiment/presence entered;
- transition completed;
- return transition.

Portal events share correlation IDs and explicit causation.

## 12. Visual/product target

ZERO should communicate a coherent HNK-VERSE identity without requiring final AAA fidelity.

Priority order:
1. clear spatial readability;
2. immediate sense of persistent identity/place;
3. obvious portal destinations;
4. obvious creator affordance in Personal Space;
5. visibly distinct A/B experience identities;
6. stable movement/camera/interactions;
7. polish after platform loop is complete.

The slice must not become blocked on final Alakazam character fidelity or full HNK-Alchemy content.

## 13. Interaction minimum

Hub:
- move/navigate;
- enter Space/portal;
- inspect/select interactive entity;
- see presence.

Personal Space:
- enter edit mode;
- place one object;
- move/rotate/configure one property;
- save draft;
- preview;
- publish.

Experience A:
- one movement/interaction loop;
- one local state change.

Experience B:
- one movement/interaction loop;
- one projection/translation-visible result;
- one local state change.

## 14. Persistence minimum

Must persist across reload/re-entry:
- platform identity ref;
- selected avatar ref/config;
- personal Space ownership;
- published Personal Space version/layout;
- A Verse state;
- B Verse state;
- relevant Chronicle events/refs.

Ephemeral presence/session state must not be confused with persistent ownership/state.

## 15. Social proof

ZERO does not require a complete social network.

It requires at least:
- another visible presence in Shared Space;
- identity/display representation;
- online/presence state;
- basic privacy-safe presence metadata.

A deterministic bot/test identity may satisfy the first technical vertical slice; real multi-user validation follows before public MVP claims.

## 16. HNK-KODE boundary

ZERO must not depend on HNK-KODE being complete.

The architecture exposes stable future integration points, but initial ZERO systems may use the existing TypeScript/runtime stack.

HNK-KODE integration becomes a later consumer path through Verse SDK/runtime contracts.

## 17. CODEX-HNK boundary

ZERO emits Chronicle/runtime artifacts only.

Nothing created, played or published in ZERO becomes CODEX-HNK canon automatically.

`ZERO RUNTIME/PUBLISHING != CODEX-HNK CANONIZATION`

## 18. Out of scope for ZERO

Not required:
- full cosmological hierarchy UI;
- full MMO networking;
- final economy/marketplace;
- real-money commerce;
- universal inventory;
- universal combat;
- full Alakazam RPG;
- full HNK-Alchemy game;
- full HNK-Crônicas;
- finished HNK-KODE compiler;
- procedural universe generation;
- production-scale moderation stack;
- VR/AR;
- every creator scale up to Verse authoring.

These may evolve later without invalidating ZERO.

## 19. Technical slices

### Slice 0 — Contracts
Implement schemas/types for IDs, Entity, Address, manifests, state scopes, Event envelope and Creator Artifact/version.

### Slice 1 — Identity + Hub
Persistent identity, avatar, session/presence, Hub graph and navigation.

### Slice 2 — Personal Space + Creator
Owned Space, object placement/edit, draft persistence, validation/preview/publish.

### Slice 3 — Chronicle
Event envelope, streams/indexes needed by ZERO, causal/correlation tracking.

### Slice 4 — Portal + Negotiation
Portal transition state machine, manifest negotiation, presence exit/entry.

### Slice 5 — Experience A
Verse-native embodiment, isolated state, explicit rejected transfer.

### Slice 6 — Experience B
Different embodiment/projection policy, accepted projection/translation, isolated state.

### Slice 7 — Return + Persistence
Round trip across Hub/A/B with reload/re-entry verification.

### Slice 8 — Social proof
Second/test presence and visibility behavior.

### Slice 9 — UX/polish + acceptance
Coherent UI, transition feedback, creator affordances, diagnostics, final end-to-end gate.

## 20. End-to-end acceptance gate

A build passes ZERO only if one test journey can demonstrate all of the following:

1. stable identity enters Hub;
2. avatar/presence appears;
3. Personal Space ownership resolves;
4. object is edited and published;
5. published state survives reload;
6. another presence can be observed;
7. portal A negotiates capabilities;
8. unsupported external gameplay state is explicitly rejected;
9. A loads its own embodiment/state;
10. returning to Hub preserves identity;
11. portal B negotiates a different contract;
12. B creates an accepted projection/translation;
13. B state remains isolated;
14. final return restores Hub context;
15. Chronicle reconstructs the journey with causation/correlation;
16. no runtime/published artifact is silently promoted to CODEX-HNK canon.

## 21. Definition of Done

HNK-VERSE ZERO is done when a user can truthfully experience:

> “I entered one persistent metaverse identity, had my own place, changed and published something, encountered another presence, crossed into two genuinely different worlds that understood me differently, and returned as the same identity — while the platform remembered what belonged where.”

That is the first product proof of:

**VIVER · CRIAR · JOGAR · SOCIALIZAR · MANIFESTAR**

## 22. Next artifact

After ZERO is frozen, derive:

**Verse SDK v0.1 Contract**

The SDK must expose only the platform abstractions actually required by ZERO plus clearly versioned extension points, avoiding premature universalization.