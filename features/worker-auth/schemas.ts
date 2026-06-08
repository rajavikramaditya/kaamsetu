import { z } from "zod";

/** Zod schemas for Worker authentication. Populated in Sprint 3. */
export const worker_authPlaceholderSchema = z.object({
  module: z.literal("worker-auth"),
});
