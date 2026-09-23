// Generated from the live HNK-VERSE private schema on 2026-09-23.
// Source project: gbhfhbtbwyxjdnkvdufj (sa-east-1).
// The standard Supabase API type generator intentionally omits this schema
// because hnk_verse_private is not exposed through the Data API.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type HnkVersePrivateDatabase = {
  hnk_identities: {
    Row: {
      identity_id: string;
      user_id: string;
      primary_verse_id: string | null;
      created_at: string;
      schema_version: number;
    };
  };
  personal_verses: {
    Row: {
      verse_id: string;
      identity_id: string;
      primary_world_id: string | null;
      created_at: string;
      provenance: Json;
      schema_version: number;
    };
  };
  worlds: {
    Row: {
      world_id: string;
      verse_id: string;
      world_template_ref: string | null;
      world_ruleset_version: string;
      state_version: number;
      created_at: string;
      provenance: Json;
      status: string;
      schema_version: number;
    };
  };
  world_streams: {
    Row: {
      world_id: string;
      last_sequence: number;
      updated_at: string;
    };
  };
  world_events: {
    Row: {
      world_id: string;
      sequence_no: number;
      event_id: string;
      event_type: string;
      schema_version: number;
      verse_id: string;
      actor_id: string | null;
      target_id: string | null;
      session_id: string | null;
      real_timestamp: string;
      world_timestamp: string;
      correlation_id: string;
      causation_id: string | null;
      payload: Json;
      provenance: Json | null;
      created_at: string;
    };
  };
  command_receipts: {
    Row: {
      world_id: string;
      actor_id: string;
      idempotency_key: string;
      command_id: string;
      command_type: string;
      request_hash: string;
      result_status: string;
      result_event_ids: string[];
      rejection_code: string | null;
      created_at: string;
    };
  };
  world_snapshots: {
    Row: {
      snapshot_id: string;
      world_id: string;
      stream_sequence_no: number;
      schema_version: number;
      state_hash: string;
      state_payload: Json;
      created_at: string;
    };
  };
};
