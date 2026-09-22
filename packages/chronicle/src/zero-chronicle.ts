import type { HnkEvent } from '@hnk-verse/contracts';

export type ChronicleAuthority =
  | 'WORLD_EVENT_DERIVED'
  | 'HUMAN_AUTHORED_INTERPRETATION';

export type ChronicleCategory =
  | 'DISCOVERY'
  | 'KNOWLEDGE'
  | 'PRACTICE'
  | 'CREATION'
  | 'RELATIONSHIP'
  | 'LIFE'
  | 'REFLECTION';

export type ChronicleSourceEvent = {
  sequenceNo: number;
  event: HnkEvent<unknown>;
};

export type ChronicleEntry = {
  id: string;
  category: ChronicleCategory;
  authority: ChronicleAuthority;
  title: string;
  detail: string;
  worldTimestamp: string;
  sourceEventRefs: string[];
  sequenceNo: number;
};

export type EventInspectorRow = {
  sequenceNo: number;
  eventId: string;
  eventType: string;
  worldTimestamp: string;
  actorId?: string;
  targetId?: string;
  correlationId: string;
  causationId?: string;
  payload: unknown;
  provenance?: Record<string, unknown>;
};

type Payload = Record<string, unknown>;

function payloadOf(event: HnkEvent<unknown>): Payload {
  if (event.payload && typeof event.payload === 'object') {
    return event.payload as Payload;
  }
  return {};
}

function quantity(payload: Payload): string {
  const value = Number(payload.quantity ?? 0);
  return Number.isFinite(value) ? String(value) : '?';
}

function entry(
  source: ChronicleSourceEvent,
  category: ChronicleCategory,
  title: string,
  detail: string,
  authority: ChronicleAuthority = 'WORLD_EVENT_DERIVED',
  sourceEventRefs: string[] = [source.event.eventId],
): ChronicleEntry {
  return {
    id: `CHRONICLE:${source.event.eventId}`,
    category,
    authority,
    title,
    detail,
    worldTimestamp: source.event.worldTimestamp,
    sourceEventRefs,
    sequenceNo: source.sequenceNo,
  };
}

export function projectZeroChronicle(
  sources: readonly ChronicleSourceEvent[],
): ChronicleEntry[] {
  const entries: ChronicleEntry[] = [];

  for (const source of sources) {
    const event = source.event;
    const payload = payloadOf(event);

    switch (event.eventType) {
      case 'LexemeFormObserved':
        entries.push(
          entry(
            source,
            'DISCOVERY',
            'VALI observado',
            'A forma VALI entrou na história percebida da Persona; o significado ainda não era conhecido.',
          ),
        );
        break;

      case 'LexemeMeaningLearned':
        entries.push(
          entry(
            source,
            'KNOWLEDGE',
            'VALI compreendido',
            'Metatron ensinou a relação aprovada: VALI — trabalho / trabalhar.',
          ),
        );
        break;

      case 'KnowledgeUnitDiscovered':
        entries.push(
          entry(
            source,
            'KNOWLEDGE',
            'Conhecimento prático descoberto',
            'A possibilidade de Trabalho Prático tornou-se disponível sem inventar um ID canônico CODEX-HNK.',
          ),
        );
        break;

      case 'SkillEvidenceRecorded':
        entries.push(
          entry(
            source,
            'PRACTICE',
            'Prática evidenciada',
            'Uma execução válida produziu Skill Evidence; XP não substitui essa evidência.',
          ),
        );
        break;

      case 'EntityCreated':
        if (payload.definitionId === 'ENTITY-WOODEN-BOX-ZERO-V0') {
          entries.push(
            entry(
              source,
              'CREATION',
              'Caixa de Madeira criada',
              'A Caixa passou a existir como entidade própria antes de receber uma posição no mundo.',
            ),
          );
        }
        break;

      case 'EntityPlaced':
        entries.push(
          entry(
            source,
            'CREATION',
            'A Home foi transformada',
            'A Caixa de Madeira recebeu uma ligação espacial persistente na zona de armazenamento.',
          ),
        );
        break;

      case 'OwnershipTransferred':
        entries.push(
          entry(
            source,
            'RELATIONSHIP',
            'Propriedade transferida',
            `${quantity(payload)} unidade de Madeira passou do jogador para Metatron por uma transferência autorizada.`,
          ),
        );
        break;

      case 'RelationshipHistoryAppended':
        if (payload.eventType === 'GIFT_RECEIVED') {
          entries.push(
            entry(
              source,
              'RELATIONSHIP',
              'O presente entrou na história da relação',
              'A relação Jogador ↔ Metatron preservou a causa do presente sem transformar reputação em verdade universal.',
            ),
          );
        }
        break;

      case 'AvatarRested':
        entries.push(
          entry(
            source,
            'LIFE',
            'Descanso na Home',
            'O Avatar descansou; Energia/Rest e World Time foram atualizados pelo domínio.',
          ),
        );
        break;

      case 'WorldDayAdvanced':
        entries.push(
          entry(
            source,
            'LIFE',
            'Um novo dia começou',
            'O World Time cruzou a fronteira de dia como consequência de uma ação autorizada.',
          ),
        );
        break;

      case 'HumanReflectionAppended': {
        const linked = Array.isArray(payload.linkedEventRefs)
          ? payload.linkedEventRefs.filter(
              (value): value is string => typeof value === 'string',
            )
          : [];

        entries.push(
          entry(
            source,
            'REFLECTION',
            'Reflexão humana',
            typeof payload.text === 'string' ? payload.text : '',
            'HUMAN_AUTHORED_INTERPRETATION',
            [event.eventId, ...linked],
          ),
        );
        break;
      }

      default:
        break;
    }
  }

  return entries.sort((a, b) => a.sequenceNo - b.sequenceNo);
}

export function projectEventInspector(
  sources: readonly ChronicleSourceEvent[],
): EventInspectorRow[] {
  return sources.map(({ sequenceNo, event }) => ({
    sequenceNo,
    eventId: event.eventId,
    eventType: event.eventType,
    worldTimestamp: event.worldTimestamp,
    actorId: event.actorId,
    targetId: event.targetId,
    correlationId: event.correlationId,
    causationId: event.causationId,
    payload: event.payload,
    provenance: event.provenance,
  }));
}

export function isChronicleInterpretation(
  entry: ChronicleEntry,
): boolean {
  return entry.authority === 'HUMAN_AUTHORED_INTERPRETATION';
}
