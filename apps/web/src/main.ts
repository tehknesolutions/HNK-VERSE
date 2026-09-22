import './styles.css';

import {
  projectEventInspector,
  projectZeroChronicle,
  type ChronicleEntry,
  type EventInspectorRow,
} from '@hnk-verse/chronicle';
import {
  ZERO_IDS,
  type HnkCommand,
  type ZeroCommandType,
} from '@hnk-verse/contracts';
import {
  hasCompletedGift,
  hasPlacedWoodenBox,
  type ZeroWorldState,
} from '@hnk-verse/domain';
import { ZERO_FIXTURE_V1_INITIAL_STATE } from '@hnk-verse/fixtures';
import { BrowserLocalPersistence } from '@hnk-verse/persistence';
import {
  ZERO_GRID,
  ZERO_HOME_FOOTPRINT,
  ZERO_SCENE_POSITIONS,
  buildZeroScene,
  insideZeroLand,
  isHomeThresholdCell,
  isHomeWallCell,
  logicalToIso,
  tilePolygon,
  type LogicalPoint,
  type ZeroSceneFixture,
} from '@hnk-verse/renderer';
import { ZeroCommandRuntime } from '@hnk-verse/simulation';
import {
  findZeroInteractionRoute,
  findZeroPath,
  isStaticSolidCell,
  isWithinInteractionRange,
  manhattanDistance,
  zeroPointKey,
} from '@hnk-verse/world';

const appNode = document.querySelector<HTMLElement>('#app');
if (!appNode) throw new Error('HNK_VERSE_WEB_ROOT_MISSING');
const app: HTMLElement = appNode;

const persistence = new BrowserLocalPersistence<ZeroWorldState>();
const ports = {
  events: persistence,
  snapshots: persistence,
  receipts: persistence,
};

let runtime = await ZeroCommandRuntime.create(
  ports,
  structuredClone(ZERO_FIXTURE_V1_INITIAL_STATE),
);

let selectedId: string | null = ZERO_IDS.valiSurface;
let avatarVisual: LogicalPoint = {
  x: runtime.state.avatarPosition.logicalX,
  y: runtime.state.avatarPosition.logicalY,
};
let activeRoute: LogicalPoint[] = [];
let routeTargetLabel: string | null = null;
let cameraZoom = 1;
let chronicleEntries: ChronicleEntry[] = [];
let eventInspectorRows: EventInspectorRow[] = [];
let eventInspectorOpen = false;
let notice = 'Observe o mundo. O ZERO deriva progresso do estado real.';
let busy = false;

if (runtime.currentSequenceNo === 0) {
  await execute('StartSession');
} else {
  await refreshChronicle();
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Offline support is progressive enhancement; gameplay must still run.
    });
  });
}

function playerWood(state = runtime.state): number {
  return (
    state.inventories[ZERO_IDS.playerInventory]?.['RESOURCE-WOOD-ZERO-V0'] ?? 0
  );
}

function metatronWood(state = runtime.state): number {
  return (
    state.inventories[ZERO_IDS.metatronInventory]?.['RESOURCE-WOOD-ZERO-V0'] ?? 0
  );
}


function dynamicCellBlocked(point: LogicalPoint): boolean {
  return Object.values(runtime.state.entities).some(
    (entity) =>
      entity.spatialBinding?.logicalX === point.x &&
      entity.spatialBinding?.logicalY === point.y,
  );
}

function routeDelayMs(): number {
  return globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    ? 0
    : 90;
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function routePreviewKeys(): Set<string> {
  return new Set(activeRoute.map(zeroPointKey));
}

function renderRoutePreview(): string {
  if (activeRoute.length === 0) return '';

  const logicalPoints = [avatarVisual, ...activeRoute];
  const screenPoints = logicalPoints.map(logicalToIso);
  const polyline = screenPoints.map((point) => `${point.x},${point.y}`).join(' ');

  return `
    <g class="route-preview" aria-hidden="true">
      <polyline class="route-preview__line" points="${polyline}" />
      ${screenPoints
        .slice(1)
        .map(
          (point, index) =>
            `<circle class="route-preview__node${index === screenPoints.length - 2 ? ' route-preview__node--goal' : ''}" cx="${point.x}" cy="${point.y}" r="5" />`,
        )
        .join('')}
    </g>
  `;
}

async function walkRoute(
  steps: readonly LogicalPoint[],
  label: string,
): Promise<boolean> {
  if (busy) return false;

  if (steps.length === 0) {
    routeTargetLabel = null;
    activeRoute = [];
    notice = `Você já está em posição para ${label}.`;
    render();
    return true;
  }

  busy = true;
  routeTargetLabel = label;
  activeRoute = steps.map((step) => ({ ...step }));
  notice = `Rota para ${label}: ${steps.length} passo(s).`;
  render();

  await wait(routeDelayMs());

  try {
    for (const step of steps) {
      const result = await runtime.execute(
        command(
          'MoveAvatar',
          {
            logicalX: step.x,
            logicalY: step.y,
          },
          ZERO_IDS.avatar,
        ),
      );

      if (!result.accepted) {
        if (result.needsReload) {
          await runtime.reload();
        }

        avatarVisual = {
          x: runtime.state.avatarPosition.logicalX,
          y: runtime.state.avatarPosition.logicalY,
        };
        activeRoute = [];
        routeTargetLabel = null;
        notice = `Rota interrompida: ${result.rejectionCode ?? 'WORLD_CHANGED'}.`;
        await refreshChronicle();
        render();
        return false;
      }

      avatarVisual = {
        x: runtime.state.avatarPosition.logicalX,
        y: runtime.state.avatarPosition.logicalY,
      };
      activeRoute = activeRoute.slice(1);

      if (isHomeThresholdCell(avatarVisual)) {
        notice = 'Você atravessou o threshold da Home.';
      }

      render();
      await wait(routeDelayMs());
    }

    await refreshChronicle();
    routeTargetLabel = null;
    notice = `Destino alcançado: ${label}.`;
    return true;
  } finally {
    busy = false;
    activeRoute = [];
    routeTargetLabel = null;
    render();
  }
}

async function routeToFixture(fixture: ZeroSceneFixture): Promise<void> {
  selectedId = fixture.id;

  if (!fixture.interactive) {
    notice = `${fixture.label}: elemento de cenário/observação.`;
    render();
    return;
  }

  const route = findZeroInteractionRoute(
    avatarVisual,
    fixture.logical,
    dynamicCellBlocked,
  );

  if (!route) {
    activeRoute = [];
    routeTargetLabel = null;
    notice = `Não existe rota caminhável até ${fixture.label} no estado atual.`;
    render();
    return;
  }

  await walkRoute(route.steps, fixture.label);
}

async function routeToTile(destination: LogicalPoint): Promise<void> {
  selectedId = null;

  const route = findZeroPath(
    avatarVisual,
    destination,
    dynamicCellBlocked,
  );

  if (!route) {
    activeRoute = [];
    routeTargetLabel = null;
    notice = `A célula (${destination.x}, ${destination.y}) não possui rota caminhável.`;
    render();
    return;
  }

  await walkRoute(route.steps, `(${destination.x}, ${destination.y})`);
}


function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function formatWorldTimestamp(value: string): string {
  return value
    .replace('WORLD-DAY-', 'Dia ')
    .replace('T', ' · ');
}

async function refreshChronicle(): Promise<void> {
  const sources = await ports.events.readAfter(ZERO_IDS.world, 0);
  chronicleEntries = projectZeroChronicle(sources);
  eventInspectorRows = projectEventInspector(sources);
}

function renderChronicle(): string {
  if (chronicleEntries.length === 0) {
    return '<p class="muted">O Chronicle ainda não possui marcos derivados.</p>';
  }

  return chronicleEntries
    .slice(-8)
    .reverse()
    .map((entry) => {
      const authorityClass =
        entry.authority === 'HUMAN_AUTHORED_INTERPRETATION'
          ? ' chronicle-entry--interpretation'
          : '';
      const authorityLabel =
        entry.authority === 'HUMAN_AUTHORED_INTERPRETATION'
          ? 'INTERPRETAÇÃO'
          : 'EVENTO DERIVADO';

      return `
        <article class="chronicle-entry${authorityClass}">
          <div class="chronicle-entry__meta">
            <span>${escapeHtml(entry.category)}</span>
            <span>${authorityLabel}</span>
            <span>${escapeHtml(formatWorldTimestamp(entry.worldTimestamp))}</span>
          </div>
          <strong>${escapeHtml(entry.title)}</strong>
          <p>${escapeHtml(entry.detail)}</p>
          <small>fonte: ${entry.sourceEventRefs.map(escapeHtml).join(' · ')}</small>
        </article>
      `;
    })
    .join('');
}

function renderEventInspector(): string {
  if (!eventInspectorOpen) return '';

  if (eventInspectorRows.length === 0) {
    return '<div class="event-inspector"><p class="muted">Nenhum evento persistido.</p></div>';
  }

  return `
    <div class="event-inspector">
      ${eventInspectorRows
        .slice()
        .reverse()
        .slice(0, 24)
        .map(
          (row) => `
            <details class="event-row">
              <summary>
                <span>#${row.sequenceNo}</span>
                <strong>${escapeHtml(row.eventType)}</strong>
                <small>${escapeHtml(formatWorldTimestamp(row.worldTimestamp))}</small>
              </summary>
              <dl>
                <dt>eventId</dt><dd>${escapeHtml(row.eventId)}</dd>
                <dt>actor</dt><dd>${escapeHtml(row.actorId ?? '—')}</dd>
                <dt>target</dt><dd>${escapeHtml(row.targetId ?? '—')}</dd>
                <dt>correlation</dt><dd>${escapeHtml(row.correlationId)}</dd>
                <dt>causation</dt><dd>${escapeHtml(row.causationId ?? '—')}</dd>
              </dl>
              <pre>${escapeHtml(JSON.stringify(row.payload, null, 2))}</pre>
            </details>
          `,
        )
        .join('')}
    </div>
  `;
}

function command(
  commandType: ZeroCommandType,
  payload: Record<string, unknown> = {},
  targetId?: string,
): HnkCommand<Record<string, unknown>> {
  const commandId = crypto.randomUUID();
  return {
    commandId,
    commandType,
    schemaVersion: 1,
    actorId: ZERO_IDS.avatar,
    verseId: ZERO_IDS.verse,
    worldId: ZERO_IDS.world,
    sessionId: 'SESSION-WEB-ZERO-001',
    targetId,
    issuedAtReal: new Date().toISOString(),
    issuedAtWorld: runtime.state.worldTime,
    correlationId: `WEB:${commandId}`,
    idempotencyKey: `WEB:${commandId}`,
    payload,
  };
}

async function execute(
  commandType: ZeroCommandType,
  payload: Record<string, unknown> = {},
  targetId?: string,
) {
  if (busy) return null;
  busy = true;
  render();

  try {
    const result = await runtime.execute(command(commandType, payload, targetId));

    if (!result.accepted) {
      notice = `Ação negada: ${result.rejectionCode ?? 'UNKNOWN'}`;
    }

    if (result.needsReload) {
      await runtime.reload();
      avatarVisual = {
        x: runtime.state.avatarPosition.logicalX,
        y: runtime.state.avatarPosition.logicalY,
      };
      notice = 'O mundo foi recarregado após conflito de versão.';
    }

    await refreshChronicle();
    return result;
  } finally {
    busy = false;
    window.setTimeout(render, 0);
  }
}

function homeTile(x: number, y: number): boolean {
  return (
    x >= ZERO_HOME_FOOTPRINT.minX &&
    x <= ZERO_HOME_FOOTPRINT.maxX &&
    y >= ZERO_HOME_FOOTPRINT.minY &&
    y <= ZERO_HOME_FOOTPRINT.maxY
  );
}

function fixtureGlyph(kind: ZeroSceneFixture['kind']): string {
  switch (kind) {
    case 'bed':
      return '▰';
    case 'workbench':
      return '⚒';
    case 'vali':
      return 'V';
    case 'metatron':
      return 'M';
    case 'cartography':
      return '⌘';
    case 'wood':
      return '♠';
    case 'storage-zone':
      return '◇';
    case 'box':
      return '▣';
    default:
      return '•';
  }
}

function fixtureClass(kind: ZeroSceneFixture['kind']): string {
  return `fixture fixture--${kind}`;
}

function renderTiles(): string {
  const tiles: string[] = [];
  const routeKeys = routePreviewKeys();
  const routeGoal = activeRoute.at(-1);
  for (let y = 1; y <= ZERO_GRID.height; y += 1) {
    for (let x = 1; x <= ZERO_GRID.width; x += 1) {
      const classes = ['tile'];
      if (homeTile(x, y)) classes.push('tile--home');
      if (isHomeWallCell({ x, y })) classes.push('tile--wall');
      if (isHomeThresholdCell({ x, y })) classes.push('tile--threshold');
      if (x === 5 && y === 5) classes.push('tile--storage');
      if (routeKeys.has(zeroPointKey({ x, y }))) classes.push('tile--route');
      if (routeGoal?.x === x && routeGoal.y === y) classes.push('tile--route-goal');

      tiles.push(
        `<polygon class="${classes.join(' ')}" points="${tilePolygon({ x, y })}" data-tile-x="${x}" data-tile-y="${y}" />`,
      );
    }
  }
  return tiles.join('');
}

function renderFixtures(state: ZeroWorldState): string {
  return buildZeroScene(state)
    .map((fixture) => {
      const point = logicalToIso(fixture.logical);
      const selected = fixture.id === selectedId ? ' is-selected' : '';
      const quantity =
        fixture.quantity == null
          ? ''
          : `<text class="fixture__quantity" x="0" y="-27">${fixture.quantity}</text>`;

      return `
        <g class="${fixtureClass(fixture.kind)}${selected}" transform="translate(${point.x} ${point.y - 12})" data-fixture-id="${fixture.id}" role="button" tabindex="0" aria-label="${fixture.label}">
          <ellipse class="fixture__shadow" cx="0" cy="15" rx="18" ry="7" />
          <circle class="fixture__body" cx="0" cy="-3" r="19" />
          <text class="fixture__glyph" x="0" y="3">${fixtureGlyph(fixture.kind)}</text>
          ${quantity}
          <text class="fixture__label" x="0" y="38">${fixture.label}</text>
        </g>
      `;
    })
    .join('');
}

function selectedFixture(state: ZeroWorldState): ZeroSceneFixture | null {
  return buildZeroScene(state).find((fixture) => fixture.id === selectedId) ?? null;
}

function primaryActionFor(
  fixture: ZeroSceneFixture | null,
  state: ZeroWorldState,
): { label: string; enabled: boolean } {
  if (!fixture) return { label: 'Selecione algo no mundo', enabled: false };

  if (
    fixture.interactive &&
    !isWithinInteractionRange(avatarVisual, fixture.logical)
  ) {
    const distance = manhattanDistance(avatarVisual, fixture.logical);
    return {
      label: `Aproxime-se · distância ${distance}`,
      enabled: false,
    };
  }

  switch (fixture.kind) {
    case 'vali':
      return state.lexemeObserved
        ? { label: state.valiKnown ? 'VALI conhecido' : 'Forma observada', enabled: false }
        : { label: 'Observar VALI', enabled: true };

    case 'metatron':
      if (!state.lexemeObserved) {
        return { label: 'Observe VALI primeiro', enabled: false };
      }
      if (!state.valiKnown) return { label: 'Perguntar sobre VALI', enabled: true };
      if (!state.practicalKnowledgeDiscovered) {
        return { label: 'Compreender o trabalho prático', enabled: true };
      }
      if (hasPlacedWoodenBox(state) && playerWood(state) > 0 && !hasCompletedGift(state)) {
        return { label: 'Oferecer a madeira restante', enabled: true };
      }
      return { label: 'Conversar com Metatron', enabled: true };

    case 'wood':
      return state.woodNodeRemaining > 0
        ? { label: 'Coletar 1 Madeira', enabled: state.practicalKnowledgeDiscovered }
        : { label: 'Fonte esgotada', enabled: false };

    case 'workbench':
      if (!state.practicalKnowledgeDiscovered) {
        return { label: 'Conhecimento necessário', enabled: false };
      }
      if (playerWood(state) < 3) {
        return { label: `Madeira necessária (3) · você tem ${playerWood(state)}`, enabled: false };
      }
      if (state.skillEvidenceIds.length === 0) {
        return { label: 'Praticar Trabalho Prático', enabled: true };
      }
      if (!state.entities[ZERO_IDS.woodenBox]) {
        return { label: 'Criar Caixa de Madeira', enabled: true };
      }
      return { label: 'Caixa já criada', enabled: false };

    case 'storage-zone': {
      const box = state.entities[ZERO_IDS.woodenBox];
      if (!box) return { label: 'Crie a Caixa primeiro', enabled: false };
      if (box.spatialBinding) return { label: 'Zona ocupada', enabled: false };
      return { label: 'Colocar Caixa aqui', enabled: true };
    }

    case 'bed':
      return { label: 'Descansar · +8h', enabled: true };

    case 'box':
      return { label: 'Inspecionar Caixa persistente', enabled: true };

    default:
      return { label: 'Observar', enabled: true };
  }
}

async function runPrimaryAction(): Promise<void> {
  const initialState = runtime.state;
  const fixture = selectedFixture(initialState);
  if (!fixture) return;

  if (
    fixture.interactive &&
    !isWithinInteractionRange(avatarVisual, fixture.logical)
  ) {
    notice = `Aproxime-se de ${fixture.label} para interagir.`;
    render();
    return;
  }

  if (!(await synchronizeAvatarCheckpoint())) return;

  const state = runtime.state;

  switch (fixture.kind) {
    case 'vali': {
      if (!state.lexemeObserved) {
        const result = await execute('ObserveLexeme', {}, ZERO_IDS.valiSurface);
        if (result?.accepted) notice = 'Você observou a forma VALI. O significado ainda não foi inferido.';
      }
      break;
    }

    case 'metatron': {
      if (!state.lexemeObserved) {
        notice = 'Metatron aponta para VALI. Observe a forma primeiro.';
        render();
        return;
      }

      if (!state.valiKnown) {
        const result = await execute('RequestLexemeTeaching', {}, ZERO_IDS.metatron);
        if (result?.accepted) notice = 'Metatron ensina: VALI — trabalho / trabalhar.';
        return;
      }

      if (!state.practicalKnowledgeDiscovered) {
        const result = await execute('DiscoverKnowledge', {}, ZERO_IDS.metatron);
        if (result?.accepted) {
          notice = 'Conhecimento prático disponível. A referência CODEX continua corretamente pendente.';
        }
        return;
      }

      if (hasPlacedWoodenBox(state) && playerWood(state) > 0 && !hasCompletedGift(state)) {
        const offer = await execute('OfferTransfer', {}, ZERO_IDS.metatron);
        if (offer?.accepted && offer.data?.offerAccepted === true) {
          const transfer = await execute(
            'TransferOwnership',
            { toOwnerId: ZERO_IDS.metatron, quantity: 1 },
            ZERO_IDS.metatron,
          );
          if (transfer?.accepted) {
            notice = 'Metatron recebeu 1 Madeira. Propriedade, memória e relação foram atualizadas.';
          }
        }
        return;
      }

      notice =
        state.agentMemories.length > 0
          ? `Metatron mantém ${state.agentMemories.length} memória(s) causalmente ligadas aos eventos.`
          : 'Metatron observa o mundo sem inventar estado.';
      render();
      break;
    }

    case 'wood': {
      const result = await execute('GatherResource', { quantity: 1 }, ZERO_IDS.woodNode);
      if (result?.accepted) {
        notice = `Madeira coletada. Inventário: ${playerWood(result.state)}.`;
      }
      break;
    }

    case 'workbench': {
      if (state.skillEvidenceIds.length === 0) {
        const result = await execute('AttemptPractice', {}, ZERO_IDS.workbench);
        if (result?.accepted) notice = 'Prática concluída: Skill Evidence registrada.';
        return;
      }

      if (!state.entities[ZERO_IDS.woodenBox]) {
        const result = await execute('CraftEntity', {}, ZERO_IDS.workbench);
        if (result?.accepted) {
          selectedId = ZERO_IDS.storageZone;
          notice = 'Caixa criada. A identidade existe antes da posição. Agora coloque-a na Home.';
        }
      }
      break;
    }

    case 'storage-zone': {
      const validation = await execute(
        'ValidatePlacement',
        { landId: ZERO_IDS.land, logicalX: 5, logicalY: 5, orientation: 0 },
        ZERO_IDS.woodenBox,
      );
      if (!validation?.accepted) return;

      const placed = await execute(
        'PlaceEntity',
        { landId: ZERO_IDS.land, logicalX: 5, logicalY: 5, orientation: 0 },
        ZERO_IDS.woodenBox,
      );
      if (placed?.accepted) {
        selectedId = ZERO_IDS.woodenBox;
        notice = 'A Caixa mudou a Home persistentemente. Metatron observou o evento.';
      }
      break;
    }

    case 'bed': {
      const result = await execute('Rest', {}, ZERO_IDS.bed);
      if (result?.accepted) notice = 'Você descansou. Energia e World Time foram atualizados.';
      break;
    }

    case 'box':
      notice = 'Esta é a mesma entidade criada na Bancada e depois ligada espacialmente à Home.';
      render();
      break;

    default:
      notice = `${fixture.label}: superfície de observação.`;
      render();
  }
}

async function synchronizeAvatarCheckpoint(): Promise<boolean> {
  const authoritative = runtime.state.avatarPosition;

  if (
    authoritative.logicalX === avatarVisual.x &&
    authoritative.logicalY === avatarVisual.y
  ) {
    return true;
  }

  avatarVisual = {
    x: authoritative.logicalX,
    y: authoritative.logicalY,
  };
  activeRoute = [];
  routeTargetLabel = null;
  notice = 'A posição visual foi ressincronizada com o estado autoritativo.';
  render();
  return false;
}

function visualCellBlocked(next: LogicalPoint): boolean {
  return isStaticSolidCell(next) || dynamicCellBlocked(next);
}

async function moveAvatar(dx: number, dy: number): Promise<void> {
  if (busy) return;

  const next = {
    x: avatarVisual.x + dx,
    y: avatarVisual.y + dy,
  };

  if (!insideZeroLand(next)) {
    notice = 'O limite desta Land impede esse passo.';
    render();
    return;
  }

  if (visualCellBlocked(next)) {
    notice = 'Caminho bloqueado. Procure outra passagem.';
    render();
    return;
  }

  await walkRoute([next], 'movimento manual');
}

function render(): void {
  const state = runtime.state;
  const scene = buildZeroScene(state);
  const selected = selectedFixture(state);
  const action = primaryActionFor(selected, state);
  const avatar = logicalToIso(avatarVisual);
  const box = state.entities[ZERO_IDS.woodenBox];

  app.innerHTML = `
    <div class="shell">
      <header class="topbar">
        <div>
          <p class="eyebrow">HNK-VERSE · ZERO · MALKUTH</p>
          <h1>A primeira Home que lembra</h1>
        </div>
        <div class="topbar__status">
          <span>☼ ${state.worldTime.replace('WORLD-DAY-', 'D').replace('T', ' · ')}</span>
          <span>◉ Energia ${state.energyRest}</span>
          <span>▦ Eventos ${runtime.currentSequenceNo}</span>
        </div>
      </header>

      <section class="play-layout">
        <div class="world-card">
          <div class="world-toolbar">
            <div>
              <strong>HOME + LAND 18×14</strong>
              <small>Renderer = projeção. Domínio = verdade.</small>
            </div>
            <div class="zoom-controls" aria-label="Zoom">
              <button data-zoom="-0.1" aria-label="Diminuir zoom">−</button>
              <span>${Math.round(cameraZoom * 100)}%</span>
              <button data-zoom="0.1" aria-label="Aumentar zoom">+</button>
            </div>
          </div>

          <div class="world-viewport">
            <svg class="world" viewBox="0 0 1152 610" style="transform:scale(${cameraZoom})" aria-label="Malkuth Home e Land">
              <defs>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>
              <g class="tiles">${renderTiles()}</g>
              ${renderRoutePreview()}
              <g class="fixtures">${renderFixtures(state)}</g>
              <g class="avatar" transform="translate(${avatar.x} ${avatar.y - 15})">
                <ellipse class="avatar__shadow" cx="0" cy="17" rx="15" ry="6" />
                <circle class="avatar__aura" cx="0" cy="-2" r="20" />
                <circle class="avatar__body" cx="0" cy="-2" r="12" />
                <text class="avatar__glyph" x="0" y="3">T</text>
              </g>
            </svg>
          </div>

          <div class="mobile-pad" aria-label="Movimento no mundo">
            <span></span><button data-move="0,-1">▲</button><span></span>
            <button data-move="-1,0">◀</button><button class="mobile-pad__center" disabled>●</button><button data-move="1,0">▶</button>
            <span></span><button data-move="0,1">▼</button><span></span>
          </div>
        </div>

        <aside class="panel">
          <section class="panel-section">
            <p class="eyebrow">CONTEXTO</p>
            <h2>${selected?.label ?? 'Mundo'}</h2>
            <p class="muted">${selected?.state ?? 'Selecione um elemento do mundo.'}</p>
            ${selected ? `<p class="distance-readout">Distância: ${manhattanDistance(avatarVisual, selected.logical)} · alcance: 1</p>` : ''}
            ${routeTargetLabel ? `<p class="route-status">Rota ativa → ${escapeHtml(routeTargetLabel)} · ${activeRoute.length} passo(s) restante(s)</p>` : ''}
            <button class="primary-action" data-primary-action ${action.enabled && !busy ? '' : 'disabled'}>
              ${busy ? 'Caminhando…' : action.label}
            </button>
          </section>

          <section class="panel-section stats">
            <div><span>VALI</span><strong>${state.valiKnown ? 'CONHECIDO' : state.lexemeObserved ? 'OBSERVADO' : 'DESCONHECIDO'}</strong></div>
            <div><span>Conhecimento</span><strong>${state.practicalKnowledgeDiscovered ? 'PRÁTICO' : 'PENDENTE'}</strong></div>
            <div><span>Madeira</span><strong>${playerWood(state)} / nó ${state.woodNodeRemaining}</strong></div>
            <div><span>Skill Evidence</span><strong>${state.skillEvidenceIds.length}</strong></div>
            <div><span>Caixa</span><strong>${box?.spatialBinding ? 'COLOCADA' : box ? 'CRIADA' : 'NÃO CRIADA'}</strong></div>
            <div><span>Metatron</span><strong>${state.agentMemories.length} memória(s)</strong></div>
            <div><span>Presente</span><strong>${hasCompletedGift(state) ? 'REGISTRADO' : 'PENDENTE'}</strong></div>
            <div><span>Metatron Wood</span><strong>${metatronWood(state)}</strong></div>
          </section>

          <section class="panel-section notice" role="status">
            <p>${notice}</p>
          </section>

          <section class="panel-section chronicle">
            <div class="section-heading">
              <div>
                <p class="eyebrow">CHRONICLE</p>
                <h2>História reconstruível</h2>
              </div>
              <span class="count-badge">${chronicleEntries.length}</span>
            </div>
            <p class="muted">Derivado do Event Ledger. Reflexões humanas aparecem separadas como interpretação.</p>
            <div class="chronicle-list">
              ${renderChronicle()}
            </div>
            <button class="inspector-toggle" data-toggle-inspector>
              ${eventInspectorOpen ? 'Ocultar Event Inspector' : 'Abrir Event Inspector'}
            </button>
            ${renderEventInspector()}
          </section>

          <section class="panel-section reflection">
            <label for="reflection">Chronicle · reflexão humana</label>
            <textarea id="reflection" maxlength="280" placeholder="Registre sua interpretação; ela não vira cânone automaticamente."></textarea>
            <button data-reflect>Registrar reflexão</button>
          </section>

          <section class="panel-section panel-actions">
            <button data-reset class="danger-quiet">Reiniciar ZERO local</button>
            <small>Persistência browser-local para este vertical slice.</small>
          </section>
        </aside>
      </section>

      <footer class="footer">
        <span>WASD / setas: passo autoritativo</span>
        <span>Toque/clique: rota até célula ou alvo · botão contextual: agir</span>
        <span>PWA · localStorage · sem LLM obrigatório</span>
      </footer>
    </div>
  `;

  document.querySelectorAll<SVGGElement>('[data-fixture-id]').forEach((element) => {
    const selectAndRoute = async (event?: Event) => {
      event?.stopPropagation();
      if (busy) return;

      const fixtureId = element.dataset.fixtureId ?? null;
      selectedId = fixtureId;
      const fixture = selectedFixture(runtime.state);

      if (!fixture) {
        render();
        return;
      }

      await routeToFixture(fixture);
    };

    element.addEventListener('click', (event) => {
      void selectAndRoute(event);
    });
    element.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        void selectAndRoute(event);
      }
    });
  });

  document.querySelectorAll<SVGPolygonElement>('[data-tile-x][data-tile-y]').forEach((element) => {
    element.addEventListener('click', (event) => {
      event.stopPropagation();
      if (busy) return;

      const x = Number(element.dataset.tileX);
      const y = Number(element.dataset.tileY);

      if (!Number.isInteger(x) || !Number.isInteger(y)) return;
      void routeToTile({ x, y });
    });
  });

  document.querySelector<HTMLButtonElement>('[data-primary-action]')
    ?.addEventListener('click', () => void runPrimaryAction());

  document.querySelectorAll<HTMLButtonElement>('[data-move]').forEach((button) => {
    button.addEventListener('click', () => {
      const [dx, dy] = (button.dataset.move ?? '0,0').split(',').map(Number);
      void moveAvatar(dx, dy);
    });
  });

  document.querySelectorAll<HTMLButtonElement>('[data-zoom]').forEach((button) => {
    button.addEventListener('click', () => {
      const delta = Number(button.dataset.zoom ?? 0);
      cameraZoom = Math.max(0.75, Math.min(1.25, cameraZoom + delta));
      render();
    });
  });

  document.querySelector<HTMLButtonElement>('[data-toggle-inspector]')
    ?.addEventListener('click', () => {
      eventInspectorOpen = !eventInspectorOpen;
      render();
    });

  document.querySelector<HTMLButtonElement>('[data-reflect]')?.addEventListener(
    'click',
    async () => {
      const textarea = document.querySelector<HTMLTextAreaElement>('#reflection');
      const text = textarea?.value.trim() ?? '';
      if (!text) {
        notice = 'Escreva uma reflexão antes de registrar.';
        render();
        return;
      }
      const result = await execute('AppendReflection', { text, linkedEventRefs: [] });
      if (result?.accepted) notice = 'Reflexão registrada como interpretação humana.';
    },
  );

  document.querySelector<HTMLButtonElement>('[data-reset]')?.addEventListener(
    'click',
    async () => {
      const confirmed = globalThis.confirm(
        'Reiniciar o ZERO local? O estado persistido neste navegador será apagado.',
      );
      if (!confirmed) return;
      persistence.clear(ZERO_IDS.world);
      activeRoute = [];
      routeTargetLabel = null;
      chronicleEntries = [];
      eventInspectorRows = [];
      eventInspectorOpen = false;
      runtime = await ZeroCommandRuntime.create(
        ports,
        structuredClone(ZERO_FIXTURE_V1_INITIAL_STATE),
      );
      avatarVisual = {
        x: runtime.state.avatarPosition.logicalX,
        y: runtime.state.avatarPosition.logicalY,
      };
      selectedId = ZERO_IDS.valiSurface;
      notice = 'ZERO local reiniciado.';
      await execute('StartSession');
    },
  );

  // Keep scene reference used by development diagnostics without making it truth.
  void scene;
}

window.addEventListener('keydown', (event) => {
  const target = event.target as HTMLElement | null;
  if (target?.matches('textarea, input, button')) return;

  const key = event.key.toLowerCase();
  if (key === 'w' || key === 'arrowup') void moveAvatar(0, -1);
  if (key === 's' || key === 'arrowdown') void moveAvatar(0, 1);
  if (key === 'a' || key === 'arrowleft') void moveAvatar(-1, 0);
  if (key === 'd' || key === 'arrowright') void moveAvatar(1, 0);
});

render();
