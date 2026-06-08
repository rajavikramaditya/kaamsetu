"use server";

/** Server actions for admin-settings — call server/ modules, not Supabase directly. */
export async function placeholderAction(): Promise<{ ok: boolean }> {
  return { ok: true };
}
