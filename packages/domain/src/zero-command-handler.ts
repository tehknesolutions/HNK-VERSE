import {
  ZERO_IDS,
  ZERO_PENDING_MALKUTH_CODEX_REF,
  ZERO_VALI_LANGUAGE_REF,
  type HnkCommand,
  type HnkEvent,
  type ZeroRejectionCode,
} from '@hnk-verse/contracts';
import {
  ZERO_WORLD_POSITIONS,
  insideZeroLand,
  isHomeThresholdCell,
  isStaticSolidCell,
  isWithinInteractionRange,
  manhattanDistance,
  type ZeroLogicalPoint,
} from '@hnk-verse/world';
import type { ZeroWorldState } from './zero-state.ts';

export type ZeroCommandDecision =
  | {
      accepted: true;
      events: HnkEvent<unknown>[];
      data?: Record<string, unknown>;
    }
  | {
      accepted: false;
      events: [];
      rejectionCode: ZeroRejectionCode;
      data?: Record<string, unknown>;
    };

type Payload = Record<string, unknown>;

function payloadOf(command: HnkCommand<unknown>): Payload {
  return (command.payload ?? {}) as Payload;
}

function event(
  command: HnkCommand<unknown>,
  index: number,
  eventType: string,
  payload: unknown,
  options: {
    actorId?: string;
    targetId?: string;
    causationId?: string;
    worldTimestamp?: string;
  } = {},
): HnkEvent<unknown> {
  return {
    eventId: `${command.commandId}:EV:${String(index).padStart(2, '0')}`,
    eventType,
    schemaVersion: 1,
    verseId: command.verseId,
    worldId: command.worldId,
    actorId: options.actorId ?? command.actorId,
    targetId: options.targetId ?? command.targetId,
    sessionId: command.sessionId,
    realTimestamp: command.issuedAtReal,
    worldTimestamp: options.worldTimestamp ?? command.issuedAtWorld,
    causationId: options.causationId ?? command.causationId,
    correlationId: command.correlationId,
    payload,
    provenance: {
      commandId: command.commandId,
      idempotencyKey: command.idempotencyKey,
    },
  };
}

function reject(
  rejectionCode: ZeroRejectionCode,
  data?: Record<string, unknown>,
): ZeroCommandDecision {
  return {
    accepted: false,
    events: [],
    rejectionCode,
    data,
  };
}

function playerWood(state: ZeroWorldState): number {
  return (
    state.inventories[ZERO_IDS.playerInventory]?.['RESOURCE-WOOD-ZERO-V0'] ?? 0
  );
}

function metatronWood(state: ZeroWorldState): number {
  return (
    state.inventories[ZERO_IDS.metatronInventory]?.['RESOURCE-WOOD-ZERO-V0'] ?? 0
  );
}

function getBox(state: ZeroWorldState) {
  return state.entities[ZERO_IDS.woodenBox];
}

function point(x: number, y: number): ZeroLogicalPoint {
  return { x, y };
}

function avatarPoint(state: ZeroWorldState): ZeroLogicalPoint {
  return {
    x: state.avatarPosition.logicalX,
    y: state.avatarPosition.logicalY,
  };
}

function dynamicEntityAt(
  state: ZeroWorldState,
  logical: ZeroLogicalPoint,
): string | null {
  for (const entity of Object.values(state.entities)) {
    if (
      entity.spatialBinding?.logicalX === logical.x &&
      entity.spatialBinding?.logicalY === logical.y
    ) {
      return entity.entityInstanceId;
    }
  }

  return null;
}

function occupied(
  state: ZeroWorldState,
  x: number,
  y: number,
): boolean {
  const logical = point(x, y);
  return (
    isStaticSolidCell(logical) ||
    dynamicEntityAt(state, logical) !== null ||
    (state.avatarPosition.logicalX === x &&
      state.avatarPosition.logicalY === y)
  );
}

function rejectOutOfRange(
  state: ZeroWorldState,
  target: ZeroLogicalPoint,
  targetId: string,
): ZeroCommandDecision | null {
  const from = avatarPoint(state);
  if (isWithinInteractionRange(from, target)) return null;

  return reject('OUT_OF_RANGE', {
    targetId,
    distance: manhattanDistance(from, target),
    maxDistance: 1,
    avatarPosition: from,
    targetPosition: target,
  });
}

function addWorldHours(
  value: string,
  hoursToAdd: number,
): { value: string; dayChanged: boolean } {
  const match = /^WORLD-DAY-(\d+)T(\d{2}):(\d{2}):(\d{2})$/.exec(value);
  if (!match) {
    return { value, dayChanged: false };
  }

  const day = Number(match[1]);
  const hour = Number(match[2]);
  const minute = Number(match[3]);
  const second = Number(match[4]);

  const totalHours = hour + hoursToAdd;
  const dayDelta = Math.floor(totalHours / 24);
  const nextHour = totalHours % 24;
  const nextDay = day + dayDelta;

  return {
    value:
      `WORLD-DAY-${String(nextDay).padStart(3, '0')}T` +
      `${String(nextHour).padStart(2, '0')}:` +
      `${String(minute).padStart(2, '0')}:` +
      `${String(second).padStart(2, '0')}`,
    dayChanged: dayDelta > 0,
  };
}

export function handleZeroCommand(
  state: ZeroWorldState,
  command: HnkCommand<unknown>,
): ZeroCommandDecision {
  if (command.verseId !== ZERO_IDS.verse || command.worldId !== ZERO_IDS.world) {
    return reject('NO_PERMISSION');
  }

  const payload = payloadOf(command);

  switch (command.commandType) {
    case 'ExecuteMhcmIr': {
      const irId = String(payload.irId ?? '');
      const irOp = String(payload.irOp ?? '');
      if (!irId || !irOp) return reject('WORLD_RULE_DENIED', { reason: 'INVALID_MHCM_IR' });
      const value = payload.value as Record<string, unknown> | undefined;
      if (irOp === 'PATH_LITERAL') {
        const nodes = Array.isArray(value?.nodes) ? value.nodes.map(String) : [];
        const edges = Array.isArray(value?.edges) ? value.edges.map(String) : [];
        if (nodes.length === 0 || edges.length !== nodes.length - 1) {
          return reject('WORLD_RULE_DENIED', { reason: 'INVALID_PATH_IR', irId });
        }
        return {
          accepted: true,
          events: [
            event(command, 1, 'MhcmIrExecuted', { irId, irOp, executionMode: 'MHCM-RUNTIME-V1' }),
            event(command, 2, 'MhcmPathExecuted', {
              irId, nodes, edges,
              start: String(value?.start ?? nodes[0]),
              end: String(value?.end ?? nodes[nodes.length - 1]),
            }, { causationId: command.commandId + ':EV:01' }),
          ],
          data: { irId, irOp, nodes, edges, executionMode: 'MHCM-PATH-V1' },
        };
      }

      if (irOp === 'MHCM_OPERATOR') {
        const operator = String(value?.operator ?? '');
        const inputs = Array.isArray(value?.inputs) ? value.inputs.map(String) : [];
        if (!['PATH_REVERSE', 'PATH_COMPOSE'].includes(operator)) {
          return reject('WORLD_RULE_DENIED', { reason: 'UNSUPPORTED_MHCM_OPERATOR', operator });
        }
        if ((operator === 'PATH_REVERSE' && inputs.length !== 1) || (operator === 'PATH_COMPOSE' && inputs.length !== 2)) {
          return reject('WORLD_RULE_DENIED', { reason: 'INVALID_MHCM_OPERATOR_ARITY', operator, inputs });
        }
        return {
          accepted: true,
          events: [
            event(command, 1, 'MhcmIrExecuted', { irId, irOp, executionMode: 'MHCM-RUNTIME-V1' }),
            event(command, 2, 'MhcmOperatorExecuted', {
              irId, operator, inputs, executionMode: 'MHCM-OPERATOR-V1',
            }, { causationId: command.commandId + ':EV:01' }),
            event(command, 3, 'MhcmOperatorResultProduced', {
              irId,
              operator,
              resultIrId: irId + ':RESULT',
              resultType: operator === 'PATH_REVERSE' || operator === 'PATH_COMPOSE' ? 'Path' : 'Unknown',
            }, { causationId: command.commandId + ':EV:02' }),
          ],
          data: { irId, irOp, operator, inputs, resultIrId: irId + ':RESULT', executionMode: 'MHCM-OPERATOR-V1' },
        };
      }

      if (irOp === 'GLYPH_LITERAL') {
        return {
          accepted: true,
          events: [
            event(command, 1, 'MhcmIrExecuted', { irId, irOp, executionMode: 'MHCM-RUNTIME-V1' }),
            event(command, 2, 'MhcmGlyphExecuted', {
              irId, encoding: String(value?.encoding ?? ''), transform: String(value?.transform ?? 'IDENTITY'),
            }, { causationId: command.commandId + ':EV:01' }),
          ],
          data: { irId, irOp, executionMode: 'MHCM-GLYPH-V1' },
        };
      }

      return reject('WORLD_RULE_DENIED', { reason: 'UNSUPPORTED_MHCM_IR_OP', irId, irOp });
    }

    case 'ExecuteMhcmProgram': {
      const programId = String(payload.programId ?? '');
      const nodes = Array.isArray(payload.nodes) ? payload.nodes as Array<Record<string, unknown>> : [];
      const outputs = Array.isArray(payload.outputs) ? payload.outputs.map(String) : [];
      if (!programId || nodes.length === 0 || outputs.length === 0) {
        return reject('WORLD_RULE_DENIED', { reason: 'INVALID_MHCM_PROGRAM', programId });
      }

      const nodeIds = nodes.map((node) => String(node.id ?? ''));
      if (nodeIds.some((id) => !id) || new Set(nodeIds).size !== nodeIds.length) {
        return reject('WORLD_RULE_DENIED', { reason: 'INVALID_MHCM_PROGRAM_NODE_IDS', programId });
      }
      const missingOutputs = outputs.filter((id) => !nodeIds.includes(id));
      if (missingOutputs.length) {
        return reject('WORLD_RULE_DENIED', { reason: 'INVALID_MHCM_PROGRAM_OUTPUTS', programId, missingOutputs });
      }

      const values = new Map<string, Record<string, unknown>>();
      const events = [];
      const resultIrIds: string[] = [];

      for (let index = 0; index < nodes.length; index += 1) {
        const node = nodes[index];
        const nodeId = String(node.id);
        const kind = String(node.kind);

        if (kind === 'IR') {
          const ir = (node.ir ?? {}) as Record<string, unknown>;
          const irId = String(ir.id ?? '');
          if (!irId) return reject('WORLD_RULE_DENIED', { reason: 'INVALID_MHCM_PROGRAM_IR', programId, nodeId });
          values.set(nodeId, ir);
          events.push(event(command, index + 2, 'MhcmProgramNodeExecuted', {
            programId, nodeId, kind, resultIrId: irId, executionMode: 'MHCM-PROGRAM-NODE-V1',
          }, { causationId: command.commandId + ':EV:01' }));
          resultIrIds.push(irId);
          continue;
        }

        if (kind !== 'OPERATOR') {
          return reject('WORLD_RULE_DENIED', { reason: 'UNSUPPORTED_MHCM_PROGRAM_NODE', programId, nodeId, kind });
        }

        const operator = String(node.operator ?? '');
        const inputIds = Array.isArray(node.inputs) ? node.inputs.map(String) : [];
        const inputs = inputIds.map((inputId) => values.get(inputId));
        if (inputs.some((value) => !value)) {
          return reject('WORLD_RULE_DENIED', { reason: 'MHCM_PROGRAM_DEPENDENCY_MISSING', programId, nodeId, inputIds });
        }
        if (operator !== 'PATH_REVERSE' && operator !== 'PATH_COMPOSE') {
          return reject('WORLD_RULE_DENIED', { reason: 'UNSUPPORTED_MHCM_OPERATOR', operator });
        }

        const pathValues = inputs as Record<string, unknown>[];
        if (pathValues.some((value) => value.op !== 'PATH_LITERAL' || value.type !== 'Path')) {
          return reject('WORLD_RULE_DENIED', { reason: 'MHCM_PROGRAM_OPERATOR_TYPE', programId, nodeId, operator });
        }

        const left = pathValues[0].value as Record<string, unknown>;
        let resultValue: Record<string, unknown>;
        if (operator === 'PATH_REVERSE') {
          if (pathValues.length !== 1) return reject('WORLD_RULE_DENIED', { reason: 'INVALID_MHCM_OPERATOR_ARITY', operator });
          const nodesReversed = Array.isArray(left.nodes) ? left.nodes.map(String).reverse() : [];
          const edgesReversed = Array.isArray(left.edges) ? left.edges.map(String).reverse() : [];
          if (!nodesReversed.length || edgesReversed.length !== nodesReversed.length - 1) {
            return reject('WORLD_RULE_DENIED', { reason: 'INVALID_PATH_IR', nodeId });
          }
          resultValue = { ...left, id: String(left.id) + '-REVERSE', start: nodesReversed[0], nodes: nodesReversed, edges: edgesReversed, end: nodesReversed[nodesReversed.length - 1] };
        } else {
          if (pathValues.length !== 2) return reject('WORLD_RULE_DENIED', { reason: 'INVALID_MHCM_OPERATOR_ARITY', operator });
          const right = pathValues[1].value as Record<string, unknown>;
          const ln = Array.isArray(left.nodes) ? left.nodes.map(String) : [];
          const rn = Array.isArray(right.nodes) ? right.nodes.map(String) : [];
          const le = Array.isArray(left.edges) ? left.edges.map(String) : [];
          const re = Array.isArray(right.edges) ? right.edges.map(String) : [];
          if (!ln.length || !rn.length || String(left.end) !== String(right.start) || le.length !== ln.length - 1 || re.length !== rn.length - 1) {
            return reject('WORLD_RULE_DENIED', { reason: 'NON_CONTIGUOUS_PATH_COMPOSITION', programId, nodeId });
          }
          const combinedNodes = [...ln, ...rn.slice(1)];
          const combinedEdges = [...le, ...re];
          resultValue = {
            ...left,
            id: String(left.id) + '-COMPOSE-' + String(right.id),
            start: combinedNodes[0], nodes: combinedNodes, edges: combinedEdges,
            end: combinedNodes[combinedNodes.length - 1],
            directed: Boolean(left.directed) && Boolean(right.directed),
          };
        }

        const resultIrId = 'IR-PROGRAM-' + programId + '-' + nodeId;
        const resultIr = { irVersion: 1, id: resultIrId, type: 'Path', op: 'PATH_LITERAL', inputs: inputIds, value: resultValue };
        values.set(nodeId, resultIr);
        resultIrIds.push(resultIrId);
        events.push(event(command, index + 2, 'MhcmProgramNodeExecuted', {
          programId, nodeId, kind, operator, resultIrId, executionMode: 'MHCM-PROGRAM-NODE-V1',
        }, { causationId: command.commandId + ':EV:01' }));
      }

      const outputResults = outputs.map((outputId) => values.get(outputId));
      if (outputResults.some((value) => !value)) {
        return reject('WORLD_RULE_DENIED', { reason: 'MHCM_PROGRAM_OUTPUT_UNRESOLVED', programId });
      }

      events.push(event(command, 1, 'MhcmProgramExecuted', {
        programId, nodeCount: nodes.length, outputIds: outputs, resultIrIds,
        executionMode: 'MHCM-PROGRAM-V2',
      }));
      return {
        accepted: true,
        events,
        data: { programId, nodeCount: nodes.length, outputIds: outputs, resultIrIds, executionMode: 'MHCM-PROGRAM-V2' },
      };
    }

    case 'StartSession':
      return {
        accepted: true,
        events: [event(command, 1, 'IdentitySessionStarted', {})],
      };

    case 'ObserveLexeme': {
      const rangeRejection = rejectOutOfRange(
        state,
        ZERO_WORLD_POSITIONS.valiSurface,
        ZERO_IDS.valiSurface,
      );
      if (rangeRejection) return rangeRejection;

      if (state.lexemeObserved) {
        return { accepted: true, events: [], data: { alreadyObserved: true } };
      }

      return {
        accepted: true,
        events: [
          event(
            command,
            1,
            'LexemeFormObserved',
            {
              lexemeRef: 'LEX-013',
              form: 'VALI',
              meaningRevealed: false,
              sourceAuthority: '@hnk/linguas',
              languageAuthority: 'FROZEN',
            },
            { targetId: ZERO_IDS.valiSurface },
          ),
        ],
      };
    }

    case 'RequestLexemeTeaching': {
      const rangeRejection = rejectOutOfRange(
        state,
        ZERO_WORLD_POSITIONS.metatron,
        ZERO_IDS.metatron,
      );
      if (rangeRejection) return rangeRejection;

      if (!state.lexemeObserved) return reject('MILESTONE_REQUIRED');
      if (state.valiKnown) {
        return { accepted: true, events: [], data: { alreadyKnown: true } };
      }

      const offered = event(
        command,
        1,
        'AgentTeachingOffered',
        {
          lexemeRef: 'LEX-013',
          agentId: ZERO_IDS.metatron,
        },
        { actorId: ZERO_IDS.metatron, targetId: ZERO_IDS.avatar },
      );

      const learned = event(
        command,
        2,
        'LexemeMeaningLearned',
        {
          lexemeRef: 'LEX-013',
          surface: 'VALI',
          meaningPt: 'trabalho / trabalhar',
          zeroBinding: 'TRANSVERSAL',
          curriculumBindingL07: false,
          languageRef: ZERO_VALI_LANGUAGE_REF,
        },
        {
          targetId: ZERO_IDS.valiSurface,
          causationId: offered.eventId,
        },
      );

      return {
        accepted: true,
        events: [offered, learned],
      };
    }

    case 'DiscoverKnowledge': {
      const rangeRejection = rejectOutOfRange(
        state,
        ZERO_WORLD_POSITIONS.metatron,
        ZERO_IDS.metatron,
      );
      if (rangeRejection) return rangeRejection;

      if (!state.valiKnown) return reject('KNOWLEDGE_REQUIRED');
      if (state.practicalKnowledgeDiscovered) {
        return { accepted: true, events: [], data: { alreadyKnown: true } };
      }

      return {
        accepted: true,
        events: [
          event(command, 1, 'KnowledgeUnitDiscovered', {
            knowledgeRef: ZERO_PENDING_MALKUTH_CODEX_REF,
          }),
        ],
      };
    }

    case 'GatherResource': {
      const rangeRejection = rejectOutOfRange(
        state,
        ZERO_WORLD_POSITIONS.woodNode,
        ZERO_IDS.woodNode,
      );
      if (rangeRejection) return rangeRejection;

      if (!state.practicalKnowledgeDiscovered) {
        return reject('KNOWLEDGE_REQUIRED');
      }

      const quantity = Number(payload.quantity ?? 1);
      if (!Number.isInteger(quantity) || quantity <= 0) {
        return reject('INVALID_TRANSFER');
      }
      if (state.woodNodeRemaining < quantity) {
        return reject('NODE_DEPLETED');
      }

      return {
        accepted: true,
        events: [
          event(
            command,
            1,
            'ResourceGathered',
            {
              nodeId: ZERO_IDS.woodNode,
              resourceDefinitionId: 'RESOURCE-WOOD-ZERO-V0',
              quantity,
              ownerId: ZERO_IDS.avatar,
            },
            { targetId: ZERO_IDS.woodNode },
          ),
        ],
      };
    }

    case 'AttemptPractice': {
      const rangeRejection = rejectOutOfRange(
        state,
        ZERO_WORLD_POSITIONS.workbench,
        ZERO_IDS.workbench,
      );
      if (rangeRejection) return rangeRejection;

      if (!state.practicalKnowledgeDiscovered) {
        return reject('KNOWLEDGE_REQUIRED');
      }
      if (playerWood(state) < 3) {
        return reject('RESOURCE_INSUFFICIENT');
      }
      if (state.skillEvidenceIds.length > 0) {
        return { accepted: true, events: [], data: { alreadyEvidenced: true } };
      }

      const attempted = event(
        command,
        1,
        'PracticeAttempted',
        {
          skillDefinitionId: 'SKILL-PRACTICAL-WORK-ZERO-V0',
          processId: 'PROCESS-WOODEN-BOX-ZERO-V0',
          contextEntityId: ZERO_IDS.workbench,
        },
        { targetId: ZERO_IDS.workbench },
      );

      const succeeded = event(
        command,
        2,
        'PracticeSucceeded',
        {
          skillDefinitionId: 'SKILL-PRACTICAL-WORK-ZERO-V0',
          processId: 'PROCESS-WOODEN-BOX-ZERO-V0',
        },
        {
          targetId: ZERO_IDS.workbench,
          causationId: attempted.eventId,
        },
      );

      const evidence = event(
        command,
        3,
        'SkillEvidenceRecorded',
        {
          evidenceId: `EVIDENCE:${command.commandId}`,
          skillDefinitionId: 'SKILL-PRACTICAL-WORK-ZERO-V0',
          sourceEventRefs: [succeeded.eventId],
          contextEntityId: ZERO_IDS.workbench,
          result: 'SUCCESS',
          guided: true,
          quality: 1,
        },
        {
          targetId: ZERO_IDS.workbench,
          causationId: succeeded.eventId,
        },
      );

      return {
        accepted: true,
        events: [attempted, succeeded, evidence],
      };
    }

    case 'CraftEntity': {
      const rangeRejection = rejectOutOfRange(
        state,
        ZERO_WORLD_POSITIONS.workbench,
        ZERO_IDS.workbench,
      );
      if (rangeRejection) return rangeRejection;

      if (!state.practicalKnowledgeDiscovered) {
        return reject('KNOWLEDGE_REQUIRED');
      }
      if (state.skillEvidenceIds.length === 0) {
        return reject('MILESTONE_REQUIRED');
      }
      if (playerWood(state) < 3) {
        return reject('RESOURCE_INSUFFICIENT');
      }
      if (getBox(state)) {
        return reject('MILESTONE_REQUIRED', { reason: 'BOX_ALREADY_EXISTS' });
      }

      const consumed = event(
        command,
        1,
        'ResourceConsumed',
        {
          resourceDefinitionId: 'RESOURCE-WOOD-ZERO-V0',
          quantity: 3,
          purpose: 'PROCESS-WOODEN-BOX-ZERO-V0',
        },
        { targetId: ZERO_IDS.workbench },
      );

      const created = event(
        command,
        2,
        'EntityCreated',
        {
          entityInstanceId: ZERO_IDS.woodenBox,
          definitionId: 'ENTITY-WOODEN-BOX-ZERO-V0',
          ownerId: ZERO_IDS.avatar,
          capabilities: [
            'CONTAINER',
            'PLACEABLE',
            'MOVABLE_BY_OWNER',
            'STORAGE',
            'INSPECTABLE',
          ],
          provenance: {
            processId: 'PROCESS-WOODEN-BOX-ZERO-V0',
            workbenchId: ZERO_IDS.workbench,
          },
        },
        {
          targetId: ZERO_IDS.workbench,
          causationId: consumed.eventId,
        },
      );

      return {
        accepted: true,
        events: [consumed, created],
      };
    }

    case 'ValidatePlacement': {
      const x = Number(payload.logicalX);
      const y = Number(payload.logicalY);
      const box = getBox(state);
      const target = point(x, y);

      if (!insideZeroLand(target)) return reject('OUT_OF_BOUNDS');
      const rangeRejection = rejectOutOfRange(
        state,
        target,
        ZERO_IDS.storageZone,
      );
      if (rangeRejection) return rangeRejection;

      if (!box || box.ownerId !== ZERO_IDS.avatar) {
        return reject('ENTITY_NOT_OWNED');
      }
      if (occupied(state, x, y)) return reject('CELL_OCCUPIED');

      return {
        accepted: true,
        events: [],
        data: {
          valid: true,
          landId: ZERO_IDS.land,
          logicalX: x,
          logicalY: y,
        },
      };
    }

    case 'PlaceEntity': {
      const box = getBox(state);
      const x = Number(payload.logicalX);
      const y = Number(payload.logicalY);
      const landId = String(payload.landId ?? ZERO_IDS.land);
      const orientation = Number(payload.orientation ?? 0);
      const target = point(x, y);

      if (!insideZeroLand(target)) return reject('OUT_OF_BOUNDS');
      const rangeRejection = rejectOutOfRange(
        state,
        target,
        ZERO_IDS.storageZone,
      );
      if (rangeRejection) return rangeRejection;

      if (!box || box.ownerId !== ZERO_IDS.avatar) {
        return reject('ENTITY_NOT_OWNED');
      }
      if (landId !== ZERO_IDS.land) return reject('NO_PERMISSION');
      if (box.spatialBinding) {
        return reject('MILESTONE_REQUIRED', { reason: 'BOX_ALREADY_PLACED' });
      }
      if (occupied(state, x, y)) return reject('CELL_OCCUPIED');

      const placed = event(
        command,
        1,
        'EntityPlaced',
        {
          entityInstanceId: ZERO_IDS.woodenBox,
          landId: ZERO_IDS.land,
          logicalX: x,
          logicalY: y,
          orientation,
        },
        { targetId: ZERO_IDS.woodenBox },
      );

      const perceived = event(
        command,
        2,
        'AgentPerceivedWorldEvent',
        {
          agentId: ZERO_IDS.metatron,
          observedEventId: placed.eventId,
          epistemicSource: 'DIRECT_OBSERVATION',
        },
        {
          actorId: ZERO_IDS.metatron,
          targetId: ZERO_IDS.woodenBox,
          causationId: placed.eventId,
        },
      );

      const remembered = event(
        command,
        3,
        'AgentMemoryCreated',
        {
          memoryId: `MEMORY:BOX:${command.commandId}`,
          memoryType: 'PLAYER_CREATED_AND_PLACED_BOX',
          sourceEventId: placed.eventId,
        },
        {
          actorId: ZERO_IDS.metatron,
          targetId: ZERO_IDS.avatar,
          causationId: perceived.eventId,
        },
      );

      return {
        accepted: true,
        events: [placed, perceived, remembered],
      };
    }

    case 'OfferTransfer': {
      const rangeRejection = rejectOutOfRange(
        state,
        ZERO_WORLD_POSITIONS.metatron,
        ZERO_IDS.metatron,
      );
      if (rangeRejection) return rangeRejection;

      const offer = event(
        command,
        1,
        'TransferOffered',
        {
          fromActorId: ZERO_IDS.avatar,
          toActorId: ZERO_IDS.metatron,
          resourceDefinitionId: 'RESOURCE-WOOD-ZERO-V0',
          quantity: 1,
        },
        { targetId: ZERO_IDS.metatron },
      );

      if (!getBox(state)?.spatialBinding) {
        const refused = event(
          command,
          2,
          'TransferRefused',
          {
            reason: 'FIRST_MANIFESTATION_INCOMPLETE',
            offerEventId: offer.eventId,
          },
          {
            actorId: ZERO_IDS.metatron,
            targetId: ZERO_IDS.avatar,
            causationId: offer.eventId,
          },
        );

        return {
          accepted: true,
          events: [offer, refused],
          data: {
            offerAccepted: false,
            reason: 'FIRST_MANIFESTATION_INCOMPLETE',
          },
        };
      }

      if (playerWood(state) < 1) {
        return reject('RESOURCE_INSUFFICIENT');
      }

      return {
        accepted: true,
        events: [offer],
        data: { offerAccepted: true },
      };
    }

    case 'TransferOwnership': {
      const rangeRejection = rejectOutOfRange(
        state,
        ZERO_WORLD_POSITIONS.metatron,
        ZERO_IDS.metatron,
      );
      if (rangeRejection) return rangeRejection;

      if (!getBox(state)?.spatialBinding) return reject('MILESTONE_REQUIRED');

      const quantity = Number(payload.quantity ?? 1);
      if (
        String(payload.toOwnerId ?? ZERO_IDS.metatron) !== ZERO_IDS.metatron ||
        quantity !== 1
      ) {
        return reject('INVALID_TRANSFER');
      }
      if (playerWood(state) < quantity) {
        return reject('RESOURCE_INSUFFICIENT');
      }

      const transferred = event(
        command,
        1,
        'OwnershipTransferred',
        {
          fromOwnerId: ZERO_IDS.avatar,
          toOwnerId: ZERO_IDS.metatron,
          resourceDefinitionId: 'RESOURCE-WOOD-ZERO-V0',
          quantity,
        },
        { targetId: ZERO_IDS.metatron },
      );

      const history = event(
        command,
        2,
        'RelationshipHistoryAppended',
        {
          historyId: `RELHIST:GIFT:${command.commandId}`,
          relationshipId: ZERO_IDS.relationship,
          eventType: 'GIFT_RECEIVED',
          sourceEventId: transferred.eventId,
          actorFrom: ZERO_IDS.avatar,
          actorTo: ZERO_IDS.metatron,
          resourceDefinitionId: 'RESOURCE-WOOD-ZERO-V0',
          quantity,
        },
        {
          targetId: ZERO_IDS.metatron,
          causationId: transferred.eventId,
        },
      );

      const memory = event(
        command,
        3,
        'AgentMemoryCreated',
        {
          memoryId: `MEMORY:GIFT:${command.commandId}`,
          memoryType: 'GIFT_RECEIVED',
          sourceEventId: transferred.eventId,
        },
        {
          actorId: ZERO_IDS.metatron,
          targetId: ZERO_IDS.avatar,
          causationId: transferred.eventId,
        },
      );

      return {
        accepted: true,
        events: [transferred, history, memory],
      };
    }

    case 'AppendReflection': {
      const text = String(payload.text ?? '').trim();
      if (!text) return reject('MILESTONE_REQUIRED');

      return {
        accepted: true,
        events: [
          event(command, 1, 'HumanReflectionAppended', {
            reflectionId: `REFLECTION:${command.commandId}`,
            authorId: ZERO_IDS.avatar,
            text,
            linkedEventRefs: Array.isArray(payload.linkedEventRefs)
              ? payload.linkedEventRefs
              : [],
            authorityClass: 'HUMAN_AUTHORED_INTERPRETATION',
          }),
        ],
      };
    }

    case 'Rest': {
      const rangeRejection = rejectOutOfRange(
        state,
        ZERO_WORLD_POSITIONS.bed,
        ZERO_IDS.bed,
      );
      if (rangeRejection) return rangeRejection;

      const advanced = addWorldHours(state.worldTime, 8);
      const rested = event(
        command,
        1,
        'AvatarRested',
        {
          avatarId: ZERO_IDS.avatar,
          energyBefore: state.energyRest,
          energyAfter: 100,
          worldTimeBefore: state.worldTime,
          worldTimeAfter: advanced.value,
        },
        {
          targetId: ZERO_IDS.bed,
          worldTimestamp: advanced.value,
        },
      );

      const events: HnkEvent<unknown>[] = [rested];

      if (advanced.dayChanged) {
        events.push(
          event(
            command,
            2,
            'WorldDayAdvanced',
            {
              worldTimeBefore: state.worldTime,
              worldTimeAfter: advanced.value,
            },
            {
              targetId: ZERO_IDS.world,
              causationId: rested.eventId,
              worldTimestamp: advanced.value,
            },
          ),
        );
      }

      return {
        accepted: true,
        events,
      };
    }

    case 'EndSession':
      return {
        accepted: true,
        events: [event(command, 1, 'IdentitySessionEnded', {})],
      };

    case 'MoveAvatar': {
      const logicalX = Number(payload.logicalX);
      const logicalY = Number(payload.logicalY);
      const target = point(logicalX, logicalY);

      if (!insideZeroLand(target)) {
        return reject('OUT_OF_BOUNDS');
      }

      const from = avatarPoint(state);
      const stepDistance = manhattanDistance(from, target);
      if (stepDistance > 1) {
        return reject('OUT_OF_RANGE', {
          reason: 'MOVE_STEP_TOO_LARGE',
          distance: stepDistance,
          maxDistance: 1,
          avatarPosition: from,
          targetPosition: target,
        });
      }

      const blockingEntityId = dynamicEntityAt(state, target);
      if (isStaticSolidCell(target) || blockingEntityId) {
        return reject('CELL_OCCUPIED', {
          logicalX,
          logicalY,
          blockingEntityId,
          staticCollision: isStaticSolidCell(target),
        });
      }

      if (
        state.avatarPosition.logicalX === logicalX &&
        state.avatarPosition.logicalY === logicalY
      ) {
        return {
          accepted: true,
          events: [],
          data: { alreadyCheckpointed: true },
        };
      }

      return {
        accepted: true,
        events: [
          event(
            command,
            1,
            'AvatarPositionCheckpointed',
            {
              avatarId: ZERO_IDS.avatar,
              logicalX,
              logicalY,
              homeThreshold: isHomeThresholdCell(target),
            },
            { targetId: ZERO_IDS.avatar },
          ),
        ],
      };
    }

    case 'InteractWithAgent': {
      const rangeRejection = rejectOutOfRange(
        state,
        ZERO_WORLD_POSITIONS.metatron,
        ZERO_IDS.metatron,
      );
      if (rangeRejection) return rangeRejection;
      return { accepted: true, events: [] };
    }

    case 'MoveEntity':
    case 'RemoveEntity':
      return reject('WORLD_RULE_DENIED');

    default:
      return reject('WORLD_RULE_DENIED', {
        commandType: command.commandType,
        playerWood: playerWood(state),
        metatronWood: metatronWood(state),
      });
  }
}
