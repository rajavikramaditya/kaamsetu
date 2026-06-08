"use server";

/** Server actions for Admin job queue. Implemented in Sprint 5. */
export async function admin_jobsAction(): Promise<{ ok: false; message: string }> {
  return {
    ok: false,
    message: "Admin job queue is not implemented yet (Sprint 5).",
  };
}
