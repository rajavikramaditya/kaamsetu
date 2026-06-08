import { z } from "zod";

/** Zod schemas for Admin settings. Populated in Sprint 2. */
export const admin_settingsPlaceholderSchema = z.object({
  module: z.literal("admin-settings"),
});
