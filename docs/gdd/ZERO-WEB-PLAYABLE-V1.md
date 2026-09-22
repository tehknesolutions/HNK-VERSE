# HNK-VERSE — ZERO WEB PLAYABLE V1

**Status:** IMPLEMENTED_LOCAL / BUILD_RUNNER_PENDING  
**Date:** 2026-09-22  
**Parent:** ZERO Production Persistence Adapter V1 LOCK  
**Target:** first visible/playable Malkuth Home vertical slice

## 1. Goal

Project the already-locked ZERO domain/runtime into a browser/PWA experience without allowing presentation code to become domain truth.

The playable thesis is:

> **Learn something. Use it. Change your Home. Return and see that the world remembers.**

## 2. Web stack

Initial Web implementation:

- Vite 8.3.0;
- framework-free TypeScript/DOM/SVG;
- workspace packages consumed directly;
- Web/PWA first;
- SVG 2D/2.5D isometric projection;
- local browser persistence adapter for the vertical slice.

No React/framework dependency is required for V1.

## 3. New package — @hnk-verse/renderer

The renderer package owns deterministic presentation geometry.

It defines:

- 18×14 logical grid;
- 64×32 isometric tile projection;
- logical ↔ isometric transforms;
- Home footprint;
- fixed ZERO scene fixture positions;
- scene projection derived from ZeroWorldState;
- tile polygons.

Renderer does not mutate World State.

## 4. Scene fixtures

The first rendered scene contains:

- Avatar presentation marker;
- Home floor;
- Bed;
- Workbench;
- VALI surface;
- Metatron;
- Cartography table;
- finite Wood node;
- Home storage placement zone;
- Wooden Box after placement.

Dynamic labels are derived from authoritative state.

Examples:

- VALI unknown / observed / known;
- Wood node remaining quantity;
- Skill Evidence state;
- Metatron memory count;
- storage zone free / occupied.

## 5. Web command loop

World-changing actions call the existing ZeroCommandRuntime.

Implemented UI path:

VALI  
→ ObserveLexeme

Metatron  
→ RequestLexemeTeaching  
→ DiscoverKnowledge

Wood node  
→ GatherResource

Workbench  
→ AttemptPractice  
→ CraftEntity

Storage zone  
→ ValidatePlacement  
→ PlaceEntity

Metatron after manifestation  
→ OfferTransfer  
→ TransferOwnership

Bed  
→ Rest

Chronicle surface  
→ AppendReflection

No browser component directly sets:

- inventory quantity;
- Skill Evidence;
- Box existence;
- Box spatial binding;
- Agent memory;
- relationship history;
- ownership;
- canonical authority.

## 6. Browser-local persistence

A new BrowserLocalPersistence adapter implements the same existing ports:

- EventStore;
- SnapshotStore;
- CommandReceiptStore.

Storage:

localStorage

Purpose:

- playable local vertical slice;
- browser reload proof;
- installable PWA exploration;
- development before dedicated remote HNK-VERSE Postgres is provisioned.

Boundary:

BrowserLocalPersistence is **not production concurrency persistence**.

The locked production adapter remains PostgreSQL/Supabase.

## 7. Reload proof

The browser-local adapter persists:

- events;
- command receipts;
- snapshot when created.

A new ZeroCommandRuntime instance reconstructs state from persisted storage.

A dedicated executable check proves:

Observe VALI  
→ discard runtime  
→ create new runtime  
→ VALI remains observed.

It also proves idempotency for a rejected command without advancing World stream sequence.

## 8. Avatar movement boundary

Keyboard/touch movement remains visually immediate:

- WASD;
- arrow keys;
- mobile directional pad.

The authority gap from the first implementation is now closed by `ZERO-AUTHORITATIVE-MOVEMENT-V1.md`.

Visual movement is debounced into:

`MoveAvatar → AvatarPositionCheckpointed`

after a short idle period.

Therefore the renderer remains responsive while the Event Ledger stores safe logical checkpoints rather than animation frames.

## 9. Camera

Initial camera:

- fixed isometric orientation;
- no rotation;
- bounded 75%–125% zoom;
- scrollable viewport on small screens.

This preserves the locked Home + Land camera direction.

## 10. UI

Desktop:

- World primary surface;
- right contextual panel;
- click/select fixtures;
- contextual primary action;
- keyboard movement;
- zoom.

Mobile:

- large selectable fixtures;
- contextual action panel;
- directional pad;
- scrollable isometric world;
- no essential hover-only action.

## 11. Visual direction

V1 is intentionally a systems-first visual prototype.

Current visual language:

- dark natural Malkuth environment;
- warm gold functional/revelatory accents;
- restrained mystical glow;
- darker Home floor;
- explicit storage zone;
- VALI blue epistemic cue;
- Metatron purple identity cue;
- Wood/Workbench earth material cues.

This is not final art.

No final production asset is implied by the SVG prototype.

## 12. PWA

Added:

- Web App Manifest;
- theme/background colors;
- standalone display mode;
- lightweight service worker shell/runtime cache.

No app icon asset is claimed final yet.

## 13. Local verification evidence

Executed against a local reconstruction of the branch:

### TypeScript

`tsc -p tsconfig.json`

Result:

`PASS`

One defect was found and fixed before PR:

the DOM root query was still considered nullable inside render closures.

Correction:

guard the query result, then assign the narrowed node to an explicit HTMLElement root.

### Existing ZERO runtime

`node --experimental-strip-types scripts/zero-runtime-check.ts`

Result:

`ZERO_RUNTIME_CHECK_PASS`

### Browser-local persistence

`node --experimental-strip-types scripts/zero-web-local-persistence-check.ts`

Result:

`ZERO_WEB_LOCAL_PERSISTENCE_CHECK_PASS`

Verified:

- runtime reconstruction from localStorage-compatible storage;
- observed VALI survives runtime recreation;
- rejected command receipt is idempotent;
- rejected command does not advance World sequence.

## 14. Build verification boundary

The current execution container cannot resolve external hosts, so it cannot install Vite from npm for a real production Web build.

The dependency is pinned in the app package.

The GitHub workflow is updated to run:

`pnpm check`

which now includes:

- TypeScript;
- ZERO runtime;
- persistence schema check;
- browser-local persistence check;
- Web Vite build.

GitHub-hosted runners were already classified as infrastructure-blocked in the previous runtime gate.

Therefore current classification is:

- TypeScript: LOCAL PASS;
- ZERO runtime: LOCAL PASS;
- browser-local persistence: LOCAL PASS;
- Vite production build: RUNNER/DEPENDENCY INSTALL PENDING;
- browser visual/device QA: PENDING.

## 15. Next playable gates

1. obtain first successful Vite production build;
2. run browser smoke test;
3. verify desktop interactions;
4. verify mobile/touch;
5. verify service worker/PWA reload;
6. authoritative Avatar movement/checkpoint — **IMPLEMENTED_LOCAL_GREEN**;
7. Chronicle-derived event list surface — **IMPLEMENTED_LOCAL_GREEN**;
8. interaction range + collision + Home threshold — **IMPLEMENTED / RUNNER_PENDING**;
9. replace prototype glyphs with approved visual assets;
9. connect trusted server/Postgres persistence when HNK-VERSE DB exists.

## 16. Current classification

`DOMAIN_RUNTIME = LOCAL_GREEN`

`WEB_TYPES = LOCAL_GREEN`

`BROWSER_LOCAL_PERSISTENCE = LOCAL_GREEN`

`VITE_BUILD = PENDING_EXTERNAL_RUNNER`

`VISUAL_QA = PENDING`

The implementation is suitable to merge as the first playable Web projection, but it is not yet a production release.


## 17. Spatial interaction update

`ZERO-INTERACTION-RANGE-COLLISION-V1.md` upgrades the first Web playable from remote contextual actions to a spatially constrained World:

- single-step authoritative movement;
- Home walls + traversable threshold;
- static/dynamic collision;
- proximity-gated interactions;
- Web distance affordances;
- runtime path traversal in tests.
