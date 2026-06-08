import { z } from "zod";

/** Zod schemas for Admin payments. Populated in Sprint 6. */
export const admin_paymentsPlaceholderSchema = z.object({
  module: z.literal("admin-payments"),
});
