import './styles.css';

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
  logicalToIso,
  tilePolygon,
  type LogicalPoint,
  type ZeroSceneFixture,
} from '@hnk-verse/renderer';
import { ZeroCommandRuntime } from '@hnk-verse/simulation';

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
let avatarVisual: LogicalPoint = { ...ZERO_SCENE_POSITIONS.avatarSpawn };
let cameraZoom = 1;
let notice = 'Observe o mundo. O ZERO deriva progresso do estado real.';
let busy = false;

if (runtime.currentSequenceNo === 0) {
  await execute('StartSession');
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
      notice = 'O mundo foi recarregado após conflito de versão.';
    }

    return result;
  } finally {
    busy = false;
    render();
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
  for (let y = 1; y <= ZERO_GRID.height; y += 1) {
    for (let x = 1; x <= ZERO_GRID.width; x += 1) {
      const classes = ['tile'];
      if (homeTile(x, y)) classes.push('tile--home');
      if (x === 5 && y === 5) classes.push('tile--storage');

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
  const state = runtime.state;
  const fixture = selectedFixture(state);
  if (!fixture) return;

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
          selectedId = 'ZONE-ZERO-HOME-STORAGE-001';
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

function moveAvatar(dx: number, dy: number): void {
  const next = {
    x: Math.max(1, Math.min(ZERO_GRID.width, avatarVisual.x + dx)),
    y: Math.max(1, Math.min(ZERO_GRID.height, avatarVisual.y + dy)),
  };
  if (insideZeroLand(next)) avatarVisual = next;
  render();
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
              <g class="fixtures">${renderFixtures(state)}</g>
              <g class="avatar" transform="translate(${avatar.x} ${avatar.y - 15})">
                <ellipse class="avatar__shadow" cx="0" cy="17" rx="15" ry="6" />
                <circle class="avatar__aura" cx="0" cy="-2" r="20" />
                <circle class="avatar__body" cx="0" cy="-2" r="12" />
                <text class="avatar__glyph" x="0" y="3">T</text>
              </g>
            </svg>
          </div>

          <div class="mobile-pad" aria-label="Movimento visual">
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
            <button class="primary-action" data-primary-action ${action.enabled && !busy ? '' : 'disabled'}>
              ${busy ? 'Processando…' : action.label}
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
        <span>WASD / setas: movimento visual V1</span>
        <span>Toque/clique: selecionar · botão contextual: agir</span>
        <span>PWA · localStorage · sem LLM obrigatório</span>
      </footer>
    </div>
  `;

  document.querySelectorAll<SVGGElement>('[data-fixture-id]').forEach((element) => {
    const select = () => {
      selectedId = element.dataset.fixtureId ?? null;
      render();
    };
    element.addEventListener('click', select);
    element.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') select();
    });
  });

  document.querySelector<HTMLButtonElement>('[data-primary-action]')
    ?.addEventListener('click', () => void runPrimaryAction());

  document.querySelectorAll<HTMLButtonElement>('[data-move]').forEach((button) => {
    button.addEventListener('click', () => {
      const [dx, dy] = (button.dataset.move ?? '0,0').split(',').map(Number);
      moveAvatar(dx, dy);
    });
  });

  document.querySelectorAll<HTMLButtonElement>('[data-zoom]').forEach((button) => {
    button.addEventListener('click', () => {
      const delta = Number(button.dataset.zoom ?? 0);
      cameraZoom = Math.max(0.75, Math.min(1.25, cameraZoom + delta));
      render();
    });
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
      runtime = await ZeroCommandRuntime.create(
        ports,
        structuredClone(ZERO_FIXTURE_V1_INITIAL_STATE),
      );
      avatarVisual = { ...ZERO_SCENE_POSITIONS.avatarSpawn };
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
  if (key === 'w' || key === 'arrowup') moveAvatar(0, -1);
  if (key === 's' || key === 'arrowdown') moveAvatar(0, 1);
  if (key === 'a' || key === 'arrowleft') moveAvatar(-1, 0);
  if (key === 'd' || key === 'arrowright') moveAvatar(1, 0);
});

render();
