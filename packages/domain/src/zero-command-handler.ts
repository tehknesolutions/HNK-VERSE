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
