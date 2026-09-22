import {
  ZERO_IDS,
  type HnkCommand,
  type ZeroCommandType,
} from '@hnk-verse/contracts';
import type { ZeroWorldState } from '@hnk-verse/domain';
import { ZERO_FIXTURE_V1_INITIAL_STATE } from '@hnk-verse/fixtures';
import { BrowserLocalPersistence } from '@hnk-verse/persistence';
import { ZeroCommandRuntime } from '@hnk-verse/simulation';

const storage = new Map<string, string>();

Object.defineProperty(globalThis, 'localStorage', {
  configurable: true,
  value: {
    getItem(key: string) {
      return storage.get(key) ?? null;
    },
    setItem(key: string, value: string) {
      storage.set(key, value);
    },
    removeItem(key: string) {
      storage.delete(key);
    },
  },
});

const persistence = new BrowserLocalPersistence<ZeroWorldState>(
  'hnk-verse:web-check',
);
const ports = {
  events: persistence,
  snapshots: persistence,
  receipts: persistence,
};

let serial = 0;

function command(
  commandType: ZeroCommandType,
  payload: Record<string, unknown> = {},
  targetId?: string,
): HnkCommand<Record<string, unknown>> {
  serial += 1;
  const id = `WEB-CHECK-${serial}`;
  return {
    commandId: id,
    commandType,
    schemaVersion: 1,
    actorId: ZERO_IDS.avatar,
    verseId: ZERO_IDS.verse,
    worldId: ZERO_IDS.world,
    sessionId: 'SESSION-WEB-CHECK-001',
    targetId,
    issuedAtReal: '2026-01-01T00:00:00Z',
    issuedAtWorld: 'WORLD-DAY-001T08:00:00',
    correlationId: id,
    idempotencyKey: id,
    payload,
  };
}

const runtimeA = await ZeroCommandRuntime.create(
  ports,
  structuredClone(ZERO_FIXTURE_V1_INITIAL_STATE),
);

await runtimeA.execute(command('StartSession'));
const observed = await runtimeA.execute(
  command('ObserveLexeme', {}, ZERO_IDS.valiSurface),
);

if (!observed.accepted || !runtimeA.state.lexemeObserved) {
  throw new Error('BROWSER_LOCAL_OBSERVE_FAILED');
}

// Simulate closing/reopening the PWA by discarding the runtime object.
const runtimeB = await ZeroCommandRuntime.create(
  ports,
  structuredClone(ZERO_FIXTURE_V1_INITIAL_STATE),
);

if (!runtimeB.state.lexemeObserved) {
  throw new Error('BROWSER_LOCAL_RELOAD_LOST_STATE');
}

const beforeRetry = runtimeB.currentSequenceNo;
const retryCommand = command(
  'GatherResource',
  { quantity: 1 },
  ZERO_IDS.woodNode,
);

const firstRejected = await runtimeB.execute(retryCommand);
const secondRejected = await runtimeB.execute(retryCommand);

if (
  firstRejected.accepted ||
  secondRejected.accepted ||
  !secondRejected.deduplicated
) {
  throw new Error('BROWSER_LOCAL_REJECTED_COMMAND_IDEMPOTENCY_FAILED');
}

if (runtimeB.currentSequenceNo !== beforeRetry) {
  throw new Error('BROWSER_LOCAL_REJECTED_COMMAND_CHANGED_WORLD_STREAM');
}

console.log(
  'ZERO_WEB_LOCAL_PERSISTENCE_CHECK_PASS: restore + rejected-command idempotency',
);
