import type { CanonicalCodexRef, PendingCodexRef } from '@hnk-verse/contracts';

export type CodexResolution = {
  internalRef: string;
  canonicalId: string;
  version: string;
  hash?: string;
  status: 'approved' | 'candidate';
};

export class CodexResolver {
  readonly #resolutions = new Map<string, CodexResolution>();

  register(resolution: CodexResolution): void {
    if (!resolution.internalRef || !resolution.canonicalId || !resolution.version) throw new Error('CODEX_RESOLUTION_IDENTITY_REQUIRED');
    this.#resolutions.set(resolution.internalRef, resolution);
  }

  resolve(ref: PendingCodexRef): CanonicalCodexRef | PendingCodexRef {
    const resolution = this.#resolutions.get(ref.internalRef);
    if (!resolution) return ref;
    return {
      source: 'codex-hnk',
      resolution: 'resolved',
      canonicalId: resolution.canonicalId,
      version: resolution.version,
      hash: resolution.hash,
      status: resolution.status,
    };
  }
}
