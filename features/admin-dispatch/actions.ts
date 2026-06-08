"use server";

/** Server actions for Admin dispatch. Implemented in Sprint 5. */
export async function admin_dispatchAction(): Promise<{ ok: false; message: string }> {
  return {
    ok: false,
    message: "Admin dispatch is not implemented yet (Sprint 5).",
  };
}
