"use server";

/** Server actions for Customer job tracking. Implemented in Sprint 4. */
export async function customer_trackingAction(): Promise<{ ok: false; message: string }> {
  return {
    ok: false,
    message: "Customer job tracking is not implemented yet (Sprint 4).",
  };
}
