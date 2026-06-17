import type { SupabaseClient, User } from "@supabase/supabase-js";

export class AdminAuthError extends Error {
  code: "UNAUTHORIZED" | "FORBIDDEN";

  constructor(code: "UNAUTHORIZED" | "FORBIDDEN") {
    super(code);
    this.code = code;
  }
}

export function isAdminUser(user: User | null | undefined): boolean {
  if (!user) return false;
  const role = user.app_metadata?.role;
  return role === "admin";
}

export async function requireAdminUser(supabase: SupabaseClient): Promise<User> {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) throw new AdminAuthError("UNAUTHORIZED");
  if (!isAdminUser(user)) throw new AdminAuthError("FORBIDDEN");
  return user;
}
