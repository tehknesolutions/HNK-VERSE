-- Server-only, idempotent first-run ZERO provisioning.
create or replace function hnk_verse_private.provision_zero_identity(p_user_id uuid)
returns table(identity_id text, verse_id text, world_id text, actor_id text)
language plpgsql security invoker set search_path = pg_catalog, hnk_verse_private
as $$
declare
  v_identity_id text := 'HNK-ID-'||p_user_id::text;
  v_verse_id text := 'VERSE-ZERO-'||p_user_id::text;
  v_world_id text := 'WORLD-ZERO-'||p_user_id::text;
  v_actor_id text := 'AVATAR-ZERO-'||p_user_id::text;
begin
  if p_user_id is null then raise exception 'REMOTE_AUTH_REQUIRED' using errcode='22004'; end if;
  insert into hnk_verse_private.hnk_identities(identity_id,user_id,primary_verse_id) values(v_identity_id,p_user_id,v_verse_id) on conflict on constraint hnk_identities_user_id_key do nothing;
  select h.identity_id,h.primary_verse_id into v_identity_id,v_verse_id from hnk_verse_private.hnk_identities h where h.user_id=p_user_id for update;
  if v_verse_id is null then v_verse_id:='VERSE-ZERO-'||p_user_id::text; end if;
  insert into hnk_verse_private.personal_verses(verse_id,identity_id,primary_world_id,provenance) values(v_verse_id,v_identity_id,v_world_id,jsonb_build_object('provisioner','ZERO_IDENTITY_V1')) on conflict on constraint personal_verses_pkey do nothing;
  select p.primary_world_id into v_world_id from hnk_verse_private.personal_verses p where p.verse_id=v_verse_id for update;
  if v_world_id is null then v_world_id:='WORLD-ZERO-'||p_user_id::text; end if;
  insert into hnk_verse_private.worlds(world_id,verse_id,world_template_ref,world_ruleset_version,provenance) values(v_world_id,v_verse_id,'ZERO-WORLD-V1','ZERO-RULESET-V1',jsonb_build_object('provisioner','ZERO_IDENTITY_V1')) on conflict on constraint worlds_pkey do nothing;
  insert into hnk_verse_private.world_streams(world_id,last_sequence) values(v_world_id,0) on conflict on constraint world_streams_pkey do nothing;
  update hnk_verse_private.hnk_identities h set primary_verse_id=v_verse_id where h.user_id=p_user_id and h.primary_verse_id is distinct from v_verse_id;
  update hnk_verse_private.personal_verses p set primary_world_id=v_world_id where p.verse_id=v_verse_id and p.primary_world_id is distinct from v_world_id;
  identity_id:=v_identity_id; verse_id:=v_verse_id; world_id:=v_world_id; actor_id:=v_actor_id; return next;
end; $$;

revoke all on function hnk_verse_private.provision_zero_identity(uuid) from public;
do $$ begin
  if exists(select 1 from pg_roles where rolname='anon') then execute 'revoke all on function hnk_verse_private.provision_zero_identity(uuid) from anon'; end if;
  if exists(select 1 from pg_roles where rolname='authenticated') then execute 'revoke all on function hnk_verse_private.provision_zero_identity(uuid) from authenticated'; end if;
end $$;