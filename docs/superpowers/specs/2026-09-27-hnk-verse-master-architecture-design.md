# HNK-VERSE Master Architecture — Domain / Verse / Kodan / HNK-Math / Reality / Chronicle / Cognition

Status: DESIGN SYNTHESIS / IMPLEMENTATION NOT YET AUTHORIZED
Date: 2026-09-27
Repository: `tehknesolutions/HNK-VERSE`
Branch: `feat/codex-sync-agent-context`

## 1. Intent

Define HNK-VERSE as one persistent federated reality rather than a collection of disconnected games.

The architecture separates:

- HNK and CODEX-HNK as authority/canon sources;
- computational HNK-Math as a versioned derivation of documented HNK structures;
- Domain as continuity and universal reality services;
- Verse as a world/dimension with its own state and laws;
- Kodan as a reusable grammar of manifestation/interaction;
- Chronicle as the causal graph of reality transformations;
- Cognition as observer-specific knowledge, memory and derivation.

Initial proof cases:

- ALAKAZAM — embodied/spatial 3D RPG/TPS manifestation;
- HNK ALCHEMY — investigative/experimental/epistemic manifestation;
- HNK CRONICAS — narrative/historical/animated textbook-RPG manifestation.

These are not required to be isolated worlds. A Kodan may operate across multiple compatible Verses, and multiple Kodans may manifest the same Verse.

## 2. Authority and provenance

The following layers MUST remain distinguishable:

1. `CODEX DOCUMENTED CANON` — source material actually documented in CODEX-HNK.
2. `COMPUTATIONAL HNK-MATH` — new, versioned computational derivations built from canonical structures.
3. `HNK-VERSE ARCHITECTURE` — runtime/domain architecture derived for the digital manifestation.
4. `DESIGN REFERENCES` — external works used as inspiration/testing references, never as HNK ontology authority.

Documented CODEX structures currently used as conceptual sources include the Alef-to-Malkuth manifestation flow, the HNK Tree, paths/letters, references to agents, relational trees, seals and signatures. Computational formulas not explicitly documented in CODEX MUST NOT be represented as pre-existing canon.

Design references include multiversal traversal/multiplicity associated with Rick & Morty and metanarrative/observer-knowledge layering associated with Omniscient Reader. HNK-VERSE must derive its actual ontology from HNK/CODEX, not copy these works.

## 3. Master hierarchy

```text
HNK
└── CODEX-HNK
    ├── Canon Graph
    ├── Mandala / documented HNK structures
    └── Canonical knowledge
          ↓
      HNK-MATH
      ├── HnkId
      ├── HnkPath
      ├── HnkCoordinate
      ├── HnkRelation
      ├── HnkSignature
      └── HnkAddress
          ↓
      DOMAIN REALITY
      ├── Identity
      ├── Knowledge
      ├── Provenance
      ├── Reality
      ├── Chronicle
      └── Cognition
          ↓
        VERSE
      ├── WorldState
      ├── WorldRules
      ├── Branch/Timeline
      └── Capabilities
          ↓
        KODAN
      ├── ALAKAZAM
      ├── ALCHEMY
      └── CRONICAS
```

## 4. Fundamental definitions

### Domain

The Domain contains truths and services that remain meaningful independently of a specific Kodan. It preserves continuity across manifestations and federated Verses.

Examples: identity, governed knowledge, provenance, cross-Verse relations, universal Chronicle references and shared reality contracts.

### Verse

A Verse answers `WHERE / WHICH REALITY?`.

A Verse owns its `WorldState`, local laws/resolution rules, local Chronicle, branch/timeline state and declared capabilities. A Verse is not a renderer or gameplay client.

### Kodan

A Kodan answers `HOW IS THIS REALITY EXPERIENCED / MANIFESTED?`.

A Kodan is reusable across compatible Verses. It does not own reality truth and MUST NOT mutate Verse state directly.

Initial Kodans:

```text
ALAKAZAM -> inhabit / act / spatial embodiment
ALCHEMY  -> observe / experiment / discover
CRONICAS -> understand / narrate / remember
```

### Identity

Identity is global to HNK-VERSE. One identity may own multiple manifestations appropriate to different Verses/Kodans. Manifestations do not replace or fragment the underlying identity.

### ManifestationSession

Runtime binding of an identity/manfiestation to a Verse and Kodan.

Conceptual contract:

```text
ManifestationSession
├── sessionId
├── identityId
├── manifestationId
├── verseId
├── kodanId
├── worldStateVersion
├── cognitiveSessionId
├── manifestationState
└── chronicleCursor
```

Switching Kodan does not necessarily mean switching reality. A session may transition from ALAKAZAM to ALCHEMY or CRONICAS while preserving identity, Verse and relevant WorldState/Chronicle continuity.

## 5. Federated reality model

HNK-VERSE uses federated reality:

- Domain owns universal truths/services;
- each Verse owns its world truth/state;
- Kodans project and propose interactions against Verse reality;
- cross-Verse relations are explicit rather than hidden synchronization.

This avoids both isolated per-game saves and a monolithic global world store.

## 6. Core authority rule

```text
KODAN PROPOSES
      ↓
VERSE RESOLVES
      ↓
CHRONICLE RECORDS
```

A Kodan MUST NOT directly perform authoritative mutations such as `lake.purified = true`.

It emits a `WorldIntent`. The Verse resolves that intent using current reality and its rules. Resolution produces authoritative `WorldEvent` records and fact mutations.

## 7. Capability contracts

Kodans declare requirements. Verses declare capabilities.

Example:

```text
KODAN: ALCHEMY
requires:
- KNOWLEDGE
- OBSERVATION
- EXPERIMENT
- EVIDENCE

VERSE: example
provides:
- SPATIAL
- KNOWLEDGE
- OBSERVATION
- EXPERIMENT
- EVIDENCE
- CHRONICLE
```

Compatibility MUST be resolved through contracts rather than hardcoded Verse/Kodan pairs. This prevents N×N integration growth.

## 8. HNK-Math foundation

The computational model is hybrid:

```text
CODEX CANON GRAPH
       ↓
MANDALA GRAPH
       ├── coordinates
       ├── relations
       ├── derived vectors
       └── deterministic signatures
```

The graph is authoritative for semantic relationships. Vectors/matrices are derived projections for computation; they MUST NOT invent canonical meaning.

Every computational model/formula must be versioned and retain provenance to its canonical inputs/design derivation.

## 9. HNK primitives

### HnkId — identity

Answers `WHO/WHAT IS THIS?`.

- immutable;
- does not encode mutable position, color, state or current Verse;
- remains stable across state transformations.

### HnkPath — structural belonging

Answers `WHERE DOES THIS BELONG STRUCTURALLY?`.

Hierarchical/fractal example:

```text
HNK://VERSE/AETHEL/GALAXY/G01/SYSTEM/S04/PLANET/P03/CONTINENT/C02/REGION/R07
```

Path changes do not change HnkId.

### HnkCoordinate — position in a typed reference space

A single fake universal coordinate is forbidden. Coordinate spaces are explicit, e.g.:

- SPATIAL
- ASTRONOMICAL
- MANDALA
- TEMPORAL
- CHRONICLE
- KNOWLEDGE
- KODAN

### HnkRelation — graph connection

Conceptual fields:

```text
sourceId
targetId
relationType
scope
validFrom / validUntil
provenance
```

Relation vocabularies are governed/versioned. Candidate relation semantics include containment, manifestation, branching, causality, observation, derivation and governance; final canonical naming must come from the ontology process.

### HnkSignature — meaningful configuration

Answers `WHAT IS THE SIGNIFICANT CONFIGURATION OF THIS ENTITY UNDER A GIVEN HNK-MATH MODEL?`.

It is not identity and not canon authority.

Conceptual fields:

```text
entityId
mathModelVersion
canonGraphVersion
coordinates
relevantRelations
semanticProperties
derivedVector
signatureHash
provenance
```

Same governed inputs + same model versions MUST produce the same signature.

### HnkAddress — derived resolution address

Not a foundational identity primitive. It composes identity + structural/coordinate resolution context and optionally Verse/Kodan projection context.

## 10. Fractal coordinate model

HNK reality supports nested scale without forcing all semantics into one numeric identifier.

```text
HNK
└── Verse
    └── Galaxy
        └── System
            └── Planet
                └── Continent
                    └── Region
                        └── Area
                            └── Entity
                                └── Component/Property
```

The physical hierarchy is one projection. The Mandala/relationship graph may express non-spatial relationships such as causality, knowledge, affinity, function, Chronicle or manifestation.

## 11. Signature model

Four distinct signature projections are required.

### IntrinsicSignature

What belongs to the entity itself: governed intrinsic properties, constitutive relations and intrinsic Mandala position when applicable.

### ContextualSignature

Intrinsic configuration plus selected current context such as Verse, branch/timeline, environment, location, active relations and relevant Chronicle events.

### ObservedSignature

What a specific observer can know/perceive, with observer/session, evidence, knowledge and provenance context. Unknown is not equivalent to false.

### ManifestedSignature

What a Kodan can/chooses to project from the observer-authorized reality according to its capabilities.

Invariant:

```text
EXISTING != KNOWN != UNDERSTOOD != MANIFESTED
```

## 12. Fractal composition and aggregation

Parent signatures MUST NOT naively hash every descendant.

Aggregation is governed by versioned `AggregationProfile` definitions containing selectors/dependencies for scale, dimensions, relation types, properties, child summaries and normalization/rules.

Three propagation directions exist:

```text
MICRO -> MACRO : aggregation
MACRO -> MICRO : context propagation
PEER  <-> PEER : relation influence
```

Signatures declare dependency sets. A changed fact invalidates only affected signatures; propagation continues upward only when the relevant aggregate changes.

This prevents a local mutation such as one leaf changing from forcing a universe-wide recomputation.

## 13. Raw values vs HNK meaning

Computational/physical values remain explicitly typed and separate from HNK-derived meaning.

Example:

```text
Property
├── rawValue: "#65C333"
├── valueSpace: "sRGB"
├── semanticRefs
├── mandalaRefs
├── provenance
└── observedAt
```

HNK-Math may derive correspondences from raw values, but a derived correspondence MUST NOT masquerade as the original physical value or documented canon.

## 14. Reality / Chronicle engine

Core loop:

```text
Intention
  -> WorldIntent
  -> Verse Resolution
  -> WorldEvent
  -> Fact Transformation
  -> Signature Invalidation/Recomputation
  -> Chronicle
  -> Observation
  -> Cognition
  -> Knowledge
  -> new Intention
```

### WorldIntent

Records what an actor attempts/proposes. It is not reality mutation.

### Reality Resolver

Resolves intent against:

- Verse rules;
- current WorldState;
- actor/manifestation capabilities;
- prerequisites/evidence;
- relevant HNK-Math/Mandala rules where explicitly configured.

Resolution outcomes may include accepted, transformed, rejected or partial outcomes.

### WorldEvent

Records what actually happened after resolution and is the authoritative input to reality mutation/Chronicle.

## 15. Chronicle

Chronicle is not merely a save file or append-only text log. It is the versioned causal graph of reality transformations.

Conceptual event data includes:

```text
eventId
verseId
branchId
timeCoordinate
intentRefs[]
causeRefs[]
actorRefs[]
affectedEntityRefs[]
factsBefore[]
factsAfter[]
signatureBeforeRefs[]
signatureAfterRefs[]
relationChanges[]
evidenceRefs[]
provenanceRefs[]
resolutionModelVersion
mathModelVersion
worldStateVersion
```

Chronicle relationships can represent causation, enabling, affecting and branch ancestry through governed relation types.

## 16. Branches / timelines / multiversal identity

Branches share ancestry and record deltas/events rather than requiring full universe duplication.

```text
ROOT -> A -> B
             ├── C -> D
             └── C' -> D'
```

When a branch produces genuinely distinct continuing existences, variants receive distinct identities connected through governed ancestry/variant relations. One HnkId MUST NOT ambiguously represent multiple independent existences.

## 17. Observation and cognition

A WorldEvent is not automatically known by every consumer.

Observation is constrained by context such as position, senses, attention, capabilities, knowledge, occlusion, permissions and Kodan projection.

```text
WorldEvent
  -> ObservationSurface
  -> CognitiveSession
  -> Interpretation
  -> Memory / Derivation
  -> Knowledge/Evidence
  -> ObservedSignature
```

Two observers may form different knowledge about the same authoritative event without changing the underlying reality truth.

## 18. CognitiveSession reconciliation

The previously designed CognitiveSession subsystem remains valid but is now contextualized by the master architecture.

A CognitiveSession MUST include/bind relevant:

```text
consumerId
identityId? / manifestationId?
verseId
kodanId
manifestationSessionId
worldStateVersion
chronicleCursor/context
knowledge context
memory
observations
evidence
```

Existing invariants remain:

- cognition does not write canon;
- memory does not write canon;
- derivation requires lineage;
- only RETAINED memory automatically bootstraps future cognition;
- closed sessions are immutable;
- cognitive output may produce evidence for governed review.

The existing Cognitive Session specification is subordinate to this master architecture where boundaries conflict.

## 19. Kodan proof cases

### ALAKAZAM

Primary projection: embodied/spatial action.

```text
Reality -> spatial manifestation -> embodied action -> WorldIntent
```

Kodan-local state may include camera, controls, renderer/UI and presentation state. These are not WorldState truth.

### HNK ALCHEMY

Primary projection: epistemic investigation.

```text
Reality -> observation -> experiment -> evidence -> hypothesis/derivation -> knowledge
```

Alchemy-specific laboratory, reagent, instrument and experiment-presentation concerns stay Kodan-specific unless proven universal.

### HNK CRONICAS

Primary projection: narrative/historical comprehension.

```text
Chronicle truth -> perspective/knowledge-filtered narrative projection -> animated/textbook RPG experience
```

Narrative representation may be incomplete or perspective-bound without rewriting underlying Chronicle truth.

## 20. Kodan composition

Kodans may be standalone entry points or composed within another manifestation.

Examples:

```text
ALAKAZAM -> interact with laboratory -> ALCHEMY -> return
ALAKAZAM -> open chronicle/book -> CRONICAS -> return
```

Composition preserves the relevant Identity, Verse, WorldState version and Chronicle continuity. Kodan-local presentation state remains isolated.

## 21. Universal vs Kodan-specific extraction rule

When absorbing legacy HNK ALCHEMY, ALAKAZAM or CRONICAS material:

```text
universal reality concept -> DOMAIN
world-specific truth/rule   -> VERSE
manifestation/gameplay      -> KODAN
canonical HNK knowledge     -> CODEX candidate/review
technology evidence         -> CODEX-HNK/TECNOLOGIA evidence
historical/proxy artifact   -> ARCHIVE/EVIDENCE
```

Nothing is promoted to universal Domain solely because multiple games happened to duplicate it.

## 22. Persistence boundaries

Reality truth and manifestation state MUST remain separate.

```text
Domain/Verse persistence
- identities
- authoritative facts
- relations
- WorldState
- Chronicle
- governed knowledge/provenance

Kodan persistence
- UI/presentation state
- camera/render state
- local interaction state
- resumable manifestation details
```

A Kodan save is never the authoritative definition of the world.

## 23. Required invariants

1. Identity is global; manifestations are contextual.
2. Verse defines reality; Kodan defines experience.
3. Kodan never directly mutates authoritative WorldState.
4. WorldIntent is distinct from WorldEvent.
5. Chronicle records authoritative causal transformation.
6. Reality truth is distinct from observer knowledge.
7. Observed knowledge is distinct from Kodan manifestation.
8. HnkId is distinct from path, coordinates, state and signature.
9. Signatures are versioned computations, not canon authority.
10. Computational HNK-Math never retroactively claims to be documented CODEX canon.
11. Branch variants receive distinct identities when they become distinct existences.
12. Capability contracts govern Verse/Kodan compatibility.
13. Failed resolutions/cognitive operations must not leave partial authoritative mutations.
14. Provenance must reconstruct canonical inputs, derived math and runtime evidence.
15. The same governed signature inputs/model versions produce deterministic output.

## 24. Architecture consequences for current implementation

Before continuing CognitiveSession implementation, current contracts/packages must be reviewed for assumptions that:

- game == Verse;
- Verse == Kodan;
- world state belongs to a client/game;
- knowledge truth == observed knowledge;
- Chronicle == save/log;
- entity ID contains mutable location/state;
- Kodan may mutate domain state directly.

The next implementation plan must identify affected existing contracts before code changes.

## 25. Out of scope for this design

This specification does not yet define:

- the final numeric formula for HNK coordinates;
- the final vector dimensionality/weights of HNK-Math;
- complete 72-agent computational mapping;
- final canonical relation vocabulary;
- database/vendor choices;
- renderer/engine choices for each Kodan;
- complete gameplay design of ALAKAZAM, ALCHEMY or CRONICAS.

These require further canonical extraction and/or separate governed design specifications.

## 26. Master completion criterion

The architecture succeeds when one persistent HNK-VERSE reality can support multiple Verses and reusable Kodans such that:

```text
one Identity
  -> enters a Verse
  -> manifests through a Kodan
  -> perceives only authorized/available reality
  -> forms observer-specific knowledge
  -> proposes an action
  -> Verse resolves it
  -> WorldState transforms
  -> HNK signatures update deterministically
  -> Chronicle records causality
  -> other Kodans observe the same changed reality through their own projections
```

while CODEX authority, computational derivation, reality truth, observer knowledge and presentation remain explicitly separated and provenance-traceable.
