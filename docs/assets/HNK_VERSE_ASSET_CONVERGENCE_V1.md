# HNK-VERSE Asset Convergence V1

Status: ACTIVE / INVENTORY-FIRST
Issue: #46

## Purpose
Converge approved physical assets and reusable asset-pipeline knowledge into HNK-VERSE without erasing provenance or transferring authority implicitly.

## Canonical taxonomy
- assets/characters
- assets/creatures
- assets/worlds
- assets/props
- assets/materials
- assets/animations
- assets/vfx
- assets/audio
- assets/ui
- assets/symbols

Runtime-served assets map to `apps/web/public/assets/...`. Source/master material remains provenance-tracked separately from optimized runtime derivatives.

## Classification semantics
- KEEP: approved physical HNK-VERSE asset.
- MERGE: reusable contract, registry, pipeline, or physical asset approved for convergence.
- ARCHIVE/REFERENCE: retain provenance/knowledge but do not include in runtime.
- HOLD: potentially useful physical asset awaiting explicit art/world-fit decision.
- REJECT: positively determined unsuitable; never use merely as a synonym for unreviewed.

## Confirmed source families

### Tecnomage Prime V2.8 — first physical migration package
Source: `tehknesolutions/alakazam-strangeverse@main`
Confirmed runtime/source family includes the two V2.8 runtime GLBs, GLTF/BIN, body/hair/eye textures, SHA-256 manifest, provenance/QA documents and Blender validation tooling.
Classification: KEEP candidate; first package to physically converge because the Reference Avatar runtime plan already targets it.

### CODEX-HNK symbols
Confirmed candidates include:
- `apps/mobile/assets/day-022/dai-koo-myo-usui-hnk-master-v1.svg`
- `apps/mobile/assets/day-022/dai-koo-myo-usui-hnk-stroke-order-v1.svg`
Classification: HOLD / symbols candidate. Preserve CODEX provenance; no automatic canon promotion.

### HNK-KODE glyph registry
`@hnk/glyphs` provides HNK40 semantic/runtime registry data: G01..G40, candidate PUA range, IPA and transliteration bindings. Its current status is explicitly `PREPRODUCTION_NOT_OFFICIAL`.
Classification: MERGE CONTRACT/REGISTRY; NOT a final visual-asset promotion.
Authority boundary: never automatically merge HNK linguistic glyphs with SIGILKODE sigils.

### Cubo-HNK
HNK Oraculum Cube is primarily protocol/runtime/QA/release evidence and its current RC1 is not automatically HNK_CANON.
Classification: ARCHIVE/REFERENCE for asset convergence unless a specific reusable physical asset is later identified.

### Baratozando
Contains a mature art pipeline: source atlases, prototype extractions, asset contracts, animation contracts, manifests and deterministic material provenance.
Classification: MERGE PIPELINE/PATTERNS. Physical cockroach/cellar art remains HOLD / project-specific unless explicitly approved for Strangeverse.
Reusable patterns include source/runtime separation, SHA-256 provenance, explicit animation-state contracts and material manifests.

## Migration rules
1. Inventory before copying.
2. Preserve source repository, path, hash and authority metadata.
3. Verify SHA-256 manifests when present.
4. Never silently rename runtime filenames referenced by contracts.
5. Keep source/master and optimized runtime assets distinct.
6. Compare duplicates before choosing a canonical asset.
7. Semantic compatibility does not equal visual canon approval.
8. Project-specific art does not enter Strangeverse merely because it exists in another Tehkne/HNK repository.
9. No status/canon promotion is implied by copying.

## Execution order
1. Tecnomage Prime V2.8 physical package.
2. Character animation/runtime binding.
3. HNK symbols/glyph contracts with authority boundaries preserved.
4. Shimokodes/creatures sweep.
5. Worlds/environment/props/materials sweep.
6. VFX/audio/UI sweep.
7. Catalog + provenance manifest + duplicate resolution.

## Acceptance for Phase 1
- Tecnomage package physically available at HNK-VERSE runtime paths.
- Source and runtime variants catalogued.
- Existing hashes/provenance preserved and verifiable.
- Reference Avatar policy resolves to physical assets.
- No unrelated project-specific asset imported implicitly.
