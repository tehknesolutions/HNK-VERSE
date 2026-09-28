import type { CapabilityNegotiationRequest, CapabilityNegotiationResult, VerseCapabilityManifest } from '@hnk-verse/contracts';
export function negotiateCapabilities(manifest: VerseCapabilityManifest, request: CapabilityNegotiationRequest): CapabilityNegotiationResult {
  if (manifest.verseId !== request.verseId) return { accepted:false, verseId:request.verseId, code:'VALIDATION_FAILED', rejectedCapabilities:request.requestedCapabilities, correlationId:request.correlationId };
  for (const required of request.requiredContracts ?? []) {
    const actual=manifest.platformCompatibility.find(c=>c.name===required.name);
    if (!actual || actual.version!==required.version) return { accepted:false, verseId:manifest.verseId, code:'INCOMPATIBLE_VERSION', rejectedCapabilities:request.requestedCapabilities, correlationId:request.correlationId };
  }
  const unsupported:string[]=[];
  for (const id of request.requestedCapabilities) {
    const cap=manifest.capabilities.find(c=>c.capabilityId===id);
    if (!cap || cap.state==='UNSUPPORTED' || cap.state==='DEPRECATED') { unsupported.push(id); continue; }
    for (const permission of cap.requiredPermissions ?? []) if (!request.grantedPermissions.includes(permission))
      return { accepted:false, verseId:manifest.verseId, code:'PERMISSION_DENIED', rejectedCapabilities:[id], correlationId:request.correlationId };
  }
  if (unsupported.length) return { accepted:false, verseId:manifest.verseId, code:'UNSUPPORTED_CAPABILITY', rejectedCapabilities:unsupported, correlationId:request.correlationId };
  return { accepted:true, verseId:manifest.verseId, acceptedCapabilities:request.requestedCapabilities, correlationId:request.correlationId };
}