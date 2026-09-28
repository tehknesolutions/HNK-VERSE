# Verse SDK v0.1 → ZERO Runtime Integration Design

Date: 2026-09-28
Status: Design approved; implementation not started

## 1. Intent

Integrate the completed Verse SDK v0.1 into the real HNK-VERSE ZERO runtime so that ZERO becomes a platform capable of hosting autonomous Verses rather than a collection of connected demos.

The Hub is the principal navigable runtime. Experience A and Experience B are entered through real portal boundaries. The platform owns identity, session, presence, cross-Verse transition policy, interoperability and boundary observability. Each Verse owns its internal reality after entry.

GitHub Actions is not a release blocker for this phase. Verification is performed through the repository's direct/local gates, especially `pnpm install --frozen-lockfile` and `pnpm check`.

## 2. Architectural Law

**Platform owns the border. Verse owns its reality. Contract governs the connection.**

Consequences:

- Platform identity is not recreated when entering a Verse.
- A Verse may create or select a Verse-native embodiment without replacing platform identity.
- Cross-Verse state never transfers implicitly.
- Every cross-Verse operation uses an explicit Interop outcome: REJECT, REFERENCE, PROJECT, TRANSLATE, TRANSFER or CLONE.
- Projection is not canonical identity.
- Runtime events do not become CODEX-HNK canon merely because they occurred in a Verse.
- Every boundary transition is observable through Chronicle events with one correlation chain.

## 3. Runtime Topology

```text
BOOT
  ↓
PLATFORM CONTEXT
  ↓
ZERO HUB ACTIVE
  ├── Portal A → Experience A
  │                ↓
  │             return
  │                ↓
  └──────────── ZERO HUB
                   └── Portal B → Experience B
```

The Hub remains the stable platform-space between Verse visits. Experience A and B are not hard-coded navigation screens; they are Verse targets resolved through manifests and runtime adapters.

## 4. Components

### 4.1 Platform Runtime

Owns:

- HNK identity reference;
- session;
- platform presence;
- current Verse/world context;
- active transition state;
- registry access for Verse manifests/adapters;
- restoration of Hub presence after Verse exit.

It must not own Verse-specific gameplay state.

### 4.2 Portal Boundary

A portal is a platform boundary trigger containing a target Verse/world address and requested interoperability capabilities. Portal activation does not directly load a scene. It submits a transition request to the SDK integration layer.

### 4.3 Verse Registry

Maps stable Verse IDs to:

- capability manifest;
- runtime adapter;
- target/default world information;
- optional presentation metadata used by the Hub.

The registry prevents A/B-specific conditionals from spreading through platform runtime code.

### 4.4 Transition Service

Adapts the existing Verse SDK `TransitionCoordinator` to ZERO runtime dependencies:

1. resolve target manifest;
2. negotiate capabilities;
3. prepare explicit Interop outcomes;
4. resolve target context;
5. emit Chronicle boundary chain;
6. hand control to the target Verse adapter;
7. commit current context only after successful entry.

Failure leaves the user in the last stable context.

### 4.5 Verse Runtime Adapter

Each Verse exposes a narrow adapter to the platform. The adapter handles Verse lifecycle entry/exit and Verse-owned runtime activation. Platform code does not reach into Verse internals.

Minimum adapter surface:

- `initialize`
- `enter`
- `suspend`
- `resume`
- `exit`
- `dispose`

These operations use the existing lifecycle/runtime contracts rather than introducing a second lifecycle model.

### 4.6 Chronicle Boundary Sink

The integration persists or forwards the SDK boundary events generated during real navigation. At minimum, a complete successful transition records requested, negotiated, prepared, entered and completed events under one `correlationId` with sequential `causationId` links.

Failure records `VerseTransitionFailed` and does not silently mutate current platform context.

## 5. Data Flow

### 5.1 Boot

1. ZERO boots.
2. Platform identity/session are resolved.
3. Platform context is created for ZERO Hub.
4. Hub adapter becomes ACTIVE.
5. Current context is committed as Hub.

### 5.2 Hub → Experience A

1. User physically activates Portal A.
2. Portal submits target Verse A and its requested capabilities.
3. Registry resolves Experience A manifest/adapter.
4. Capability negotiation runs before entry.
5. Interop prepares only permitted references/state.
6. Experience A lifecycle enters.
7. Chronicle records the boundary chain.
8. Platform commits Experience A as current context.

Experience A may use its Verse-native embodiment. External gameplay state remains unsupported where its manifest says so.

### 5.3 Experience A → Hub

1. Exit is requested through the platform boundary.
2. Experience A exits through its adapter/lifecycle.
3. Only explicitly permitted return-state is reconciled.
4. Hub context/presence is restored.
5. Chronicle records exit/return boundary events.
6. Hub becomes ACTIVE again.

### 5.4 Hub → Experience B

The same generic transition path is used. Experience B may request/use `interop.cosmetic-projection`. The Interop Engine creates a projection reference with provenance. That projection is a target-context representation, not a replacement for the platform identity.

## 6. State Ownership

### Platform-owned

- identity ID;
- session ID;
- platform presence ID;
- permissions/roles;
- cross-Verse correlation IDs;
- current Verse/world address;
- transition state;
- platform Chronicle boundary records.

### Verse-owned

- local simulation/gameplay state;
- local entities not promoted through an explicit contract;
- Verse-native embodiment state;
- local lifecycle implementation details;
- internal rules and progression.

### Contract-mediated

Anything crossing the boundary: cosmetics, references, translated state, transferred state, cloned state, achievements or future portable assets.

## 7. Error Handling and Atomicity

Transitions are fail-closed.

- Unknown Verse → `VERSE_UNAVAILABLE`.
- Capability mismatch → explicit negotiation failure.
- Missing permission → `PERMISSION_DENIED`.
- Invalid context/address → corresponding SDK error.
- Interop failure → no target-context commit.
- Target lifecycle entry failure → restore/retain source stable context.
- Chronicle chain corruption → transition must not be treated as successfully committed.

The platform updates `currentContext` only after the target has entered successfully. A failed transition cannot leave ZERO claiming the user is inside a Verse that did not activate.

## 8. First Vertical Slice

The first real integration must demonstrate, through the actual ZERO runtime:

1. open ZERO in Hub;
2. navigate to Portal A;
3. activate Portal A;
4. enter Experience A through SDK negotiation/transition;
5. return to Hub;
6. navigate to Portal B;
7. activate Portal B;
8. create the permitted cosmetic projection;
9. enter Experience B;
10. preserve the same platform identity throughout.

No A/B-specific bypass may directly switch the active scene/runtime around the SDK.

## 9. Testing Strategy

### Unit/contract

Keep all existing Verse SDK v0.1 conformance checks green.

### Integration

Add ZERO runtime integration tests proving:

- portal activation creates a transition request;
- registry resolution is generic;
- unsupported capabilities fail before Verse entry;
- target lifecycle entry occurs before context commit;
- failure retains the source context;
- Hub restoration works;
- Experience B projection preserves provenance;
- identity/session remain stable across Hub → A → Hub → B;
- Chronicle boundary chains remain correlated and causal.

### Repository gate

Required direct verification:

```bash
pnpm install --frozen-lockfile
pnpm check
```

GitHub Actions may run when available but is non-blocking for this phase.

## 10. Non-goals

This phase does not:

- invent a second Verse SDK;
- redesign the six Interop outcomes;
- make CODEX-HNK canon from runtime events;
- implement arbitrary networked multiplayer;
- build a public Verse marketplace;
- generalize every future portable asset type;
- make GitHub Actions a release dependency;
- hard-code Experience A/B into platform transition logic.

## 11. Success Criteria

The integration is complete when:

- ZERO boots into a navigable Hub;
- portals invoke the real SDK boundary path;
- Hub → A → Hub → B works without identity recreation;
- manifests govern capability behavior;
- Interop governs cross-boundary state;
- Lifecycle governs Verse activation/deactivation;
- Chronicle observes every real boundary;
- failures retain a valid stable context;
- `pnpm install --frozen-lockfile` passes;
- `pnpm check` passes;
- no GitHub Actions result is required to declare this integration gate locally verified.

## 12. Implementation Boundary

Implementation should add the smallest ZERO runtime integration layer necessary to connect existing SDK primitives to existing Hub/portal/runtime code. Existing SDK contracts remain authoritative. If current ZERO code exposes structural conflicts, refactor only the affected boundary rather than redesigning unrelated systems.
