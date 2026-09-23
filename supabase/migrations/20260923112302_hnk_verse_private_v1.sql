-- HNK-VERSE ZERO production persistence schema.
-- Declarative source for a future dedicated HNK-VERSE Supabase/Postgres project.
-- This schema is intentionally private and is not a browser-facing Data API surface.

create schema if not exists hnk_verse_private;

revoke all on schema hnk_verse_private from public;

do $$
begin
  if exists (select 1 from pg_roles where rolname = 'anon') then
    execute 'revoke all on schema hnk_verse_private from anon';
  end if;
  if exists (select 1 from pg_roles where rolname = 'authenticated') then
    execute 'revoke all on schema hnk_verse_private from authenticated';
  end if;
end
$$;

create table if not exists hnk_verse_private.hnk_identities (
  identity_id text primary key,
  user_id uuid unique not null,
  primary_verse_id text,
  created_at timestamptz not null default now(),
  schema_version integer not null default 1 check (schema_version > 0)
);

create table if not exists hnk_verse_private.personal_verses (
  verse_id text primary key,
  identity_id text not null references hnk_verse_private.hnk_identities(identity_id) on delete cascade,
  primary_world_id text,
  created_at timestamptz not null default now(),
  provenance jsonb not null default '{}'::jsonb,
  schema_version integer not null default 1 check (schema_version > 0)
);

create index if not exists personal_verses_identity_idx
  on hnk_verse_private.personal_verses(identity_id);

create table if not exists hnk_verse_private.worlds (
  world_id text primary key,
  verse_id text not null references hnk_verse_private.personal_verses(verse_id) on delete cascade,
  world_template_ref text,
  world_ruleset_version text not null,
  state_version bigint not null default 0 check (state_version >= 0),
  created_at timestamptz not null default now(),
  provenance jsonb not null default '{}'::jsonb,
  status text not null default 'ACTIVE',
  schema_version integer not null default 1 check (schema_version > 0)
);

create index if not exists worlds_verse_idx
  on hnk_verse_private.worlds(verse_id);

create table if not exists hnk_verse_private.world_streams (
  world_id text primary key references hnk_verse_private.worlds(world_id) on delete cascade,
  last_sequence bigint not null default 0 check (last_sequence >= 0),
  updated_at timestamptz not null default now()
);

create table if not exists hnk_verse_private.world_events (
  world_id text not null references hnk_verse_private.worlds(world_id) on delete cascade,
  sequence_no bigint not null check (sequence_no > 0),
  event_id text not null unique,
  event_type text not null,
  schema_version integer not null check (schema_version > 0),
  verse_id text not null,
  actor_id text,
  target_id text,
  session_id text,
  real_timestamp timestamptz not null,
  world_timestamp text not null,
  correlation_id text not null,
  causation_id text,
  payload jsonb not null,
  provenance jsonb,
  created_at timestamptz not null default now(),
  primary key (world_id, sequence_no)
);

create index if not exists world_events_world_event_type_idx
  on hnk_verse_private.world_events(world_id, event_type, sequence_no);

create index if not exists world_events_correlation_idx
  on hnk_verse_private.world_events(world_id, correlation_id);

create table if not exists hnk_verse_private.command_receipts (
  world_id text not null references hnk_verse_private.worlds(world_id) on delete cascade,
  actor_id text not null,
  idempotency_key text not null,
  command_id text not null,
  command_type text not null,
  request_hash text not null,
  result_status text not null check (result_status in ('accepted', 'rejected')),
  result_event_ids text[] not null default array[]::text[],
  rejection_code text,
  created_at timestamptz not null,
  primary key (world_id, actor_id, idempotency_key)
);

create unique index if not exists command_receipts_command_id_idx
  on hnk_verse_private.command_receipts(command_id);

create table if not exists hnk_verse_private.world_snapshots (
  snapshot_id text primary key,
  world_id text not null references hnk_verse_private.worlds(world_id) on delete cascade,
  stream_sequence_no bigint not null check (stream_sequence_no >= 0),
  schema_version integer not null check (schema_version > 0),
  state_hash text not null,
  state_payload jsonb not null,
  created_at timestamptz not null
);

create index if not exists world_snapshots_latest_idx
  on hnk_verse_private.world_snapshots(world_id, stream_sequence_no desc);

-- Defense in depth. The private schema is not exposed to browser roles, and
-- these tables have no anon/authenticated policies. Trusted server/database
-- roles may still bypass RLS according to their PostgreSQL privileges.
alter table hnk_verse_private.hnk_identities enable row level security;
alter table hnk_verse_private.personal_verses enable row level security;
alter table hnk_verse_private.worlds enable row level security;
alter table hnk_verse_private.world_streams enable row level security;
alter table hnk_verse_private.world_events enable row level security;
alter table hnk_verse_private.command_receipts enable row level security;
alter table hnk_verse_private.world_snapshots enable row level security;

create or replace function hnk_verse_private.reject_world_event_mutation()
returns trigger
language plpgsql
security invoker
set search_path = pg_catalog
as $$
begin
  raise exception 'HNK_VERSE_WORLD_EVENTS_APPEND_ONLY'
    using errcode = '55000';
end;
$$;

drop trigger if exists world_events_reject_update on hnk_verse_private.world_events;
create trigger world_events_reject_update
before update on hnk_verse_private.world_events
for each row execute function hnk_verse_private.reject_world_event_mutation();

drop trigger if exists world_events_reject_delete on hnk_verse_private.world_events;
create trigger world_events_reject_delete
before delete on hnk_verse_private.world_events
for each row execute function hnk_verse_private.reject_world_event_mutation();

comment on schema hnk_verse_private is
  'Private durable HNK-VERSE domain persistence. Not a browser-facing Data API schema.';

comment on table hnk_verse_private.world_events is
  'Append-only authoritative World Event Ledger.';

comment on table hnk_verse_private.command_receipts is
  'Idempotency and accepted/rejected command result receipts.';

comment on table hnk_verse_private.world_snapshots is
  'Disposable restore acceleration; Event Ledger remains historical authority.';
