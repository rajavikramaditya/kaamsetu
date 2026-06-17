import { z } from "zod";

import { phoneSchema } from "@/lib/validation/worker";

export const inviteCodeSchema = z
  .string()
  .trim()
  .min(4)
  .max(12)
  .transform((v) => v.toUpperCase());

export const validateInviteSchema = z.object({
  invite_code: inviteCodeSchema,
});

export const preferredTimeSlotSchema = z.enum([
  "morning",
  "afternoon",
  "evening",
  "anytime",
]);

export const paymentPreferenceSchema = z.enum(["cash", "upi", "either"]);

export const createRequestSchema = z.object({
  invite_code: inviteCodeSchema,
  full_name: z.string().trim().min(2).max(80),
  phone: phoneSchema,
  alternate_phone: phoneSchema.optional(),
  locality_id: z.string().uuid(),
  address_text: z.string().trim().min(10).max(250),
  landmark: z.string().trim().max(120).optional(),
  service_category_id: z.string().uuid(),
  description: z.string().trim().min(20).max(500),
  preferred_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  preferred_time_slot: preferredTimeSlotSchema,
  payment_preference: paymentPreferenceSchema.default("either"),
  workers_needed: z.number().int().min(1).max(20).optional(),
  shift_type: z.enum(["half_day", "full_day"]).optional(),
});

export const trackJobSchema = z.object({
  job_ref: z.string().trim().toUpperCase().regex(/^KS-\d{6}$/),
  phone: phoneSchema,
  track_code: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "Track code must be 6 digits"),
});

const MAX_FILE_BYTES = 5 * 1024 * 1024;
const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp"]);

export function validateJobMediaFile(file: File) {
  if (!ALLOWED_MIME.has(file.type)) {
    throw new Error("INVALID_MIME");
  }
  if (file.size <= 0 || file.size > MAX_FILE_BYTES) {
    throw new Error("INVALID_SIZE");
  }
}
