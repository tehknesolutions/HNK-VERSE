# HNK Ecosystem Authority Charter

Status: ARCHITECTURAL DECISION
Date: 2026-09-27

## Core decision

The HNK ecosystem is federated. Each repository/system keeps its own identity, authority and purpose.

The systems are connected by typed references, contracts, provenance and lineage. They are not collapsed into one repository or one canon.

## TKN-OS

TKN-OS is the institutional memory and knowledge-management repository of Tehkné.

It gathers and relates material produced across chats, projects, Git repositories, documents, experiments, decisions, implementations, historical work, evidence, reusable know-how and the Compendium Library.

TKN-OS answers: What have we done, studied, tested, learned and accumulated, where did it come from, and how is it related?

TKN-OS preserves provenance and lineage and can identify reusable patterns. TKN-OS does not automatically own the canon of another system.

## CODEX-HNK

CODEX-HNK is the central HNK repository and canonical registry.

It is the home of the HNK Bible-Grimoire and the structured record of HNK itself.

Its responsibility includes the governed registration of HNK principles, ontology, structures, language/contracts where appropriate, HNK-Math, Mandala structures, canonical correspondences, canonical entities and relationships.

CODEX-HNK answers: What is HNK, what belongs to HNK, and what is the governed record of HNK?

Material arriving from TKN-OS becomes HNK canon only through the appropriate authority/review process. Historical presence in TKN-OS is not sufficient for canon status.

## HNK-KODE

HNK-KODE is the language/manifestation authority for HNK language and the operational expression of HNK intentions into physical/digital reality where its canon grants that responsibility.

It consumes appropriate CODEX-HNK contracts and does not replace CODEX-HNK as the central HNK registry.

## HNK-VERSE

HNK-VERSE is the digital/astral/mental manifestation runtime of HNK.

It consumes governed HNK contracts and manifests them through Verses and Kodans.

HNK-VERSE is a manifestation runtime, consumer of HNK canon, producer of runtime experience, producer of observations/evidence, and source of implementation feedback.

Runtime events, experiments or experiences do not automatically become CODEX-HNK canon.

## Compendium Library

The Compendium Library is a knowledge/source collection.

A compendium is source material unless separately promoted through an authority process.

SOURCE MATERIAL != HNK CANON

A compendium may inform study, retrieval, synthesis, experimentation and evidence collection without becoming canonical merely by being stored.

## Authority relationships

Use typed relationships such as DOCUMENTS, DERIVED_FROM, EXTRACTED_FROM, CONSUMES, IMPLEMENTS, PRODUCES, VALIDATED_BY, AUTHORIZED_BY, DEPENDS_ON, FEDERATES_WITH and EVOLUTIONARY_PRECURSOR.

Important distinctions:

DOCUMENTS != OWNS
DERIVED_FROM != SUPERSEDES
CONSUMES != AUTHORIZES
PRODUCES != CANONICALIZES
EXPERIENCE != INTERPRETATION != EVIDENCE != CANON
IMPLEMENTED != EXECUTED != APPROVED
PRODUCT_RELEASE != HNK_CANON

## Canon promotion

Expected candidate path:

SOURCE / EVIDENCE → CLASSIFIED → CANDIDATE → REVIEWED → APPROVED → CANON

The exact gate and responsible authority depend on the domain.

No repository should silently promote another authority's material.

## Cross-system flow

TEHKNÉ ECOSYSTEM
→ TKN-OS: memory / lineage / know-how
→ CODEX-HNK: HNK canon
→ HNK-KODE: HNK language and manifestation contracts
→ HNK-VERSE: manifestation runtime
→ Verse / Kodan → Runtime → Observation / Evidence → Chronicle

Runtime output may return to TKN-OS or CODEX-HNK only through governed paths. Runtime output is not automatically synchronized into both repositories.

## Separation invariant

TKN-OS remembers Tehkné ecosystem work.

CODEX-HNK records HNK canon.

HNK-KODE governs HNK language/manifestation contracts within its authority.

HNK-VERSE manifests HNK reality.

The Compendium Library supplies source material.

Each remains each.

## Implementation consequence

HNK-VERSE must not create a universal everything table or repository abstraction that erases these boundaries.

Integration should use stable IDs, typed references, provenance, authority references, lineage edges, versioned contracts and explicit promotion/reconciliation gates.

This charter supersedes earlier architectural wording that implied TKN-OS and CODEX-HNK could be treated as the same knowledge authority.
