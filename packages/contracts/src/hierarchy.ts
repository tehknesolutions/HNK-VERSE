export const HNK_SYSTEM = {
  root: 'HNK',
  codex: {
    id: 'CODEX-HNK',
    roles: ['REGISTRY', 'GRIMOIRE', 'TRAINING'] as const,
    vertents: ['MAGICO', 'ESPIRITUAL', 'TECNOLOGIA', 'ARTE', 'CIENTIFICO'] as const,
  },
  kode: {
    id: 'HNK-KODE',
    roles: ['HNK_LANGUAGE', 'SPIRITUAL_LANGUAGE', 'MAGIC_PHYSICAL_MANIFESTATION'] as const,
  },
  verse: {
    id: 'HNK-VERSE',
    manifestation: ['DIGITAL', 'ASTRAL', 'MENTAL'] as const,
  },
  organization: {
    id: 'GID/HNK',
    blocks: ['TEHKNE_SOLUTIONS', 'SIMPLEWAY_ACADEMY', 'HANDS_UP_CONSULTORIA'] as const,
  },
  technologyPlacement: ['HNK', 'CODEX-HNK', 'TECNOLOGIA', 'TEHKNE_SOLUTIONS', 'TEHKNE-OS'] as const,
} as const;

export type CodexVertent = (typeof HNK_SYSTEM.codex.vertents)[number];
export type HnkManifestationPlane = (typeof HNK_SYSTEM.verse.manifestation)[number];
export type GidBlock = (typeof HNK_SYSTEM.organization.blocks)[number];

export type TechnologyProvenance = {
  sourceSystem: 'TEHKNE-OS';
  sourceOrganization: 'TEHKNE_SOLUTIONS';
  codexVertent: 'TECNOLOGIA';
  sourceRef: string;
  evidenceRefs?: string[];
};

export type GovernedTechnologyRef = {
  source: 'codex-hnk';
  vertent: 'TECNOLOGIA';
  canonicalId: string | null;
  resolution: 'resolved' | 'pending';
  provenance: TechnologyProvenance;
  promotion: 'EVIDENCE' | 'CANDIDATE' | 'APPROVED' | 'CANONICAL';
};

export function canTechnologyRefActAsCanon(ref: GovernedTechnologyRef): boolean {
  return ref.resolution === 'resolved' && ref.canonicalId !== null && ref.promotion === 'CANONICAL';
}

export function assertTechnologyPlacement(path: readonly string[]): boolean {
  return path.join('>') === HNK_SYSTEM.technologyPlacement.join('>');
}
