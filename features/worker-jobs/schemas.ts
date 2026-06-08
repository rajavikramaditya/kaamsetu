import { z } from "zod";

/** Zod schemas for Worker job lifecycle. Populated in Sprint 6. */
export const worker_jobsPlaceholderSchema = z.object({
  module: z.literal("worker-jobs"),
});
