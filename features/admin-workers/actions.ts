"use server";

/** Server actions for Admin worker approval. Implemented in Sprint 2. */
export async function admin_workersAction(): Promise<{ ok: false; message: string }> {
  return {
    ok: false,
    message: "Admin worker approval is not implemented yet (Sprint 2).",
  };
}
