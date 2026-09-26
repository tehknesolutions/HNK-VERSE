# HNK-VERSE × Alakazam Strangeverse — Convergence V1

Status: ACTIVE
Branch: `integration/alakazam-strangeverse`
Source: `tehknesolutions/alakazam-strangeverse@main`
Destination: `tehknesolutions/HNK-VERSE`

## Canonical hierarchy

`HNK-VERSE → ZERO → PORTAL → STRANGEVERSE → ALAKAZAM AND THE STRANGEVERSE`

HNK-VERSE is the runtime/platform authority. Strangeverse is a Verse module. Alakazam is the flagship campaign/character line inside Strangeverse.

## Preservation rule

No blind repository merge. Every source artifact is classified before promotion. Existing HNK-VERSE contracts remain authoritative unless an explicit migration changes them.

## Classification matrix

| Source | Class | Destination / treatment |
|---|---|---|
| `src/tecnomage.ts` | ADAPT | Reference-avatar controller integrated behind HNK-VERSE renderer/runtime contracts |
| `public/assets/characters/tecnomage-prime-v2.8-runtime-q.glb` | REUSE | Reference-avatar baseline asset |
| `public/assets/characters/tecnomage-prime-v2.8-runtime-optimized.glb` | REUSE | Float/fallback reference-avatar asset |
| `docs/TECNOMAGE_CANON_VISUAL_TARGET.md` | PROMOTE | Strangeverse character canon/reference documentation |
| `docs/V2.8_RUNTIME_INTEGRATION.md` | PROMOTE | Runtime migration evidence |
| `docs/V2.8E-C_RUNTIME_RENDER_GATE.*` | PROMOTE | QA evidence / gate specification |
| `docs/characters/tecnomage/*` | PROMOTE | Character production specification |
| `tools/blender/*` | STRANGEVERSE-ONLY | Character DCC pipeline; not HNK-VERSE runtime core |
| `src/main.ts` | ADAPT | Mine camera/input/world behavior; do not replace HNK-VERSE app shell |
| `src/style.css` | LEGACY | Visual prototype only; no direct promotion |
| `tecnomage.gltf` + `tecnomage.bin` | LEGACY/FALLBACK | Preserve provenance; V2.8 GLB remains preferred baseline |

## First vertical slice

`ZERO 3D + M01 Zero Platform + Tecnomage Prime baseline + TPS camera/movement`

Acceptance gates:
1. HNK-VERSE app shell remains functional.
2. Reference avatar loads through a runtime-owned adapter.
3. Missing avatar asset fails gracefully rather than breaking ZERO.
4. Camera/movement remain runtime systems, not campaign-owned globals.
5. Strangeverse-specific behavior is namespaced and removable.
6. Existing HNK-VERSE tests remain green.

## Character evolution rule

V2.8 Tecnomage Prime is the executable baseline, not the final visual target. `ANATOMY27 → HERO39` remains the active visual-evolution line and may replace the baseline only after its own visual/runtime gates pass.

## Next implementation unit

Create a renderer-facing reference-avatar contract and test it before adapting the Three.js Tecnomage controller. Then integrate the adapter into ZERO without importing the Alakazam prototype app shell.