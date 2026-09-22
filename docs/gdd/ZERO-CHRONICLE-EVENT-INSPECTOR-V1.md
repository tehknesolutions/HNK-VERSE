# HNK-VERSE — ZERO CHRONICLE + EVENT INSPECTOR V1

**Status:** IMPLEMENTED_LOCAL_GREEN  
**Date:** 2026-09-22  
**Parent:** ZERO Web Playable V1 + Authoritative Movement V1  
**Scope:** derived World history and auditable Event Ledger inspection

## 1. Goal

Make the first ZERO history visible without creating a second source of truth.

The invariant is:

EVENT LEDGER  
→ REBUILDABLE CHRONICLE PROJECTION  
→ UI

and never:

CHRONICLE PROSE  
→ WORLD TRUTH.

Human reflection remains separately classified:

HUMAN REFLECTION  
= HUMAN_AUTHORED_INTERPRETATION  
≠ EVIDENCE  
≠ CANON.

## 2. New package

`@hnk-verse/chronicle`

The package owns the real boundary between:

- complete technical Event Ledger;
- player-readable Chronicle milestones;
- developer/audit Event Inspector.

It is a pure projection package.

It stores nothing.

## 3. Chronicle projection

`projectZeroChronicle()` converts selected meaningful events into readable entries.

Current milestone mappings include:

- `LexemeFormObserved` → VALI observed;
- `LexemeMeaningLearned` → VALI understood;
- `KnowledgeUnitDiscovered` → practical knowledge discovered;
- `SkillEvidenceRecorded` → practice evidenced;
- Wooden Box `EntityCreated` → Box created;
- `EntityPlaced` → Home transformed;
- `OwnershipTransferred` → ownership transferred;
- Gift `RelationshipHistoryAppended` → relationship history changed;
- `AvatarRested` → Rest;
- `WorldDayAdvanced` → new day;
- `HumanReflectionAppended` → human reflection.

## 4. Noise filtering

Not every authoritative event belongs in the player-facing Chronicle.

Examples intentionally not promoted into Chronicle entries by default:

- session start/end;
- every resource gather;
- technical Agent perception event;
- command-level offer event;
- `AvatarPositionCheckpointed`.

These events remain fully visible in the Event Inspector.

Therefore:

CHRONICLE FILTERING != EVENT DELETION.

## 5. Authority classification

Chronicle entries use explicit authority:

### WORLD_EVENT_DERIVED

Readable summary projected from one or more authoritative World events.

### HUMAN_AUTHORED_INTERPRETATION

Free-form player reflection.

The UI visually distinguishes the two.

Human reflection never becomes Canon or Evidence simply because it appears beside World history.

## 6. Source references

Each Chronicle entry preserves:

- source Event ID(s);
- World timestamp;
- Event sequence number;
- category;
- authority classification.

The readable prose may change in a later localization/copy pass while the causal source references remain stable.

## 7. Event Inspector

`projectEventInspector()` preserves every supplied Event Ledger row.

It exposes:

- sequence number;
- event ID;
- event type;
- World time;
- actor;
- target;
- correlation ID;
- causation ID;
- payload;
- provenance.

The browser UI shows a bounded recent window by default while the projection remains complete.

## 8. Security / rendering boundary

Human-authored reflection text and event payload JSON are escaped before being inserted into the current DOM/SVG application HTML.

This prevents free-form Chronicle content from becoming executable markup.

Future framework migration must preserve the same rule through safe text rendering.

## 9. Web UI

The right-side panel now adds:

### Chronicle
- count badge;
- most recent readable entries;
- category;
- authority badge;
- World time;
- readable detail;
- source Event refs.

### Event Inspector
Expandable diagnostic view showing recent raw event metadata/payloads.

This creates a visible demonstration of:

EVENT  
≠ CHRONICLE  
≠ INTERPRETATION  
≠ CANON.

## 10. Refresh behavior

After each command execution:

1. domain/persistence finishes;
2. Web reads the Event Store from sequence 0;
3. Chronicle is rebuilt;
4. Event Inspector is rebuilt;
5. UI renders the projection.

On an existing browser-local World, the Chronicle is reconstructed on startup.

On reset, the projections are cleared and rebuilt from the new stream.

## 11. Deterministic verification

Executable gate:

`scripts/zero-chronicle-check.ts`

Verified locally:

- all required milestone entries appear;
- human reflection uses `HUMAN_AUTHORED_INTERPRETATION`;
- reflection preserves source refs;
- Event Inspector preserves all fixture events;
- a synthetic `AvatarPositionCheckpointed` does not increase Chronicle entry count;
- the same movement event remains visible in Event Inspector.

Result:

`ZERO_CHRONICLE_CHECK_PASS`.

Regression gates also remain green locally:

- strict TypeScript: PASS;
- ZERO deterministic runtime: PASS;
- authoritative movement: PASS.

## 12. Current limitations

V1 does not yet implement:

- localization system;
- search/filter UI;
- pagination;
- grouped repeated resource events;
- Chronicle chapters;
- screenshots/media;
- player-facing causal graph;
- CODEX-linked rich citation card;
- server-side Chronicle projection cache.

These are not required for ZERO proof.

## 13. Classification

`EVENT_LEDGER = AUTHORITATIVE`

`CHRONICLE = REBUILDABLE_DERIVED_VIEW`

`EVENT_INSPECTOR = COMPLETE_AUDIT_VIEW`

`HUMAN_REFLECTION = INTERPRETATION`

`CHRONICLE_RUNTIME = LOCAL_GREEN`
