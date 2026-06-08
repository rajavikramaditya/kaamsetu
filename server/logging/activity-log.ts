import "server-only";

import type { ActorType } from "@/types/enums";
import { createSupabaseAdminClient } from "@/server/db/supabase-admin";
import { sanitizeLogMetadata } from "@/server/security/sanitize-log-metadata";

export type ActivityLogInput = {
  actor_type: ActorType;
  actor_user_id?: string | null;
  actor_label?: string | null;
  entity_type: string;
  entity_id?: string | null;
  action: string;
  source?: "web" | "worker" | "admin" | "system";
  metadata?: Record<string, unknown>;
  ip_hash?: string | null;
  user_agent?: string | null;
};

export async function logActivity(input: ActivityLogInput): Promise<void> {
  const supabase = createSupabaseAdminClient();

  const payload = {
    actor_type: input.actor_type,
    actor_user_id: input.actor_user_id ?? null,
    actor_label: input.actor_label ?? null,
    entity_type: input.entity_type,
    entity_id: input.entity_id ?? null,
    action: input.action,
    source: input.source ?? "web",
    metadata: sanitizeLogMetadata(input.metadata ?? {}),
    ip_hash: input.ip_hash ?? null,
    user_agent: input.user_agent ?? null,
  };

  // Database types are generated after Sprint 1 migrations.
  const { error } = await (
    supabase as unknown as {
      from: (table: string) => {
        insert: (row: typeof payload) => Promise<{ error: { message: string } | null }>;
      };
    }
  )
    .from("activity_logs")
    .insert(payload);

  if (error) {
    console.error("[activity-log] Failed to write activity log", error.message);
  }
}
