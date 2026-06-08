"use server";

/** Server actions for worker-jobs — call server/ modules, not Supabase directly. */
export async function placeholderAction(): Promise<{ ok: boolean }> {
  return { ok: true };
}
