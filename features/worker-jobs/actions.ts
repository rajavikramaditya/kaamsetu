"use server";

/** Server actions for Worker job lifecycle. Implemented in Sprint 6. */
export async function worker_jobsAction(): Promise<{ ok: false; message: string }> {
  return {
    ok: false,
    message: "Worker job lifecycle is not implemented yet (Sprint 6).",
  };
}
