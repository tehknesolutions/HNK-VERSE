import { readFile } from 'node:fs/promises';

const path = new URL('../supabase/schemas/hnk_verse_private.sql', import.meta.url);
const sql = await readFile(path, 'utf8');
const normalized = sql.toLowerCase();

const required = [
  'create schema if not exists hnk_verse_private',
  'create table if not exists hnk_verse_private.world_streams',
  'create table if not exists hnk_verse_private.world_events',
  'create table if not exists hnk_verse_private.command_receipts',
  'create table if not exists hnk_verse_private.world_snapshots',
  'primary key (world_id, sequence_no)',
  'primary key (world_id, actor_id, idempotency_key)',
  'alter table hnk_verse_private.world_events enable row level security',
  'world_events_reject_update',
  'world_events_reject_delete',
  'security invoker',
];

for (const token of required) {
  if (!normalized.includes(token)) {
    throw new Error(`ZERO_PERSISTENCE_SCHEMA_MISSING: ${token}`);
  }
}

if (/security\s+definer/i.test(sql)) {
  throw new Error('ZERO_PERSISTENCE_SCHEMA_FORBIDS_SECURITY_DEFINER');
}

if (/grant\s+[^;]+\s+to\s+(anon|authenticated)\b/i.test(sql)) {
  throw new Error('ZERO_PERSISTENCE_SCHEMA_FORBIDS_BROWSER_GRANTS');
}

const rlsCount =
  normalized.match(/enable row level security/g)?.length ?? 0;

if (rlsCount < 7) {
  throw new Error(
    `ZERO_PERSISTENCE_SCHEMA_RLS_COUNT: expected >= 7, got ${rlsCount}`,
  );
}

console.log(
  'ZERO_PERSISTENCE_SCHEMA_CHECK_PASS: private schema, append-only events, no browser grants, no SECURITY DEFINER, RLS defense-in-depth',
);
