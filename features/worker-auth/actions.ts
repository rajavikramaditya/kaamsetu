"use server";

/** Server actions for Worker authentication. Implemented in Sprint 3. */
export async function worker_authAction(): Promise<{ ok: false; message: string }> {
  return {
    ok: false,
    message: "Worker authentication is not implemented yet (Sprint 3).",
  };
}
