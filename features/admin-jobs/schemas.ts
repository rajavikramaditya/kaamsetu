import { z } from "zod";

/** Zod schemas for Admin job queue. Populated in Sprint 5. */
export const admin_jobsPlaceholderSchema = z.object({
  module: z.literal("admin-jobs"),
});
