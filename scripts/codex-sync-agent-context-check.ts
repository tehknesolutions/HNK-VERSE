import type { HnkKnowledgeObject } from '@hnk-verse/contracts';
import {
  KnowledgeRegistry, ProvenanceLedger, applyCodexSync, buildAgentKnowledgeContext,
  buildWorldKnowledgeContext, buildSystemKnowledgeContext, queryKnowledge,
  accessKnowledge, KnowledgeMemory, deriveKnowledgeEvidence,
} from '@hnk-verse/domain';

function assert(condition: unknown, message: string): asserts condition { if (!condition) throw new Error(message); }
const registry = new KnowledgeRegistry(); const ledger = new ProvenanceLedger();
const root: HnkKnowledgeObject = { id:'CODEX-HNK-ROOT-001', type:'CODEX_CANON', title:'HNK root fixture', lifecycle:'CANON', authorityScope:'HNK', authorityLevel:'ROOT_CANON', evidenceState:'CERTIFIED', sources:['codex-hnk:test'], relations:[{type:'ROOT_OF',target:'HNK-VERSE'}], tags:['HNK'] };
const domain: HnkKnowledgeObject = { id:'CODEX-HNK-TECH-001', type:'CODEX_TECHNOLOGY_CANON', title:'Technology fixture', lifecycle:'CANON', authorityScope:'CODEX-HNK/TECNOLOGIA', authorityLevel:'DOMAIN_CANON', evidenceState:'VALIDATED', sources:['codex-hnk:technology:test'], relations:[{type:'DOMAIN_CANON_FOR',target:'HNK-VERSE'}], tags:['TECNOLOGIA','SYSTEM:KNOWLEDGE'] };
const world: HnkKnowledgeObject = { id:'WORLD-ZERO-001', type:'WORLD_KNOWLEDGE', title:'ZERO world fixture', lifecycle:'APPROVED', authorityScope:'HNK-VERSE', authorityLevel:'PRODUCT_CANON', evidenceState:'VALIDATED', sources:['hnk-verse:test'], relations:[{type:'IMPLEMENTS',target:'ZERO'}], tags:['WORLD','WORLD:ZERO'] };

const sync=applyCodexSync({syncId:'SYNC-001',source:'CODEX-HNK',sourceVersion:'1.0.0-test',generatedAt:'2026-09-27T00:00:00Z',objects:[domain,root]},registry,ledger);
assert(sync.accepted.length===2,'CODEX sync should accept canonical fixtures'); assert(ledger.all().length===2,'CODEX sync provenance must be recorded'); registry.ingest(world);
let forgedSourceBlocked=false; try { applyCodexSync({syncId:'FORGED',source:'TEHKNE-OS',sourceVersion:'x',generatedAt:'2026-09-27T00:02:00Z',objects:[]} as never,registry,ledger); } catch(error){ forgedSourceBlocked=(error as Error).message==='CODEX_SYNC_SOURCE_INVALID'; }
assert(forgedSourceBlocked,'runtime source forgery must be blocked');
const beforeRegistry=registry.list().length; const beforeLedger=ledger.all().length; let atomicConflictBlocked=false;
try { applyCodexSync({syncId:'SYNC-001',source:'CODEX-HNK',sourceVersion:'2.0.0-test',generatedAt:'2026-09-27T00:03:00Z',objects:[{...domain,title:'Changed canonical fixture'}]},registry,ledger); } catch(error){ atomicConflictBlocked=(error as Error).message==='CODEX_SYNC_PROVENANCE_CONFLICT'; }
assert(atomicConflictBlocked,'reused sync identity with changed content must be blocked'); assert(registry.list().length===beforeRegistry,'failed sync must not mutate registry'); assert(ledger.all().length===beforeLedger,'failed sync must not mutate provenance'); assert(registry.require(domain.id).title===domain.title,'failed sync must preserve canonical object');

registry.ingest({id:'REJECTED-001',type:'EXPERIMENT',title:'Rejected fixture',lifecycle:'REJECTED',authorityScope:'HNK-VERSE',authorityLevel:'PROJECTION',sources:['test'],relations:[],tags:['TECNOLOGIA','WORLD:ZERO']});
const agent=buildAgentKnowledgeContext(registry,{limit:10}); assert(agent.objects[0]?.authorityLevel==='ROOT_CANON','agent context must prioritize root canon'); assert(!agent.objects.some(o=>o.lifecycle==='REJECTED'),'rejected knowledge must never enter agent context');
const policy=queryKnowledge(registry,{tags:['TECNOLOGIA'],limit:10}); assert(policy.objects.some(o=>o.id===domain.id),'technology query must return technology canon'); assert(!policy.objects.some(o=>o.lifecycle==='REJECTED'),'policy query must block rejected knowledge'); assert(policy.rejected.some(o=>o.id==='REJECTED-001'&&o.reason==='REJECTED'),'policy must expose rejection reason');
const worldContext=buildWorldKnowledgeContext(registry,'ZERO'); assert(worldContext.objects.some(o=>o.id===root.id),'world context must inherit root canon'); assert(worldContext.objects.some(o=>o.id===world.id),'world context must include scoped world knowledge'); assert(!worldContext.objects.some(o=>o.id==='REJECTED-001'),'world context must exclude rejected knowledge');
const systemContext=buildSystemKnowledgeContext(registry,'KNOWLEDGE'); assert(systemContext.objects.some(o=>o.id===root.id),'system context must inherit root canon'); assert(systemContext.objects.some(o=>o.id===domain.id),'system context must include scoped domain canon');

const access=accessKnowledge(registry,ledger,{requestId:'ACCESS-001',consumer:{kind:'AGENT',id:'AGENT-001'},query:{tags:['TECNOLOGIA'],limit:4},requestedAt:'2026-09-27T00:04:00Z'});
assert(access.granted.some(o=>o.id===domain.id),'access gateway must grant policy-approved canon');
assert(ledger.forSubject(domain.id).some(r=>r.id==='access:ACCESS-001:CODEX-HNK-TECH-001'),'access must create provenance');
const memory=new KnowledgeMemory();
memory.remember({memoryId:'MEM-001',consumerKind:'AGENT',consumerId:'AGENT-001',knowledgeId:domain.id,state:'LEARNED',learnedAt:'2026-09-27T00:04:00Z',updatedAt:'2026-09-27T00:04:00Z'});
memory.remember({memoryId:'MEM-001',consumerKind:'AGENT',consumerId:'AGENT-001',knowledgeId:domain.id,state:'RETAINED',learnedAt:'2026-09-27T00:04:00Z',updatedAt:'2026-09-27T00:05:00Z'});
assert(memory.retainedKnowledgeIds('AGENT','AGENT-001').includes(domain.id),'learned knowledge must be retainable');
const derivedMemory=memory.remember({memoryId:'MEM-DERIVE-001',consumerKind:'AGENT',consumerId:'AGENT-001',knowledgeId:'EVIDENCE-DERIVED-001',state:'DERIVED',updatedAt:'2026-09-27T00:06:00Z',sourceMemoryIds:['MEM-001']});
const derived:HnkKnowledgeObject={id:'EVIDENCE-DERIVED-001',type:'AGENT_DERIVATION',title:'Derived evidence fixture',lifecycle:'OBSERVED',authorityScope:'HNK-VERSE',authorityLevel:'EVIDENCE_SOURCE',evidenceState:'OBSERVED',sources:[domain.id],relations:[{type:'DERIVED_FROM',target:domain.id}]};
deriveKnowledgeEvidence(domain,derivedMemory,derived,ledger); assert(ledger.forSubject(derived.id).some(r=>r.operation==='DERIVE'),'derived knowledge must retain lineage');
let canonEscalationBlocked=false; try { deriveKnowledgeEvidence(domain,derivedMemory,{...derived,id:'ILLEGAL-CANON',lifecycle:'CANON',authorityLevel:'ROOT_CANON'},ledger); } catch { canonEscalationBlocked=true; }
assert(canonEscalationBlocked,'memory derivation must not escalate itself to canon');
memory.remember({memoryId:'MEM-FORGET-001',consumerKind:'AGENT',consumerId:'AGENT-001',knowledgeId:world.id,state:'FORGOTTEN',updatedAt:'2026-09-27T00:07:00Z'});
let reactivationBlocked=false; try { memory.remember({memoryId:'MEM-FORGET-001',consumerKind:'AGENT',consumerId:'AGENT-001',knowledgeId:world.id,state:'RETAINED',updatedAt:'2026-09-27T00:08:00Z'}); } catch { reactivationBlocked=true; }
assert(reactivationBlocked,'forgotten memory must require a new identity to reactivate');
console.log('codex-sync-agent-context-check: PASS');
