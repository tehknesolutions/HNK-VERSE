import type { InteropOutcome, InteropProvenance, InteropOutcomeKind } from '@hnk-verse/contracts';

export type InteropRequest = {
  sourceRef: string;
  sourceAuthority: string;
  targetContextRef: string;
  contractVersion: string;
  outcome: InteropOutcomeKind;
  mapperRef?: string;
  reason?: string;
  resultRef?: string;
  projectionRef?: string;
};

export type InteropEngineDeps = {
  allocateResultRef(request: InteropRequest): string;
};

const provenance=(request:InteropRequest):InteropProvenance=>({
  sourceRef:request.sourceRef,
  sourceAuthority:request.sourceAuthority,
  targetContextRef:request.targetContextRef,
  contractVersion:request.contractVersion,
  ...(request.mapperRef?{mapperRef:request.mapperRef}:{}),
});

export class InteropEngine {
  private readonly deps: InteropEngineDeps;
  constructor(deps: InteropEngineDeps) { this.deps = deps; }

  execute(request:InteropRequest):InteropOutcome {
    if (request.outcome==='REJECT') return {kind:'REJECT',reason:request.reason??'INTEROP_REJECTED',provenance:provenance(request)};
    if (request.outcome==='REFERENCE') return {kind:'REFERENCE',sourceRef:request.sourceRef,provenance:provenance(request)};
    if (request.outcome==='PROJECT') return {kind:'PROJECT',sourceRef:request.sourceRef,projectionRef:request.projectionRef??this.deps.allocateResultRef(request),provenance:provenance(request)};
    if (request.outcome==='TRANSLATE') {
      if (!request.mapperRef) return {kind:'REJECT',reason:'TRANSLATION_MAPPER_REQUIRED',provenance:provenance(request)};
      return {kind:'TRANSLATE',sourceRef:request.sourceRef,resultRef:request.resultRef??this.deps.allocateResultRef(request),mapperRef:request.mapperRef,provenance:provenance(request)};
    }
    if (request.outcome==='TRANSFER') return {kind:'TRANSFER',sourceRef:request.sourceRef,resultRef:request.resultRef??this.deps.allocateResultRef(request),provenance:provenance(request)};
    return {kind:'CLONE',sourceRef:request.sourceRef,resultRef:request.resultRef??this.deps.allocateResultRef(request),provenance:provenance(request)};
  }
}
