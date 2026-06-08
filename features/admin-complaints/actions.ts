"use server";

/** Server actions for Admin complaints. Implemented in Sprint 6. */
export async function admin_complaintsAction(): Promise<{ ok: false; message: string }> {
  return {
    ok: false,
    message: "Admin complaints is not implemented yet (Sprint 6).",
  };
}
