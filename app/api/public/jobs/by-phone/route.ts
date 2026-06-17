import { createAdminClient } from "@/lib/supabase/admin";
import { apiError, apiSuccess } from "@/lib/api/response";
import { phoneJobsLookupSchema } from "@/lib/validation/customer";
import { listJobsByPhone } from "@/server/public/track-job";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = phoneJobsLookupSchema.safeParse(body);
    if (!parsed.success) {
      return apiError("VALIDATION_ERROR", "Enter a valid 10-digit mobile number", 400, {
        issues: parsed.error.flatten(),
      });
    }

    const admin = createAdminClient();
    const jobs = await listJobsByPhone(admin, parsed.data.phone);

    return apiSuccess({ jobs });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Lookup failed";
    return apiError("INTERNAL_ERROR", message, 500);
  }
}
