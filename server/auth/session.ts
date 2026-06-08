import { createSupabaseServerClient } from "@/server/db/supabase-server";

export async function getSession() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}

export async function getCurrentUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export function isAdminUser(user: { app_metadata?: Record<string, unknown> }): boolean {
  return user.app_metadata?.role === "admin";
}

export function isWorkerUser(user: { app_metadata?: Record<string, unknown> }): boolean {
  return user.app_metadata?.role === "worker";
}
