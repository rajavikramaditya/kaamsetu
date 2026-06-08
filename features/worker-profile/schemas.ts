import { z } from "zod";

/** Zod schemas for Worker profile. Populated in Sprint 3. */
export const worker_profilePlaceholderSchema = z.object({
  module: z.literal("worker-profile"),
});
