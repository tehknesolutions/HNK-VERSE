# HV-01.6 — World Runtime Integration Design

## Goal

Close the runtime chain from KODE/MHCM proposal data to an authority-gated World mutation with Chronicle-verifiable provenance, without allowing MHCM to mutate World state directly.

## Existing boundary

HV-01.4 established `evaluateMhcmWorldOperation()` as a proposal-only boundary. It executes `PATH_REVERSE` / `PATH_COMPOSE`, returns HNK-IR plus immutable Presence/authority identifiers, and deliberately does not mutate Identity, Session, Presence, or World state.

The World graph is immutable-by-return: `upsertWorldEntity()` and `addWorldRelation()` return new graph values. Chronicle already projects authoritative `HnkEvent` sources into entries and preserves event IDs, sequence numbers, timestamps and source-event references.

## Runtime contract

The integration must preserve this direction of authority:

`KODE → Semantic Model → HNK-IR/MHCM → MhcmWorldProposal → World Authority → WorldGraph mutation → HnkEvent → Chronicle`

MHCM remains computational/proposal authority only. A proposal cannot call World graph mutation APIs as an implicit side effect.

## New integration boundary

Add a focused World runtime integration module that consumes:

- an `MhcmWorldProposal`;
- the current `WorldGraph`;
- an explicit authority decision/context;
- deterministic event metadata needed to emit an `HnkEvent`.

It returns a discriminated result:

- `APPLIED`: a new WorldGraph plus one authoritative World event;
- `REJECTED`: the original WorldGraph and no mutation event.

The runtime must validate that the authority context matches the proposal's `identityId`, `sessionId`, and `presenceId`, and that the Presence is active for the target Verse. Rejection must be deterministic and must not partially mutate the graph.

## Minimal World mutation for HV-01.6

HV-01.6 does not invent a general command language. It materializes an accepted MHCM Path proposal as a World entity of kind `OBJECT` whose data contains the accepted IR payload and provenance needed to trace the proposal source.

The entity ID is supplied by the authority/runtime request rather than generated nondeterministically. This keeps tests and replay deterministic.

The emitted event type is `MhcmProposalApplied`. Its payload identifies the materialized entity and proposal IR ID. Event provenance must preserve the proposal IR metadata/provenance and the approving authority identifiers.

## Chronicle projection

Extend ZERO Chronicle projection with `MhcmProposalApplied` as a `CREATION` entry. The Chronicle entry remains derived from the authoritative World event; it must not be created directly from MHCM proposal data.

The entry's `sourceEventRefs` contains the authoritative event ID, preserving the rule:

`proposal ≠ history` and `accepted World event → Chronicle history`.

## Rejection behavior

At minimum the E2E proof covers:

1. mismatched identity/session/presence authority;
2. inactive Presence;
3. target Verse mismatch;
4. malformed/non-Path proposal IR.

Every rejection returns the original graph by identity, emits no authoritative mutation event, and therefore produces no Chronicle creation entry.

## E2E proof

A deterministic test must prove the full accepted path:

1. compile/execute a small KODE path operation through the existing MHCM layer;
2. obtain `MhcmWorldProposal`;
3. approve it with matching active Presence authority;
4. materialize the accepted Path into `WorldGraph`;
5. inspect the emitted `MhcmProposalApplied` event and provenance;
6. feed that event into `projectZeroChronicle()`;
7. assert a Chronicle `CREATION` entry references exactly that event.

A paired rejection test must prove that an authority mismatch leaves WorldGraph unchanged and yields no Chronicle history.

## Non-goals

- No direct MHCM → World mutation bypass.
- No new general-purpose World command bus.
- No persistence/database layer changes.
- No renderer/UI changes.
- No replacement of existing ZERO command authority.
- No nondeterministic IDs or timestamps inside the integration function.

## Success criteria

HV-01.6 is complete when the new E2E tests pass and the repository gate remains green:

- accepted KODE/MHCM proposal produces deterministic World state and authoritative event;
- Chronicle derives a traceable entry from that event;
- rejected authority produces no World mutation and no Chronicle history;
- existing MHCM proposal-only tests remain green;
- `pnpm typecheck` passes;
- `pnpm test` passes;
- `pnpm web:build` passes;
- `pnpm check` passes.