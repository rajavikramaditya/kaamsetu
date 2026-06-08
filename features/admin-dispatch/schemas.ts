import { z } from "zod";

/** Zod schemas for Admin dispatch. Populated in Sprint 5. */
export const admin_dispatchPlaceholderSchema = z.object({
  module: z.literal("admin-dispatch"),
});
