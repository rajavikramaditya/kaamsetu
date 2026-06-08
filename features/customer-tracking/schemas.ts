import { z } from "zod";

/** Zod schemas for Customer job tracking. Populated in Sprint 4. */
export const customer_trackingPlaceholderSchema = z.object({
  module: z.literal("customer-tracking"),
});
