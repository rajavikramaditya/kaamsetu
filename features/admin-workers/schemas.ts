import { z } from "zod";

/** Zod schemas for Admin worker approval. Populated in Sprint 2. */
export const admin_workersPlaceholderSchema = z.object({
  module: z.literal("admin-workers"),
});
