# HNK-VERSE — Executable Architecture

## Mission

HNK-VERSE is the executable manifestation core of HNK.

The repository begins with a deliberately small Malkuth-first vertical slice and expands only through verified capabilities.

## Core boundaries

```text
apps/web
   ↓
renderer adapter
   ↓
domain commands / queries
   ↓
world · simulation · practice · progression
   ↓
persistence + telemetry

codex-hnk ──→ codex-bridge ──┐
                              ├─→ domain/runtime
hnk-idioma ─→ language-bridge┘

agent runtime ─→ domain commands (never direct privileged mutation)
```

## Truth classes

- `CANON_STATE` — approved/versioned HNK source references.
- `WORLD_STATE` — persistent executable world facts.
- `SESSION_STATE` — transient runtime/client state.
- `INTERPRETATION_STATE` — meanings or interpretations that do not silently become fact or canon.

## R0 package target

```text
apps/web
packages/domain
packages/world
packages/simulation
packages/codex-bridge
packages/language-bridge
packages/practice
packages/agents
packages/telemetry
packages/progression
packages/persistence
packages/renderer
packages/ui
packages/fixtures
packages/contracts
```

Packages are architectural boundaries first. HNK-VERSE does not begin as a microservice system.

## ZERO invariant

The first verified executable path is:

`PLAYER → AVATAR → LAND → HOME → TIME → INVENTORY → CODEX → HNK LANGUAGE → PRACTICE → AGENT → TELEMETRY → PROGRESSION → PERSISTENCE`

## Governance invariants

1. Renderer state is not domain truth.
2. Agent speech is not canon.
3. User interpretation is not automatically evidence.
4. HNK-VERSE consumes HNK-Idioma; it does not silently invent linguistic canon.
5. Canonical references carry explicit authority/version provenance.
6. Creator permissions and epistemic/canonical authority are separate dimensions.
7. Malkuth ZERO must remain deterministic enough for end-to-end verification.


## ZERO technical bootstrap — V1 proposal

The GDD now has an executable bootstrap aligned to the locked ZERO contracts:

```text
@hnk-verse/contracts
        ↓
@hnk-verse/domain
        ↓
@hnk-verse/fixtures

@hnk-verse/persistence
        ↑
future command handlers / adapters
```

Current branch-level implementation introduces:

- resolved vs pending CODEX references;
- explicit ZERO command/event/rejection registries;
- deterministic ZERO IDs;
- pure event reducer and milestone predicates;
- vendor-neutral Event/Snapshot/CommandReceipt persistence ports;
- deterministic Malkuth fixture event stream and golden-state assertions.

Important: this is a bootstrap, not yet a claim of CI-green runtime implementation. Compilation, unit tests, command handlers and storage adapters remain the next execution gate.


## Production persistence boundary — V1

The first durable adapter is PostgreSQL/Supabase-compatible while domain ports remain vendor-neutral.

```text
validated command
      ↓
PostgresPersistence
      ↓
hnk_verse_private.world_streams
      ├─→ world_events (append-only)
      ├─→ command_receipts
      └─→ world_snapshots
```

The authoritative persistence core is intentionally private and is not exposed as a browser Data API surface.

Current implementation status:

- private declarative schema: present;
- Postgres persistence port implementation: present;
- static schema security gate: present;
- dedicated HNK-VERSE remote Supabase project: not provisioned;
- remote Postgres integration tests: pending.

Other product databases must not be reused implicitly.


## Web projection boundary — ZERO V1

The first Web/PWA projection keeps presentation downstream of domain truth:

```text
@hnk-verse/contracts
        ↓
@hnk-verse/domain
        ↓
@hnk-verse/simulation
        ↓
@hnk-verse/persistence
        ↓
apps/web
        ↑
@hnk-verse/renderer
```

For the local vertical slice:

```text
ZeroCommandRuntime
      ↓
BrowserLocalPersistence
      ↓
localStorage Event/Receipt/Snapshot document
```

For production:

```text
ZeroCommandRuntime / trusted server boundary
      ↓
PostgresPersistence
      ↓
private PostgreSQL/Supabase durable schema
```

Renderer responsibilities:

- logical-to-isometric projection;
- scene fixture projection;
- visual selection/highlight;
- camera/zoom;
- non-authoritative presentation movement.

Renderer must not author inventory, Skill, ownership, Agent memory, relationship history or canonical authority.


## Avatar movement authority — ZERO V1

The Web renderer may animate/move the Avatar immediately, but durable position is owned by the domain.

```text
input
→ route / one logical tile
→ MoveAvatar
→ validation
→ AvatarPositionCheckpointed
→ reducer
→ persistence
→ renderer advances
```

This avoids both failure modes:

- renderer position as truth;
- one permanent Event Ledger event per animation frame.

The movement contract is now integrated with the shared 18×14 topology, collision and deterministic routing layers.


## Chronicle projection boundary — ZERO V1

Chronicle is a rebuildable projection, not persistence authority.

```text
EventStore
   ↓
@hnk-verse/chronicle
   ├─→ Chronicle readable milestones
   └─→ Event Inspector audit rows
```

Readable history intentionally filters low-level/noisy events while the Event Inspector preserves the full supplied stream.

Human-authored reflection is rendered with explicit `HUMAN_AUTHORED_INTERPRETATION` authority and escaped before HTML insertion.


## Logical world topology — ZERO V1

The ZERO spatial truth now lives in `@hnk-verse/world`.

```text
@hnk-verse/contracts
        ↓
@hnk-verse/world  ← logical topology / collision / range
        ↓
@hnk-verse/domain ← command validation / World events
        ↓
@hnk-verse/simulation
        ↓
persistence

@hnk-verse/world
        ↓
@hnk-verse/renderer ← isometric projection only
        ↓
apps/web
```

Spatial rules:

- Land bounds: 18×14;
- Home perimeter is solid;
- east threshold at logical (9,6) is walkable;
- static fixtures occupy logical cells;
- placed entities add dynamic collision;
- Avatar movement is one cardinal logical step;
- interaction range is Manhattan distance <= 1.

This removes duplicated topology from the renderer and prevents remote interactions from bypassing spatial play.


## Path planning boundary — ZERO V1

Path planning is owned by `@hnk-verse/world`, while command authorization remains in `@hnk-verse/domain`.

```text
input target
   ↓
@hnk-verse/world
   ↓
deterministic route proposal
   ↓
apps/web preview
   ↓
MoveAvatar step 1
   ↓
domain validation
   ↓
World event / state
   ↓
MoveAvatar step 2
   ↓
...
```

Two routing modes are available:

- exact free-cell click-to-walk;
- route to a walkable adjacent cell for interaction targets.

Static blockers come from logical topology.
Dynamic blockers come from current World entity state.

A stale plan cannot force movement: every step is revalidated by the domain before the route continues.

Route preview and route destination are session/presentation state only and are not persisted as World truth.


## First live deployment boundary — ZERO V1

The public ZERO Web/PWA is deployed at:

`https://hnk-verse.vercel.app`

Deployment path:

```text
GitHub main
   ↓
Vercel Git Integration
   ↓
pnpm install --frozen-lockfile
   ↓
pnpm web:build
   ↓
apps/web/dist
   ↓
public static deployment
```

Current deployed client persistence:

```text
ZeroCommandRuntime
   ↓
BrowserLocalPersistence
   ↓
localStorage
```

The existing Postgres adapter remains a separate production-data gate and is not implied by the public Web deployment.

First-live verification used three independent layers:

1. full Windows `pnpm check`;
2. Vercel production build;
3. Playwright + Microsoft Edge against the public production alias.

The final production browser automation covers the complete ZERO loop and reload persistence.

Deployment authority remains separate from domain authority:

`DEPLOYED UI != WORLD TRUTH`.

World changes still require domain commands and persisted events.


## Remote Postgres verification boundary — ZERO V1

The dedicated HNK-VERSE Supabase project now hosts the private authoritative persistence schema.

```text
hnk_verse_private
├─ hnk_identities
├─ personal_verses
├─ worlds
├─ world_streams
├─ world_events
├─ command_receipts
└─ world_snapshots
```

Remote proof chain:

```text
tracked migration
→ real Postgres
→ private schema / RLS / grants audit
→ atomic append
→ rollback
→ concurrent writers
→ immutable ledger
→ snapshot + tail
→ canonical ZERO fixture upload
→ ordered readback
→ semantic equality
→ real reducer
→ exact golden state
```

Current boundary:

`REMOTE_DB_CORE = GREEN`

but:

`DIRECT PostgresPersistence INSTANCE → DIRECT DRIVER = PENDING`.

The database password was not exposed or reset to force this final proof. A server-side Edge Function route using the automatically managed `SUPABASE_DB_URL` was preferred, but deployment of that QA function was blocked by the platform security layer before reaching Supabase.
