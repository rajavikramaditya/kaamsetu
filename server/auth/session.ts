import { createSupabaseServerClient } from "@/server/db/supabase-server";

export interface SessionUser {
  id: string;
  email?: string;
  role?: string;
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  return {
    id: user.id,
    email: user.email,
    role: (user.app_metadata?.role as string | undefined) ?? undefined,
  };
}
