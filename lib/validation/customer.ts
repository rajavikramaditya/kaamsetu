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
  service_category_id: z.string().uuid(),
  locality_id: z.string().uuid(),
  alternate_phone: phoneSchema.optional(),
  address_text: z.string().trim().max(250).optional().default(""),
  landmark: z.string().trim().max(120).optional(),
  description: z.string().trim().max(500).optional().default(""),
  preferred_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  preferred_time_slot: preferredTimeSlotSchema.default("anytime"),
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

const MAX_PHOTO_BYTES = 5 * 1024 * 1024;
const MAX_VOICE_BYTES = 5 * 1024 * 1024;
const ALLOWED_PHOTO_MIME = new Set(["image/jpeg", "image/png", "image/webp"]);
const VOICE_EXTENSIONS = new Set(["webm", "ogg", "m4a", "mp4", "mp3", "aac"]);

export const MAX_ISSUE_PHOTOS = 5;

export function validateJobMediaFile(file: File) {
  if (!ALLOWED_PHOTO_MIME.has(file.type)) {
    throw new Error("INVALID_MIME");
  }
  if (file.size <= 0 || file.size > MAX_PHOTO_BYTES) {
    throw new Error("INVALID_SIZE");
  }
}

function normalizeVoiceMime(file: File): string {
  const raw = (file.type || "").split(";")[0].trim().toLowerCase();
  if (raw.startsWith("audio/")) return raw;
  const ext = file.name.split(".").pop()?.toLowerCase();
  if (ext === "webm") return "audio/webm";
  if (ext === "ogg") return "audio/ogg";
  if (ext === "m4a" || ext === "mp4") return "audio/mp4";
  if (ext === "mp3") return "audio/mpeg";
  return raw;
}

export function validateJobVoiceFile(file: File) {
  const mime = normalizeVoiceMime(file);
  const ext = file.name.split(".").pop()?.toLowerCase();
  const allowed =
    mime.startsWith("audio/") ||
    (mime === "" && ext !== undefined && VOICE_EXTENSIONS.has(ext));

  if (!allowed) {
    throw new Error("INVALID_MIME");
  }
  if (file.size <= 0 || file.size > MAX_VOICE_BYTES) {
    throw new Error("INVALID_SIZE");
  }
}

export function voiceFileContentType(file: File): string {
  const mime = normalizeVoiceMime(file);
  if (mime.startsWith("audio/")) return mime;
  return "audio/webm";
}
