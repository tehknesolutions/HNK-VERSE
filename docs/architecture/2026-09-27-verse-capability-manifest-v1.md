# HNK-VERSE — Verse Capability Manifest v1

Status: APPROVED ARCHITECTURAL BASELINE
Date: 2026-09-27
Parents:
- `docs/architecture/2026-09-27-hnk-verse-world-model-v2.md`
- `docs/architecture/2026-09-27-platform-state-vs-verse-state-contract-v1.md`
- `docs/architecture/2026-09-27-identity-avatar-presence-model-v1.md`

## 1. Purpose

The Verse Capability Manifest (VCM) is the versioned technical declaration through which a Verse tells the HNK-VERSE platform what it supports, rejects, requires and exposes.

It is the interoperability contract between the metaverse platform and independently governed Verses/experiences.

Core rule:

> No capability is assumed merely because another Verse supports it.

`ABSENT CAPABILITY = UNSUPPORTED BY DEFAULT`

## 2. Responsibilities

A manifest declares capabilities related to:

- identity;
- avatar and embodiment;
- sessions and presence;
- social behavior;
- world/spatial model;
- state transfer;
- projection/translation;
- creation/editing;
- persistence;
- simulation/game systems;
- economy interfaces;
- Chronicle/provenance;
- scripting/HNK-KODE integration;
- assets/presentation;
- branches/timelines/instances;
- permissions/security;
- compatibility/versioning.

The manifest declares support. It does not itself implement the feature.

## 3. Manifest identity

Every manifest must identify at least:

- `manifestVersion`;
- `verseId`;
- `verseContractVersion`;
- `platformCompatibility`;
- `schemaVersion`;
- `authorityRef`;
- `publishedAt/versionRef`;
- capability declarations.

A manifest belongs to a specific Verse contract version, not merely a display name.

## 4. Capability declaration model

Each capability should expose, where relevant:

- capability ID;
- support state;
- version;
- mode(s);
- limits;
- required permissions;
- required dependencies;
- input/output schema refs;
- policy refs;
- provenance/authority refs.

Candidate support states:

- `SUPPORTED`
- `UNSUPPORTED`
- `CONDITIONAL`
- `EXPERIMENTAL`
- `DEPRECATED`

Experimental support must not be interpreted as stable compatibility.

## 5. Identity capabilities

Candidate declarations:

- accepts platform identity;
- requires Verse-local identity binding;
- supports persistent cross-session identity;
- supports identity branching;
- supports delegated/agent identity;
- supports guest/ephemeral identity where platform policy permits.

A Verse cannot redefine the platform HNK-ID merely by accepting it.

## 6. Avatar and embodiment capabilities

Candidate declarations:

- accepts platform avatar directly;
- accepts cosmetic avatar projection;
- requires Verse-native embodiment;
- supports avatar translation;
- supports multiple embodiments per identity;
- supports spectator embodiment;
- supports creator/editor embodiment;
- supports custom user assets.

The manifest must distinguish presentation compatibility from gameplay compatibility.

## 7. Session and presence capabilities

Candidate declarations:

- single active interactive session;
- multiple interactive sessions;
- read-only secondary sessions;
- multi-presence;
- spectator presence;
- creator presence;
- delegated agent presence;
- hidden/private presence;
- coarse versus precise location visibility.

Concurrency policies belong to the declared capability/policy version.

## 8. Social capabilities

Candidate declarations:

- platform friend presence;
- Verse-local relationships;
- groups;
- guilds/factions;
- public/private rooms;
- chat/text communication;
- voice/media capabilities where separately governed;
- invitations;
- party/session joining;
- moderation interfaces.

Platform social identity and Verse-native character relations remain distinct.

## 9. World capabilities

Candidate declarations:

- spatial hierarchy levels supported;
- typed graph relations supported;
- portals;
- instances;
- branches;
- timelines;
- projections;
- persistent spaces;
- user-owned spaces;
- dynamic world creation;
- non-Euclidean/custom graph relationships.

A Verse can be as small as one Space or as large as a cosmological graph.

## 10. State boundary capabilities

The manifest declares which transfer outcomes are supported for which state classes:

- `REJECT`
- `REFERENCE`
- `PROJECT`
- `TRANSLATE`
- `TRANSFER`
- `CLONE`

Support must be typed and directional.

Example concept:

`external.cosmetic → PROJECT:SUPPORTED`

`external.inventory.item → TRANSFER:UNSUPPORTED`

`external.badge → REFERENCE:SUPPORTED`

A generic `supportsTransfer=true` flag is insufficient.

## 11. Translation capabilities

When translation is supported, the manifest identifies:

- accepted source schema/classes;
- target schema/classes;
- mapper version/ref;
- deterministic/lossy properties;
- permissions;
- provenance requirements;
- fallback behavior.

No mapper means no implicit semantic conversion.

## 12. Creation capabilities

Candidate declarations:

- object placement;
- object editing;
- room/Space creation;
- map/world editing;
- event authoring;
- NPC/entity authoring;
- template instantiation;
- asset import;
- collaborative editing;
- publish/version lifecycle;
- creator scripting;
- HNK-KODE authoring.

Creation permissions remain separate from capability existence.

## 13. Persistence capabilities

Candidate scopes:

- ephemeral;
- experience-local;
- Verse-persistent;
- platform-referenceable;

The manifest declares supported persistence classes and any retention/versioning constraints. It does not imply platform ownership of Verse data.

## 14. Simulation/game capabilities

Candidate declarations may include:

- time simulation;
- physics;
- character needs;
- combat;
- inventory;
- crafting;
- quests;
- dialogue;
- NPC AI;
- vehicles;
- progression;
- environmental simulation;
- Verse-defined custom systems.

These are Verse capabilities, not automatically HNK-VERSE universal mechanics.

## 15. Economy capabilities

Candidate declarations:

- no economy;
- Verse-local soft economy;
- Verse-local inventory/value exchange;
- platform-compatible commerce interface;
- creator marketplace interface;
- external payment/commercial integrations where separately governed.

No economy is assumed universal. Real-money/payment behavior requires separate legal/security/product contracts and is not granted by this manifest alone.

## 16. Chronicle/provenance capabilities

Candidate declarations:

- emits lifecycle events;
- emits world events;
- accepts Chronicle correlation IDs;
- supports provenance refs;
- supports replayable deterministic events;
- supports branch lineage;
- exports audit-safe transition records.

The manifest must distinguish public/game Chronicle data from sensitive security/authentication data.

## 17. HNK-KODE capabilities

Candidate declarations:

- accepts compiled HNK-KODE artifacts;
- supports HNK-KODE world scripts;
- supports HNK-KODE UI declarations;
- supports HNK-KODE service/API integration;
- supports creator-authored scripts;
- supports runtime hot reload;
- exposes approved host capabilities to scripts.

HNK-KODE support never implies unrestricted host access.

A Verse must declare its supported HNK-KODE contract/compiler/runtime compatibility versions.

## 18. Asset/presentation capabilities

Candidate declarations:

- 2D assets;
- 3D assets;
- animation;
- audio;
- video/media surfaces;
- custom avatar assets;
- Verse-native asset translation;
- accessibility metadata;
- presentation quality tiers/client profiles.

Asset compatibility is separate from gameplay semantic compatibility.

## 19. Permission model

Capability support does not grant access.

`CAPABILITY EXISTS != ACTOR MAY USE IT`

Each capability can reference required roles/permissions such as:

- player;
- citizen;
- creator;
- game master;
- world builder;
- developer;
- moderator;
- Verse-defined roles.

Authorization is evaluated at runtime under platform and Verse policy.

## 20. Dependency and compatibility model

A Verse may require specific platform/SDK contract ranges.

Conceptually:

`platform.world >=2 <3`

`platform.identity >=1 <2`

`verse-sdk >=0.1`

`hnk-kode-runtime = optional`

Exact version syntax is not frozen by this document.

A Verse that cannot satisfy mandatory dependencies must not silently enter a partially compatible mode unless such fallback is explicitly declared.

## 21. Negotiation flow

Before entering or invoking a cross-Verse operation:

`PLATFORM REQUEST → LOAD MANIFEST → VERSION CHECK → CAPABILITY CHECK → PERMISSION CHECK → POLICY CHECK → NEGOTIATE → EXECUTE/REJECT → CHRONICLE`

Negotiation returns an explicit result rather than relying on client assumptions.

## 22. Example conceptual manifest

Illustrative only; syntax is not frozen:

```yaml
verseId: alakazam
manifestVersion: 1
verseContractVersion: 2
capabilities:
  identity:
    platformIdentity: SUPPORTED
  embodiment:
    verseNative: SUPPORTED
    platformAvatarDirect: UNSUPPORTED
    cosmeticProjection: CONDITIONAL
  presence:
    multiPresence: CONDITIONAL
    spectator: SUPPORTED
  transfer:
    externalInventory: REJECT
    externalCosmetic: PROJECT
  world:
    portals: SUPPORTED
    timelines: SUPPORTED
  creation:
    objectPlacement: CONDITIONAL
  hnkKode:
    runtime: UNSUPPORTED
```

The final serialization format will be defined by the Verse SDK contract.

## 23. HNK-VERSE ZERO manifests

ZERO should contain at least three manifests:

1. **Hub Manifest**
   - platform avatar supported;
   - social presence supported;
   - personal/shared Space supported;
   - object placement supported;
   - portals supported;
   - cosmetic projection supported.

2. **Experience A Manifest**
   - platform identity supported;
   - Verse-native embodiment supported;
   - one Verse-specific state class;
   - external gameplay state rejected;
   - Chronicle transition events supported.

3. **Experience B Manifest**
   - platform identity supported;
   - different embodiment/presentation policy;
   - one accepted projection/translation capability;
   - isolated Verse state.

The difference between A and B is intentional: it proves real negotiation rather than three identical worlds.

## 24. Acceptance scenarios

### A — unsupported feature
Client requests an undeclared capability. Platform treats it as unsupported and does not infer support.

### B — version mismatch
Verse requires an incompatible platform contract. Entry/invocation is rejected or follows an explicitly declared fallback.

### C — state negotiation
External inventory is rejected while cosmetic projection is accepted according to typed transfer capabilities.

### D — permissions
Verse supports world editing, but a Player without Creator permission cannot invoke it.

### E — embodiment negotiation
Verse rejects direct platform avatar but accepts Verse-native embodiment; identity continuity is preserved.

### F — optional HNK-KODE
Verse without HNK-KODE runtime support remains fully valid on HNK-VERSE.

## 25. Core invariants

1. `ABSENT CAPABILITY = UNSUPPORTED BY DEFAULT`.
2. `CAPABILITY EXISTS != ACTOR MAY USE IT`.
3. Capability declarations are versioned.
4. Transfer capabilities are typed and directional.
5. Presentation compatibility is not gameplay compatibility.
6. Verse mechanics do not become platform mechanics by appearing in a manifest.
7. HNK-KODE support is optional and capability-bounded.
8. Negotiation is explicit and traceable.
9. Runtime compatibility does not imply CODEX-HNK canonical authority.
10. A small Verse and a cosmological Verse use the same manifest concept without requiring the same capabilities.

## 26. Next architecture artifact

With interoperability capabilities declared, the next architecture artifact is:

**Chronicle / Event Model v1**

It will define event identity, causal lineage, correlation, ordering, replayability, evidence/provenance boundaries and how platform, Verse and experience events compose without becoming CODEX-HNK canon automatically.