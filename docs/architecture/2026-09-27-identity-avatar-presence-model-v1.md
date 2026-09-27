# HNK-VERSE — Identity / Avatar / Presence Model v1

Status: APPROVED ARCHITECTURAL BASELINE
Date: 2026-09-27
Parents:
- `docs/architecture/2026-09-27-hnk-verse-world-model-v2.md`
- `docs/architecture/2026-09-27-platform-state-vs-verse-state-contract-v1.md`

## 1. Purpose

This model defines how a persistent participant exists, appears, connects and manifests across the HNK-VERSE metaverse platform without conflating identity, avatar, embodiment, session or presence.

Core model:

`1 IDENTITY → N SESSIONS → N PRESENCES → N CONTEXTUAL EMBODIMENTS`

Multiplicity does not duplicate the underlying identity.

## 2. Fundamental distinctions

### Identity

Answers: **who is the persistent participant?**

Identity is the stable platform referent used to associate permissions, ownership, provenance, social references and cross-Verse continuity.

### Avatar

Answers: **what platform-level representation is selected or controlled?**

An avatar is a representational construct associated with an identity. An identity may own or use multiple avatars where policy permits.

### Embodiment

Answers: **what form does this identity/avatar assume inside this Verse or experience?**

Embodiment is contextual. A Verse may preserve the platform avatar, adapt it, replace it with a Verse-native character, or create another permitted projection.

### Session

Answers: **through which authenticated runtime connection/context is participation occurring?**

A session is temporary and operational. Identity outlives sessions.

### Presence

Answers: **where and in what participation state is an identity/session currently represented?**

Presence binds a session/identity to a runtime context and presence state.

## 3. Core invariants

`IDENTITY != AVATAR`

`AVATAR != EMBODIMENT`

`IDENTITY != SESSION`

`SESSION != PRESENCE`

`PRESENCE != EMBODIMENT`

`MULTI-PRESENCE != MULTIPLE IDENTITIES`

`SAME IDENTITY != SAME PERMISSIONS`

`SAME IDENTITY != SAME BODY`

`SAME IDENTITY != SAME VERSE STATE`

## 4. Identity contract

A platform identity should expose stable references for:

- HNK-ID / platform identity ID;
- ownership/authority references;
- profile reference;
- permission/role bindings;
- social graph references where enabled;
- provenance;
- lifecycle/status;
- Chronicle references.

Authentication credentials are not part of the public world identity object and must remain separated from runtime/world projections.

## 5. Avatar contract

An avatar may contain/reference:

- avatar ID;
- owning identity;
- presentation/appearance configuration;
- asset references;
- accessibility/presentation preferences where appropriate;
- platform-safe animation/presentation metadata;
- provenance;
- compatibility/capability metadata.

Platform avatar data must not automatically grant gameplay attributes.

A cosmetic asset does not become a Verse item merely because it appears on an avatar.

## 6. Embodiment contract

Embodiment is owned by a context policy and links back to identity/avatar.

Conceptually:

`IdentityRef + AvatarRef? + ContextRef + EmbodimentEntityRef + Projection/TranslationRef?`

Examples:

- Hub humanoid avatar;
- Alakazam Verse-native character;
- HNK-Alchemy symbolic/alternate representation;
- spectator camera/entity;
- editor/creator representation.

Verse-specific body mechanics remain Verse state.

## 7. Session model

An identity may hold multiple simultaneous sessions subject to policy.

Possible sessions:

- desktop client;
- mobile client;
- web client;
- spectator connection;
- creator/editor session;
- explicitly authorized agent/delegated session.

Each session has its own:

- session ID;
- identity reference;
- authentication assurance/context reference;
- device/client class metadata as permitted;
- granted capabilities;
- lifecycle/expiry;
- active presence references.

A session cannot silently inherit every capability granted to another session.

## 8. Multi-presence

The architecture supports multi-presence but does not require every Verse to permit it.

Examples:

- one identity actively playing on desktop while mobile shows read-only social presence;
- one active embodiment plus a spectator projection;
- creator/editor view plus runtime test presence;
- authorized agent presence acting within a constrained capability grant.

A Verse Capability Manifest declares whether it permits:

- single active presence only;
- multiple read-only presences;
- multiple interactive presences;
- spectator projections;
- delegated/agent presence.

## 9. Presence states

Candidate platform presence states:

- `OFFLINE`
- `ONLINE`
- `IDLE`
- `ACTIVE`
- `BUSY`
- `SPECTATING`
- `CREATING`
- `PLAYING`
- `IN_TRANSITION`
- `HIDDEN`

Verses may expose additional local states without redefining platform meanings.

Presence visibility is permission/privacy controlled; existence of a session does not require public disclosure of exact location.

## 10. Location and presence

Presence may reference:

- Verse/context;
- HNK-Address or graph node reference;
- embodiment entity;
- activity type;
- visibility policy;
- session;
- start/update time;
- Chronicle/provenance refs.

Precise location can be private even when general online presence is visible.

## 11. Identity through portals

Portal transition flow:

`IDENTITY → SESSION → SOURCE PRESENCE → TRANSITION POLICY → TARGET VERSE → TARGET EMBODIMENT → TARGET PRESENCE`

The transition may:

- preserve the same avatar representation;
- project the avatar;
- translate it;
- load an existing Verse-native embodiment;
- create a permitted new embodiment;
- reject entry.

Identity remains stable unless an explicit identity-branching operation is invoked.

## 12. Embodiment continuity

Returning to a Verse should normally restore the Verse-owned embodiment/state rather than reconstructing gameplay state from platform avatar data.

Example:

`Platform Identity TW → Hub Avatar → Alakazam Embodiment A`

Leaving Alakazam does not erase Embodiment A if its Verse persistence policy retains it.

Re-entry resolves Identity TW to Embodiment A under Alakazam's contract.

## 13. Ownership and control

Ownership and control are separate relations.

An identity may own an avatar but temporarily delegate control under explicit policy.

Examples:

- player controls own avatar;
- creator controls test NPC/entity;
- authorized agent performs bounded actions;
- spectator observes without control.

`OWNER != CONTROLLER`

Delegation must be scoped, revocable and traceable.

## 14. Agents and delegated presence

An AI/agent must not be treated as the human identity merely because it acts for that identity.

Delegated model:

`Principal Identity → Delegation Grant → Agent Identity/Process → Session → Presence`

The grant specifies:

- allowed contexts;
- allowed actions;
- duration;
- visibility/attribution;
- revocation;
- provenance requirements.

Agent actions remain attributable to the agent/delegation chain.

## 15. Privacy and visibility

Presence supports independent visibility layers, for example:

- offline/online visibility;
- Verse visibility;
- coarse location visibility;
- precise location visibility;
- activity visibility;
- embodiment/avatar visibility.

Visibility may depend on relationship, group, Verse, role and explicit user/platform policy.

The platform should expose the minimum presence detail required by a feature.

## 16. Social identity

Social relationships bind primarily to stable identity, not to temporary embodiments.

A Verse may additionally maintain Verse-native relationships between embodiments/characters.

Therefore:

`PLATFORM SOCIAL RELATION != VERSE CHARACTER RELATION`

They may reference each other but do not merge automatically.

## 17. Chronicle and provenance

Relevant lifecycle events include:

- session opened/closed;
- presence entered/left context;
- embodiment created/loaded/projected;
- avatar changed;
- portal transition;
- delegation granted/revoked;
- control changed;
- visibility policy changed where audit is appropriate.

Sensitive security/authentication material must not be copied into public Chronicle events.

## 18. Failure and concurrency

Multi-session conflicts are resolved by explicit context policy.

Examples:

- Verse permits only one interactive embodiment: second session becomes spectator/read-only or is rejected;
- creator test session is isolated from published runtime state;
- stale session loses control after lease/authority revocation.

No last-write-wins rule may silently transfer embodiment control between sessions.

## 19. HNK-VERSE ZERO subset

ZERO should prove:

1. one persistent identity;
2. one selectable platform avatar;
3. one authenticated session abstraction;
4. one Hub presence;
5. one Hub embodiment;
6. portal transition to two experience contexts;
7. at least one Verse-specific embodiment/projection;
8. return to Hub preserving identity;
9. presence lifecycle events in Chronicle;
10. a basic visibility policy;
11. multi-session/multi-presence represented in the contract even if the first UI only exercises one active session.

## 20. Acceptance scenarios

### A — Stable identity
The participant changes avatar appearance; HNK-ID remains unchanged.

### B — Verse embodiment
The participant enters Alakazam; the Verse loads its own embodiment without converting Alakazam progression into platform state.

### C — Return
The participant returns to Hub; platform avatar/presence resumes while Alakazam embodiment remains Verse-owned/persisted according to policy.

### D — Two sessions
Desktop is interactive while mobile is read-only/presence-only under the selected policy; both reference the same identity.

### E — Delegated agent
An authorized agent performs only actions granted by delegation and is not represented as if the human directly performed them.

### F — Privacy
Friends can see the participant is online while precise Space location remains hidden.

## 21. Relationship to HNK-KODE

HNK-KODE may eventually express avatar, presence, transition and delegation operations through HNK-VERSE APIs/SDK contracts.

HNK-KODE cannot bypass identity authority, permissions, Verse capability manifests, privacy or delegation boundaries.

## 22. Next architecture artifact

With identity, embodiment and presence separated, the next contract is:

**Verse Capability Manifest v1**

It will define how every Verse declares supported identity, social, transfer, projection, creation, simulation, scripting, Chronicle and runtime capabilities to the platform.