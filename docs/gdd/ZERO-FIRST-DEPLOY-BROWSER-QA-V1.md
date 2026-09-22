# HNK-VERSE — ZERO FIRST DEPLOY + BROWSER / DEVICE QA V1

**Status:** GREEN  
**Date:** 2026-09-22  
**Production:** https://hnk-verse.vercel.app  
**Vercel project:** `tw-da-vincis-projects/hnk-verse`  
**Vercel project ID:** `prj_ZQ3gvliBZCTC84aY14molQzDDqef`  
**Final QA production deployment:** `dpl_t13jRnFGJbWT8ouWYtj8LtvwMYtD`  
**Repository main at QA close:** `ddbcb74ad27435ef5ce71c84d8c1ba4ffd04c22b`

## 1. Result

The first HNK-VERSE ZERO Web/PWA vertical slice is deployed publicly and has passed real browser automation against production.

This closes the gate:

```text
DOMAIN
→ EVENT LEDGER
→ PERSISTENCE PORTS
→ WORLD TOPOLOGY
→ RENDERER
→ WEB/PWA
→ LIVE DEPLOY
→ REAL BROWSER
→ MOBILE LAYOUT
→ FULL GAMEPLAY LOOP
→ RELOAD
→ PERSISTENCE VERIFICATION
```

## 2. Deployment contract

Root `vercel.json`:

- install: `pnpm install --frozen-lockfile`;
- build: `pnpm web:build`;
- output: `apps/web/dist`;
- framework: custom/static.

Vercel runtime/build configuration:

- Node.js: 24.x;
- pnpm: 10.17.1 from packageManager;
- build machine: 2 vCPU / 8192 MiB;
- project root: repository root;
- production aliases:
  - `hnk-verse.vercel.app`;
  - `hnk-verse-tw-da-vincis-projects.vercel.app`;
  - `hnk-verse-git-main-tw-da-vincis-projects.vercel.app`.

Final inspected production state:

`READY`

Time to ready reported by Vercel:

`7401 ms`.

## 3. Full Windows workspace verification

The repository was cloned onto the authorized Windows machine and executed outside GitHub Actions.

The exact workspace check passed:

`pnpm check`

Verified:

- strict TypeScript;
- deterministic ZERO runtime;
- persistence schema security contract;
- browser-local persistence;
- Chronicle projection;
- spatial collision/range;
- deterministic path routing;
- Vite production build.

Success markers:

- `ZERO_RUNTIME_CHECK_PASS`;
- `ZERO_PERSISTENCE_SCHEMA_CHECK_PASS`;
- `ZERO_WEB_LOCAL_PERSISTENCE_CHECK_PASS`;
- `ZERO_CHRONICLE_CHECK_PASS`;
- `ZERO_SPATIAL_CHECK_PASS`;
- `ZERO_PATH_ROUTING_CHECK_PASS`.

Vite version:

`8.3.0`.

## 4. First live QA findings

Real deployment QA found three concrete presentation/static-resource defects.

### Finding A — mobile camera opened away from Home/Avatar

Observed at 390×844.

Correction:

- mobile viewport now centers on the rendered Avatar;
- camera re-sync happens after render;
- desktop behavior remains unchanged.

Merged through PR #31.

### Finding B — mobile toolbar appeared clipped

The large internal SVG made screenshot inspection ambiguous.

Corrections included:

- mobile world-card constrained to viewport width;
- world viewport constrained independently;
- compact mobile toolbar;
- smaller zoom controls;
- hidden nonessential toolbar subtitle on narrow screens.

Merged through PR #32.

Final Playwright DOM measurement proved there is no document/toolbar overflow.

### Finding C — browser console 404

Full gameplay E2E exposed one console error.

Exact resource:

`https://hnk-verse.vercel.app/favicon.ico`

No runtime/domain/PWA asset was failing.

Correction:

- explicit HNK-VERSE SVG favicon;
- HTML icon declaration;
- manifest install icon declaration.

Merged through PR #33.

## 5. Mobile production measurements

Playwright viewport:

`390 × 844`.

Measured final production geometry:

- window inner width: 390;
- document client width: 390;
- document scroll width: 390;
- body client width: 390;
- body scroll width: 390;
- world-card: left 0 / right 390 / width 390;
- world-toolbar: left 8 / right 382 / width 374;
- zoom controls: left 254 / right 382;
- minus button: left 261 / right 293;
- plus button: left 343 / right 375;
- Avatar center is inside the visible World viewport.

Therefore:

`DOCUMENT_HORIZONTAL_OVERFLOW = FALSE`

and:

`ZOOM_CONTROLS_INSIDE_VIEWPORT = TRUE`.

The large isometric World intentionally remains horizontally scrollable inside `.world-viewport`.

## 6. Production gameplay E2E

Playwright 1.63.0 ran against the public production alias using local Microsoft Edge.

The automated player executed:

```text
fresh local state
→ load ZERO
→ route to VALI
→ ObserveLexeme
→ route to Metatron
→ RequestLexemeTeaching
→ DiscoverKnowledge
→ route to Wood
→ GatherResource ×4
→ route to Workbench
→ AttemptPractice
→ CraftEntity
→ route to storage zone
→ ValidatePlacement
→ PlaceEntity
→ route to Metatron
→ OfferTransfer
→ TransferOwnership
→ route to Bed
→ Rest
→ AppendReflection
→ verify service worker
→ reload page
→ verify durable browser-local World reconstruction
```

Final verified state after reload:

- VALI: `CONHECIDO`;
- Conhecimento: `PRÁTICO`;
- player Wood: `0`;
- Wood node: `0`;
- Skill Evidence: `1`;
- Wooden Box: `COLOCADA`;
- Metatron memory count: `2`;
- Presente: `REGISTRADO`;
- Metatron Wood: `1`;
- Chronicle entries shown by E2E: `8`;
- human reflection survives reload.

Browser errors after favicon correction:

`[]`.

## 7. PWA / HTTP verification

Production HTTP verification:

- `/` → 200;
- `/manifest.webmanifest` → 200;
- `/sw.js` → 200.

E2E also verified:

- manifest link is present;
- Service Worker reaches active state;
- reload reconstructs the persisted ZERO state.

## 8. Post-deploy observability

Vercel production deployment inspection:

- target: `production`;
- readyState: `READY`;
- build command/config match repository `vercel.json`.

Production error-log scan:

`No logs found for tw-da-vincis-projects/hnk-verse`.

This static Web/PWA currently has no server runtime functions, so absence of runtime logs is expected.

## 9. Persistence boundary

This GREEN classification applies to the currently deployed ZERO Web/PWA with:

`BrowserLocalPersistence → localStorage`.

It does **not** reclassify remote PostgreSQL/Supabase persistence.

Production database state remains separately:

`REMOTE_DB_PENDING`.

Therefore:

`FIRST_LIVE_WEB_GREEN != REMOTE_DB_GREEN`.

## 10. GitHub Actions boundary

Earlier GitHub-hosted ZERO workflow runs repeatedly failed before checkout/steps with empty step lists.

That historical hosted-runner issue is not used as evidence against the code.

The deploy gate was instead verified through:

1. exact Windows workspace execution;
2. Vercel frozen-lockfile production build;
3. real Microsoft Edge browser automation against production.

Hosted CI should still be repaired as a separate infrastructure task.

## 11. Final classification

```text
ZERO_DOMAIN_RUNTIME          = GREEN
ZERO_WORLD_TOPOLOGY          = GREEN
ZERO_PATH_ROUTING            = GREEN
ZERO_BROWSER_LOCAL_RESTORE   = GREEN
ZERO_CHRONICLE               = GREEN
ZERO_VITE_BUILD              = GREEN
ZERO_VERCEL_DEPLOY           = GREEN
ZERO_DESKTOP_BROWSER_QA      = GREEN
ZERO_MOBILE_LAYOUT_QA        = GREEN
ZERO_FULL_GAMEPLAY_E2E       = GREEN
ZERO_PWA_BASIC_QA            = GREEN
ZERO_BROWSER_CONSOLE_ERRORS  = 0
REMOTE_POSTGRES              = PENDING
HOSTED_GITHUB_RUNNER         = INFRASTRUCTURE FOLLOW-UP
```

## 12. Release statement

The first HNK-VERSE Malkuth ZERO is now publicly reachable and executable.

The release proves the central ZERO promise:

> **What the player learns, practices and creates becomes persistent change in the World, and the World remembers after return.**

This is a first playable systems release, not final visual art and not a claim that deferred systems are complete.
