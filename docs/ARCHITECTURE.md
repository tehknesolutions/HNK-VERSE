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
