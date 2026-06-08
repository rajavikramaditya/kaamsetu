import { z } from "zod";

/** Zod schemas for Public request flow. Populated in Sprint 4. */
export const public_requestPlaceholderSchema = z.object({
  module: z.literal("public-request"),
});
