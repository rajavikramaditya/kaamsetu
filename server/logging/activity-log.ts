import { createSupabaseAdminClient } from "@/server/db/supabase-admin";
import { sanitizeLogMetadata } from "@/server/security/sanitize-log-metadata";
import type { ActivityLogPayload } from "@/types/common";
import type { Json } from "@/types/database.types";

/**
 * Records an activity log entry for every mutation (KS-011 §19).
 * Uses admin client because RLS restricts direct inserts.
 */
export async function logActivity(payload: ActivityLogPayload): Promise<void> {
  try {
    const supabase = createSupabaseAdminClient();
    await supabase.from("activity_logs").insert({
      actor_type: payload.actor_type,
      actor_user_id: payload.actor_user_id ?? null,
      actor_label: payload.actor_label ?? null,
      entity_type: payload.entity_type,
      entity_id: payload.entity_id ?? null,
      action: payload.action,
      source: payload.source ?? "web",
      metadata: sanitizeLogMetadata(payload.metadata ?? {}) as Json,
    });
  } catch (error) {
    console.error("[activity-log] Failed to write log:", error);
  }
}
