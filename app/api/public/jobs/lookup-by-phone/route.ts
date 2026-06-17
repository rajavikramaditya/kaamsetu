import { createAdminClient } from "@/lib/supabase/admin";
import { apiError, apiSuccess } from "@/lib/api/response";
import { phoneJobDetailSchema } from "@/lib/validation/customer";
import { lookupJobByPhoneAndRef } from "@/server/public/track-job";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = phoneJobDetailSchema.safeParse(body);
    if (!parsed.success) {
      return apiError("VALIDATION_ERROR", "Invalid lookup details", 400, {
        issues: parsed.error.flatten(),
      });
    }

    const admin = createAdminClient();
    const job = await lookupJobByPhoneAndRef(
      admin,
      parsed.data.phone,
      parsed.data.job_ref,
    );

    if (!job) {
      return apiError("NOT_FOUND", "No matching request found for this mobile number", 404);
    }

    return apiSuccess({ job });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Lookup failed";
    return apiError("INTERNAL_ERROR", message, 500);
  }
}
