import { createAdminClient } from "@/lib/supabase/admin";
import { apiError, apiSuccess } from "@/lib/api/response";
import { trackJobSchema } from "@/lib/validation/customer";
import { lookupJobForCustomer } from "@/server/public/track-job";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = trackJobSchema.safeParse(body);
    if (!parsed.success) {
      return apiError("VALIDATION_ERROR", "Invalid lookup details", 400, {
        issues: parsed.error.flatten(),
      });
    }

    const admin = createAdminClient();
    const job = await lookupJobForCustomer(
      admin,
      parsed.data.job_ref,
      parsed.data.phone,
      parsed.data.track_code,
    );

    if (!job) {
      return apiError(
        "NOT_FOUND",
        "No job found with these details. Check job ref, phone, and track code.",
        404,
      );
    }

    return apiSuccess({ job });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Lookup failed";
    return apiError("INTERNAL_ERROR", message, 500);
  }
}
