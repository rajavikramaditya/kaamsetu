import { z } from "zod";

/** Zod schemas for Admin dashboard. Populated in Sprint 2. */
export const admin_dashboardPlaceholderSchema = z.object({
  module: z.literal("admin-dashboard"),
});
