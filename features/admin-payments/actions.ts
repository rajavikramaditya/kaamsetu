"use server";

/** Server actions for Admin payments. Implemented in Sprint 6. */
export async function admin_paymentsAction(): Promise<{ ok: false; message: string }> {
  return {
    ok: false,
    message: "Admin payments is not implemented yet (Sprint 6).",
  };
}
