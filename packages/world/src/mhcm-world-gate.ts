import { executeMhcmOperator, type HnkIrNode } from '@hnk-verse/mhcm';
import type { PlatformPresence } from './identity-presence.ts';

export type MhcmWorldProposal = {
  effect: 'PROPOSAL_ONLY';
  ir: HnkIrNode;
  presence: PlatformPresence;
  authority: {
    identityId: string;
    sessionId: string;
    presenceId: string;
  };
};

export function evaluateMhcmWorldOperation(
  operator: 'PATH_REVERSE' | 'PATH_COMPOSE',
  inputs: HnkIrNode[],
  presence: PlatformPresence,
): MhcmWorldProposal {
  const execution = executeMhcmOperator(operator, inputs);
  return {
    effect: 'PROPOSAL_ONLY',
    ir: execution.result,
    presence,
    authority: {
      identityId: presence.identityId,
      sessionId: presence.sessionId,
      presenceId: presence.id,
    },
  };
}
