import type { HnkKnowledgeObject } from '@hnk-verse/contracts';
import type { KnowledgeRegistry } from './knowledge-registry.ts';
import type { ProvenanceLedger } from './provenance-ledger.ts';
import { queryKnowledge, type KnowledgeQuery } from './knowledge-query-policy.ts';

export type KnowledgeConsumer = {
  kind: 'AGENT' | 'WORLD' | 'SYSTEM';
  id: string;
};

export type KnowledgeAccessRequest = {
  requestId: string;
  consumer: KnowledgeConsumer;
  query: KnowledgeQuery;
  requestedAt: string;
};

export type KnowledgeAccessGrant = {
  requestId: string;
  consumer: KnowledgeConsumer;
  granted: HnkKnowledgeObject[];
  denied: Array<{ id: string; reason: string }>;
};

export function accessKnowledge(
  registry: KnowledgeRegistry,
  ledger: ProvenanceLedger,
  request: KnowledgeAccessRequest,
): KnowledgeAccessGrant {
  if (!request.requestId || !request.consumer?.id || !request.requestedAt) throw new Error('KNOWLEDGE_ACCESS_IDENTITY_REQUIRED');
  const result = queryKnowledge(registry, request.query);

  for (const object of result.objects) {
    ledger.append({
      id: `access:${request.requestId}:${object.id}`,
      subjectRef: object.id,
      sourceRef: `${request.consumer.kind}:${request.consumer.id}`,
      sourceSystem: 'HNK-VERSE',
      operation: 'PROJECT',
      recordedAt: request.requestedAt,
      metadata: {
        requestId: request.requestId,
        consumerKind: request.consumer.kind,
        consumerId: request.consumer.id,
        authorityLevel: object.authorityLevel,
        lifecycle: object.lifecycle,
      },
    });
  }

  return {
    requestId: request.requestId,
    consumer: request.consumer,
    granted: result.objects,
    denied: result.rejected,
  };
}
