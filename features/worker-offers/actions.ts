"use server";

/** Server actions for worker-offers — call server/ modules, not Supabase directly. */
export async function placeholderAction(): Promise<{ ok: boolean }> {
  return { ok: true };
}
