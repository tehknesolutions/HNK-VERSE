# HNK-VERSE — CODEX / TEHKNE-OS Alignment Phase

Status: ACTIVE
Date: 2026-09-27

## Intent
While Asset Forge binary transport is blocked, HNK-VERSE advances through knowledge architecture, contracts, code architecture and implementation-ready specifications.

## Authority chain
1. `codex-hnk` — ROOT_CANON and fundamental HNK contract publisher.
2. `HNK-KODE` — linguistic DOMAIN_CANON target.
3. `tehkne-os` — ecosystem registry, memory, archaeology, evidence and process-intelligence source; not HNK semantic owner.
4. `HNK-VERSE` — manifestation runtime, canon consumer and experience/evidence producer.

## Synthesized architecture
HNK-VERSE consumes versioned canonical references and emits typed runtime evidence. It MUST distinguish authority lifecycle from evidence maturity.

Knowledge lifecycle: `RAW → OBSERVED → EXPERIMENTAL → REVIEWED → APPROVED → CANON` plus `REJECTED | SUPERSEDED | DEPRECATED | ARCHIVED`.

Evidence maturity: `UNVERIFIED → OBSERVED → TESTED → VALIDATED → CERTIFIED`.

Authority levels: `ROOT_CANON | DOMAIN_CANON | PRODUCT_CANON | IMPLEMENTATION_AUTHORITY | PROJECTION | EVIDENCE_SOURCE | HISTORICAL_SOURCE`.

These dimensions MUST NOT be collapsed into one status.

## Runtime invariant
`SOURCE != CLAIM != EVIDENCE != DECISION != CANON`
`IMPLEMENTED != EXECUTED != APPROVED`
`EXPERIENCE != INTERPRETATION != EVIDENCE != CANON`
`CONSUMER != AUTHORITY_OWNER`

## Knowledge bridge
The runtime bridge uses typed Knowledge Objects carrying identity, lifecycle, scoped authority, evidence state, sources, evidence references, typed relations, temporal scope and payload.

HNK-VERSE may create `EVIDENCE_SOURCE`, `PRODUCT_CANON` and `IMPLEMENTATION_AUTHORITY` objects within its own declared scope. It may reference ROOT/DOMAIN canon but MUST NOT manufacture those authorities.

## GIP execution mapping
- Discovery → intent/scope/product requirement.
- Architecture → contracts, schemas, world/system boundaries.
- Development → bounded implementation increments.
- Validation → tests/evidence before checkpoint.
- Deploy → manifestation of a validated release.

This is an engineering workflow, not a metaphysical/canonical ontology.

## RAG/retrieval mapping
For knowledge-assisted runtime/tooling, retrieval priority is `CANONICAL > CODEX > SOURCE > HISTORY > EXPERIMENTAL`, after domain/intention routing. Every derived answer/projection should remain rebuildable from authoritative sources.

## Code target
`@hnk-verse/contracts/knowledge` implements the first machine-readable bridge. Next layers: knowledge registry, provenance ledger adapter, CODEX resolver integration, evidence exporter to TKN-OS, and contract tests.

## Asset Forge relation
Asset provenance is a specialization of the same model: physical asset identity + source + hash + authority + evidence + runtime projection. Binary transport remains a separate gate and does not block architecture work.
