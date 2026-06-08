import { z } from "zod";

/** Zod schemas for Admin complaints. Populated in Sprint 6. */
export const admin_complaintsPlaceholderSchema = z.object({
  module: z.literal("admin-complaints"),
});
