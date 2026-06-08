import { z } from "zod";

/** Zod schemas for Worker dispatch offers. Populated in Sprint 5. */
export const worker_offersPlaceholderSchema = z.object({
  module: z.literal("worker-offers"),
});
