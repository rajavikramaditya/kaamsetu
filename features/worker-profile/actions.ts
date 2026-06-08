"use server";

/** Server actions for Worker profile. Implemented in Sprint 3. */
export async function worker_profileAction(): Promise<{ ok: false; message: string }> {
  return {
    ok: false,
    message: "Worker profile is not implemented yet (Sprint 3).",
  };
}
