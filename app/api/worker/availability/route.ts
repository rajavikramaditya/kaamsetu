import { createClient } from "@/lib/supabase/server";
import { apiError, apiSuccess } from "@/lib/api/response";
import { workerAvailabilitySchema } from "@/lib/validation/worker";
import {
  assertWorkerCanEdit,
  assertWorkerCanToggleAvailability,
  getWorkerProfileByAuthId,
} from "@/server/worker/profile";
import { availabilityLabel } from "@/types/worker";

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return apiError("UNAUTHORIZED", "Login required", 401);

    const profile = await getWorkerProfileByAuthId(supabase, user.id);
    if (!profile) return apiError("NOT_FOUND", "Worker profile not found", 404);

    assertWorkerCanEdit(profile);
    assertWorkerCanToggleAvailability(profile);

    const body = await request.json();
    const parsed = workerAvailabilitySchema.safeParse(body);
    if (!parsed.success) {
      return apiError("VALIDATION_ERROR", "Invalid availability", 400);
    }

    const { data, error } = await supabase
      .from("worker_profiles")
      .update({ is_available: parsed.data.is_available })
      .eq("id", profile.id)
      .select("is_available")
      .single();

    if (error) return apiError("INTERNAL_ERROR", error.message, 500);

    return apiSuccess({
      is_available: data.is_available,
      availability_label: availabilityLabel(data.is_available),
    });
  } catch (error) {
    if (error instanceof Error && error.message === "NOT_APPROVED") {
      return apiError(
        "FORBIDDEN",
        "Availability can only be changed after approval",
        403,
      );
    }
    const message = error instanceof Error ? error.message : "Internal error";
    return apiError("INTERNAL_ERROR", message, 500);
  }
}
