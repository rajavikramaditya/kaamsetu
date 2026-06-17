import { createAdminClient } from "@/lib/supabase/admin";
import { apiError, apiSuccess } from "@/lib/api/response";
import { createRequestSchema } from "@/lib/validation/customer";
import { createCustomerRequest } from "@/server/public/create-request";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = createRequestSchema.safeParse(body);
    if (!parsed.success) {
      return apiError("VALIDATION_ERROR", "Invalid request data", 400, {
        issues: parsed.error.flatten(),
      });
    }

    const admin = createAdminClient();
    const result = await createCustomerRequest(admin, parsed.data);

    return apiSuccess({
      job_id: result.job_id,
      public_id: result.public_id,
      job_ref: result.job_ref,
      track_code: result.track_code,
      booking_status: result.booking_status,
      next_step: "photo_upload",
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.startsWith("INVITE_INVALID:")) {
        return apiError(
          "FORBIDDEN",
          error.message.replace("INVITE_INVALID:", ""),
          403,
        );
      }
      if (error.message === "CATEGORY_INACTIVE") {
        return apiError("VALIDATION_ERROR", "Selected service is unavailable", 400);
      }
      if (error.message === "LOCALITY_NOT_SERVICEABLE") {
        return apiError("VALIDATION_ERROR", "Selected locality is not serviceable", 400);
      }
      if (error.message === "SHIFT_FIELDS_REQUIRED") {
        return apiError(
          "VALIDATION_ERROR",
          "Workers needed and shift type are required for this service",
          400,
        );
      }
      if (error.message === "DUPLICATE_REQUEST") {
        return apiError(
          "CONFLICT",
          "A similar request was submitted recently. Please wait or track your existing job.",
          409,
        );
      }
    }
    const message = error instanceof Error ? error.message : "Request failed";
    return apiError("INTERNAL_ERROR", message, 500);
  }
}
