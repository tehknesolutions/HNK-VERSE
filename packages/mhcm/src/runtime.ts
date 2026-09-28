import type { HnkIrNode } from './ir.ts';

export type RuntimeManifestation = {
  commandType: 'StartSession';
  irId: string;
  irType: HnkIrNode['type'];
  provenance: HnkIrNode['metadata']['provenance'];
  payload: {
    irId: string;
    irOp: HnkIrNode['op'];
  };
};

/**
 * Minimal MHCM-7 boundary adapter.
 * It intentionally maps IR to the existing deterministic runtime handshake
 * rather than inventing a new world command. This proves reachability only;
 * it does not claim semantic execution of a Path/Glyph yet.
 */
export function irToRuntimeManifestation(ir: HnkIrNode): RuntimeManifestation {
  return {
    commandType: 'StartSession',
    irId: ir.id,
    irType: ir.type,
    provenance: ir.metadata.provenance,
    payload: {
      irId: ir.id,
      irOp: ir.op,
    },
  };
}
