import "server-only";

import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";
import {
  getSupabaseServiceRoleKey,
  getSupabaseUrl,
} from "./env";

let adminClient: ReturnType<typeof createClient<Database>> | null = null;

export function createSupabaseAdminClient() {
  if (!adminClient) {
    adminClient = createClient<Database>(
      getSupabaseUrl(),
      getSupabaseServiceRoleKey(),
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    );
  }
  return adminClient;
}
