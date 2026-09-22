import type { HnkEvent } from '@hnk-verse/contracts';
import { ZERO_IDS } from '@hnk-verse/contracts';

export type ZeroSpatialBinding = {
  landId: string;
  logicalX: number;
  logicalY: number;
  orientation: number;
};

export type ZeroEntityState = {
  entityInstanceId: string;
  definitionId: string;
  ownerId: string;
  spatialBinding: ZeroSpatialBinding | null;
};

export type ZeroAgentMemory = {
  memoryId: string;
  memoryType: string;
  sourceEventId: string;
};

export type ZeroRelationshipHistory = {
  historyId: string;
  eventType: string;
  sourceEventId: string;
};

export type ZeroReflection = {
  reflectionId: string;
  text: string;
  linkedEventRefs: string[];
  authorityClass: 'HUMAN_AUTHORED_INTERPRETATION';
};

export type ZeroWorldState = {
  schemaVersion: 1;
  worldId: string;
  lexemeObserved: boolean;
  valiKnown: boolean;
  practicalKnowledgeDiscovered: boolean;
  woodNodeRemaining: number;
  inventories: Record<string, Record<string, number>>;
  skillEvidenceIds: string[];
  entities: Record<string, ZeroEntityState>;
  agentMemories: ZeroAgentMemory[];
  relationshipHistory: ZeroRelationshipHistory[];
  reflections: ZeroReflection[];
  energyRest: number;
  worldTime: string;
  lastEventId: string | null;
};

type AnyPayload = Record<string, any>;

function quantityOf(
  state: ZeroWorldState,
  inventoryId: string,
  resourceDefinitionId: string,
): number {
  return state.inventories[inventoryId]?.[resourceDefinitionId] ?? 0;
}

function setQuantity(
  state: ZeroWorldState,
  inventoryId: string,
  resourceDefinitionId: string,
  quantity: number,
): void {
  const inventory = state.inventories[inventoryId] ?? {};
  state.inventories[inventoryId] = {
    ...inventory,
    [resourceDefinitionId]: quantity,
  };
}

export function reduceZeroEvent(
  previous: ZeroWorldState,
  event: HnkEvent<unknown>,
): ZeroWorldState {
  const state: ZeroWorldState = structuredClone(previous);
  const payload = (event.payload ?? {}) as AnyPayload;

  switch (event.eventType) {
    case 'LexemeFormObserved':
      if (payload.lexemeRef === 'LEX-013') state.lexemeObserved = true;
      break;

    case 'LexemeMeaningLearned':
      if (payload.lexemeRef === 'LEX-013') state.valiKnown = true;
      break;

    case 'KnowledgeUnitDiscovered':
      if (
        payload.knowledgeRef?.internalRef ===
        'ZERO-KNOWLEDGE-MALKUTH-MANIFESTATION-V0'
      ) {
        state.practicalKnowledgeDiscovered = true;
      }
      break;

    case 'ResourceGathered': {
      const quantity = Number(payload.quantity ?? 0);
      state.woodNodeRemaining -= quantity;
      const current = quantityOf(
        state,
        ZERO_IDS.playerInventory,
        'RESOURCE-WOOD-ZERO-V0',
      );
      setQuantity(
        state,
        ZERO_IDS.playerInventory,
        'RESOURCE-WOOD-ZERO-V0',
        current + quantity,
      );
      break;
    }

    case 'ResourceConsumed': {
      const quantity = Number(payload.quantity ?? 0);
      const current = quantityOf(
        state,
        ZERO_IDS.playerInventory,
        payload.resourceDefinitionId ?? 'RESOURCE-WOOD-ZERO-V0',
      );
      setQuantity(
        state,
        ZERO_IDS.playerInventory,
        payload.resourceDefinitionId ?? 'RESOURCE-WOOD-ZERO-V0',
        current - quantity,
      );
      break;
    }

    case 'SkillEvidenceRecorded':
      if (payload.evidenceId && !state.skillEvidenceIds.includes(payload.evidenceId)) {
        state.skillEvidenceIds.push(payload.evidenceId);
      }
      break;

    case 'EntityCreated':
      state.entities[payload.entityInstanceId] = {
        entityInstanceId: payload.entityInstanceId,
        definitionId: payload.definitionId,
        ownerId: payload.ownerId,
        spatialBinding: null,
      };
      break;

    case 'EntityPlaced': {
      const entity = state.entities[payload.entityInstanceId];
      if (entity) {
        entity.spatialBinding = {
          landId: payload.landId,
          logicalX: payload.logicalX,
          logicalY: payload.logicalY,
          orientation: payload.orientation,
        };
      }
      break;
    }

    case 'OwnershipTransferred': {
      const quantity = Number(payload.quantity ?? 0);
      const resource = payload.resourceDefinitionId;
      const fromInventory =
        payload.fromOwnerId === ZERO_IDS.avatar
          ? ZERO_IDS.playerInventory
          : payload.fromInventoryId;
      const toInventory =
        payload.toOwnerId === ZERO_IDS.metatron
          ? ZERO_IDS.metatronInventory
          : payload.toInventoryId;
      if (fromInventory && toInventory && resource) {
        setQuantity(
          state,
          fromInventory,
          resource,
          quantityOf(state, fromInventory, resource) - quantity,
        );
        setQuantity(
          state,
          toInventory,
          resource,
          quantityOf(state, toInventory, resource) + quantity,
        );
      }
      break;
    }

    case 'AgentMemoryCreated':
      if (
        payload.memoryId &&
        !state.agentMemories.some((m) => m.memoryId === payload.memoryId)
      ) {
        state.agentMemories.push({
          memoryId: payload.memoryId,
          memoryType: payload.memoryType,
          sourceEventId: payload.sourceEventId,
        });
      }
      break;

    case 'RelationshipHistoryAppended':
      if (
        payload.historyId &&
        !state.relationshipHistory.some((h) => h.historyId === payload.historyId)
      ) {
        state.relationshipHistory.push({
          historyId: payload.historyId,
          eventType: payload.eventType,
          sourceEventId: payload.sourceEventId,
        });
      }
      break;

    case 'HumanReflectionAppended':
      if (
        payload.reflectionId &&
        !state.reflections.some((r) => r.reflectionId === payload.reflectionId)
      ) {
        state.reflections.push({
          reflectionId: payload.reflectionId,
          text: payload.text,
          linkedEventRefs: payload.linkedEventRefs ?? [],
          authorityClass: 'HUMAN_AUTHORED_INTERPRETATION',
        });
      }
      break;

    case 'AvatarRested':
      state.energyRest = Number(payload.energyAfter ?? state.energyRest);
      state.worldTime = String(payload.worldTimeAfter ?? state.worldTime);
      break;

    case 'WorldDayAdvanced':
      state.worldTime = String(payload.worldTimeAfter ?? state.worldTime);
      break;
  }

  state.lastEventId = event.eventId;
  return state;
}

export function replayZeroEvents(
  initial: ZeroWorldState,
  events: readonly HnkEvent<unknown>[],
): ZeroWorldState {
  return events.reduce(reduceZeroEvent, initial);
}

export function hasObservedVali(state: ZeroWorldState): boolean {
  return state.lexemeObserved;
}

export function knowsVali(state: ZeroWorldState): boolean {
  return state.valiKnown;
}

export function hasPracticalKnowledge(state: ZeroWorldState): boolean {
  return state.practicalKnowledgeDiscovered;
}

export function hasGatheredRequiredWood(state: ZeroWorldState): boolean {
  return (
    quantityOf(state, ZERO_IDS.playerInventory, 'RESOURCE-WOOD-ZERO-V0') >= 3
  );
}

export function hasFirstSkillEvidence(state: ZeroWorldState): boolean {
  return state.skillEvidenceIds.length > 0;
}

export function ownsWoodenBox(state: ZeroWorldState): boolean {
  return Object.values(state.entities).some(
    (entity) =>
      entity.definitionId === 'ENTITY-WOODEN-BOX-ZERO-V0' &&
      entity.ownerId === ZERO_IDS.avatar,
  );
}

export function hasPlacedWoodenBox(state: ZeroWorldState): boolean {
  return Object.values(state.entities).some(
    (entity) =>
      entity.definitionId === 'ENTITY-WOODEN-BOX-ZERO-V0' &&
      entity.spatialBinding !== null,
  );
}

export function metatronRemembersBox(state: ZeroWorldState): boolean {
  return state.agentMemories.some(
    (memory) => memory.memoryType === 'PLAYER_CREATED_AND_PLACED_BOX',
  );
}

export function hasCompletedGift(state: ZeroWorldState): boolean {
  return state.relationshipHistory.some(
    (history) => history.eventType === 'GIFT_RECEIVED',
  );
}

export function hasChronicleReflection(state: ZeroWorldState): boolean {
  return state.reflections.length > 0;
}
