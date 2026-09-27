# Cognitive Session + Cognitive State — Design Specification

Status: DESIGN APPROVED / IMPLEMENTATION NOT YET AUTHORIZED
Date: 2026-09-27
Repository: `tehknesolutions/HNK-VERSE`
Branch: `feat/codex-sync-agent-context`

## 1. Intent

Create an auditable cognitive-session subsystem for HNK-VERSE consumers (`AGENT`, `WORLD`, `SYSTEM`) that unifies governed CODEX context, knowledge access, observations, working memory, retained memory, derivations and evidence without granting runtime cognition authority to modify HNK canon.

Success means a consumer can perceive, consult, learn, retain, forget, derive and produce evidence with complete lineage while canonical authority remains external to the cognitive session and governed by CODEX-HNK.

## 2. Governing invariants

```text
Observation != Interpretation != Derivation != Evidence != Canon
Knowing != Learning != Retaining != Deriving != Canonizing
CognitiveSession != CanonAuthority
Memory != CanonAuthority
Agent != CanonAuthority
Derivation != CanonAuthority
```

A session may consume governed canon and produce evidence/candidates. It MUST NOT create `ROOT_CANON`, `DOMAIN_CANON`, or lifecycle `CANON` through cognition or memory derivation.

## 3. Persistence decision

The approved working-memory policy is model B:

- complete working-memory history is preserved for audit;
- only memory explicitly transitioned to `RETAINED` may automatically influence a future cognitive session;
- transient working-memory entries do not bootstrap future cognition;
- `FORGOTTEN` memory remains in historical audit but is excluded from automatic retrieval;
- reactivation of forgotten material requires a new memory identity.

The subsystem uses a hybrid persistence model:

1. mutable operational state while a session is active;
2. append-only journal/provenance for significant cognitive facts;
3. immutable final `CognitiveSessionReport` when the session closes.

## 4. Components

### CognitiveSessionManager

Owns session lifecycle. It opens a session, binds its consumer and governed context snapshot, applies valid cognitive operations, initiates closing, seals the report and prevents post-close mutation.

### CognitiveState

Represents current operational cognition for the session: active context refs, observations, accessed knowledge refs, working-memory entries, retained-memory refs, derivations and evidence refs.

### ObservationJournal

Records perceptions from World/System/runtime. An observation is not automatically knowledge, evidence or canon. Interpretations derived from observations must remain explicitly typed and traceable.

### WorkingMemory

Stores transient session cognition. Its complete history is included in the final report, but entries influence future sessions only when explicitly promoted to `RETAINED` through valid memory transitions.

### KnowledgeMemory

Reuses the existing governed memory lifecycle:

```text
EXPOSED -> LEARNED -> RETAINED
LEARNED/RETAINED -> DERIVED
EXPOSED/LEARNED/RETAINED -> FORGOTTEN
```

`DERIVED` content requires lineage. `FORGOTTEN` content cannot be silently reactivated under the same memory identity.

### CognitiveSessionReport

Immutable closing boundary between runtime cognition and governance. It records what happened without granting canonical status to the contents.

## 5. Session state machine

```text
OPEN -> ACTIVE -> CLOSING -> CLOSED
```

- `OPEN`: identity and initial governed context are established.
- `ACTIVE`: cognitive operations are permitted.
- `CLOSING`: no new cognitive work is accepted; final validation and report sealing occur.
- `CLOSED`: immutable terminal state.

A closed session is never reopened. Continuation creates a new session with `previousSessionId` referencing the prior report.

## 6. Bootstrap rules

A new session receives:

1. permitted `ROOT_CANON` / `DOMAIN_CANON` through the existing governed knowledge access/query layer;
2. scoped World/System/Agent context as applicable;
3. only `RETAINED` memory eligible for automatic carry-forward;
4. references to the previous session/report when continuing a consumer history.

Historical `EXPOSED`, `LEARNED`, transient working memory and `FORGOTTEN` entries remain auditable but are not automatically injected into the new active state.

## 7. Cognitive flow

```text
Start CognitiveSession
  -> load governed CODEX context
  -> recover eligible RETAINED memory
  -> create CognitiveState
  -> observe World/System
  -> request governed Knowledge Access
  -> update Working Memory
  -> learn / retain / forget
  -> derive with mandatory lineage
  -> produce Evidence
  -> enter CLOSING
  -> validate state + provenance
  -> seal CognitiveSessionReport
  -> CLOSED
  -> evidence enters CODEX review flow
```

## 8. Data contracts

### CognitiveSessionIdentity

Required fields:

- `sessionId`
- `consumerKind: AGENT | WORLD | SYSTEM`
- `consumerId`
- `startedAt`
- optional `previousSessionId`
- governed context snapshot reference/hash

### CognitiveObservation

Required fields:

- observation identity
- session identity
- observer identity
- timestamp
- source/runtime reference
- observed payload
- optional interpretation refs

An observation MUST NOT carry canonical authority merely because it was perceived by a runtime consumer.

### WorkingMemoryEntry

Required fields:

- entry identity
- session identity
- source refs
- created/updated timestamps
- content/payload
- current disposition

Disposition is session-local unless a valid transition creates/updates a governed `KnowledgeMemoryRecord`.

### CognitiveDerivation

Required fields:

- derivation identity
- session identity
- source knowledge/memory/observation refs
- derived payload/reference
- timestamp
- provenance reference

A derivation without lineage is invalid.

### CognitiveEvidence

Evidence produced by cognition uses the existing HNK-VERSE evidence/provenance path. It is an evidence candidate for governance, never automatic canon.

### CognitiveSessionReport

Required contents:

- session + consumer identity
- previous session reference when applicable
- initial governed-context refs/version/hash
- knowledge-access records/refs
- observation journal
- complete working-memory history
- memory transitions
- retained-memory refs
- forgotten-memory refs
- derivations + lineage refs
- evidence refs
- provenance refs
- start/close timestamps
- close reason
- deterministic report identity/hash strategy

The report SHOULD reference CODEX objects by IDs, versions/hashes and provenance instead of duplicating complete canonical payloads unnecessarily.

## 9. Error model and atomicity

Required domain failures:

- `SESSION_NOT_ACTIVE`
- `INVALID_MEMORY_TRANSITION`
- `KNOWLEDGE_NOT_GRANTED`
- `DERIVATION_WITHOUT_LINEAGE`
- `CANON_ESCALATION_FORBIDDEN`
- `SESSION_ALREADY_CLOSED`

Operations capable of failure MUST be preflighted before committing significant cognitive state/provenance mutations. A failed operation must not leave a partial cognitive transaction.

Closing follows the same principle: validate the complete close operation before sealing the immutable report.

## 10. Authority boundaries

The session consumes authority; it does not manufacture it.

Forbidden outcomes include:

```text
CognitiveSession -> ROOT_CANON
CognitiveSession -> DOMAIN_CANON
WorkingMemory -> CANON
KnowledgeMemory -> CANON
AgentDerivation -> CANON
Observation -> CANON
```

Allowed upward flow:

```text
Observation / Access / Memory / Derivation
                -> Evidence
                -> Provenance
                -> CODEX review
                -> authorized governance decision
                -> possible canonical promotion outside the session
```

## 11. Integration with existing knowledge architecture

The subsystem builds on, rather than replaces:

- `KnowledgeRegistry`
- `CodexResolver`
- `ProvenanceLedger`
- `EvidenceBridge`
- `AgentKnowledgeContext`
- World/System knowledge contexts
- `KnowledgeQueryPolicy`
- `KnowledgeAccess`
- `KnowledgeMemory`
- CODEX Sync

The cognitive subsystem orchestrates these capabilities behind a session boundary. It must not introduce a second registry, provenance system, memory authority or canon store.

## 12. Test design / acceptance criteria

The implementation gate must demonstrate at minimum:

1. complete `OPEN -> ACTIVE -> CLOSING -> CLOSED` session;
2. bootstrap with permitted `ROOT_CANON`;
3. governed access to relevant `DOMAIN_CANON`;
4. observations remain observations and do not auto-promote;
5. transient working memory does not bootstrap the next session;
6. `RETAINED` memory is eligible for the next session bootstrap;
7. `FORGOTTEN` memory is not automatically recovered;
8. forgotten-memory reactivation under the same identity is rejected;
9. derivation without lineage is rejected;
10. cognitive derivation cannot create lifecycle `CANON`;
11. cognitive derivation cannot create `ROOT_CANON` or `DOMAIN_CANON`;
12. closed session is immutable;
13. failed operations do not leave partial state/provenance;
14. provenance reconstructs knowledge access and derivation lineage;
15. final report is deterministic for the same accepted cognitive history;
16. continuation uses a new session identity linked through `previousSessionId`.

## 13. Out of scope

This design does not authorize:

- autonomous canonical promotion;
- hidden memory outside governed persistence;
- semantic/vector retrieval implementation changes unrelated to session orchestration;
- model-provider selection;
- autonomous goals/planning beyond the cognitive-session contract;
- replacement of CODEX-HNK governance;
- reopening/mutating sealed historical sessions.

## 14. Completion criterion

The subsystem is architecturally complete when an HNK-VERSE consumer can:

```text
perceive
-> consult governed knowledge
-> learn
-> retain or forget
-> reason/derive with lineage
-> produce evidence
-> close an auditable session
```

while every transition remains reconstructible and no runtime cognitive component can redefine HNK canon by itself.
