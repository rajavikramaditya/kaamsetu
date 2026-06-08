"use server";

/** Server actions for Public request flow. Implemented in Sprint 4. */
export async function public_requestAction(): Promise<{ ok: false; message: string }> {
  return {
    ok: false,
    message: "Public request flow is not implemented yet (Sprint 4).",
  };
}
