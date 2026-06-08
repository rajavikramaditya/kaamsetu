import { z } from "zod";

/** Zod schemas for Activity logs. Populated in Sprint 2. */
export const activity_logsPlaceholderSchema = z.object({
  module: z.literal("activity-logs"),
});
