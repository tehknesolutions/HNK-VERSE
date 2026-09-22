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
