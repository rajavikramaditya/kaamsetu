"use server";

/** Server actions for Admin settings. Implemented in Sprint 2. */
export async function admin_settingsAction(): Promise<{ ok: false; message: string }> {
  return {
    ok: false,
    message: "Admin settings is not implemented yet (Sprint 2).",
  };
}
