"use server";

/** Server actions for Worker dispatch offers. Implemented in Sprint 5. */
export async function worker_offersAction(): Promise<{ ok: false; message: string }> {
  return {
    ok: false,
    message: "Worker dispatch offers is not implemented yet (Sprint 5).",
  };
}
