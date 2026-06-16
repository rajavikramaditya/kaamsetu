import { createClient } from "@/lib/supabase/server";
import { apiError, apiSuccess } from "@/lib/api/response";
import { workerProfileUpdateSchema } from "@/lib/validation/worker";
import {
  assertWorkerCanEdit,
  getWorkerDocuments,
  getWorkerProfileByAuthId,
} from "@/server/worker/profile";
import { hasRequiredDocuments } from "@/server/worker/documents";
import { approvalStatusLabel, isProfileComplete } from "@/types/worker";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return apiError("UNAUTHORIZED", "Login required", 401);

  const profile = await getWorkerProfileByAuthId(supabase, user.id);
  if (!profile) return apiError("NOT_FOUND", "Worker profile not found", 404);

  return apiSuccess({ profile });
}

export async function PUT(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return apiError("UNAUTHORIZED", "Login required", 401);

    let profile = await getWorkerProfileByAuthId(supabase, user.id);
    if (!profile) {
      return apiError("NOT_FOUND", "Worker profile not found", 404);
    }

    assertWorkerCanEdit(profile);

    const body = await request.json();
    const parsed = workerProfileUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return apiError("VALIDATION_ERROR", "Invalid profile data", 400, {
        issues: parsed.error.flatten(),
      });
    }

    const { submit_for_review, ...fields } = parsed.data;

    let approval_status = profile.approval_status;
    if (submit_for_review) {
      if (profile.approval_status === "approved") {
        return apiError(
          "FORBIDDEN",
          "Approved workers cannot resubmit for review",
          403,
        );
      }
      const documents = await getWorkerDocuments(supabase, profile.id);
      const docs = hasRequiredDocuments(documents);
      if (!docs.aadhaar) {
        return apiError(
          "VALIDATION_ERROR",
          "Aadhaar image is required before submission",
          400,
        );
      }
      approval_status = "pending";
    } else if (profile.approval_status === "invited") {
      approval_status = "draft";
    }

    const { data, error } = await supabase
      .from("worker_profiles")
      .update({
        full_name: fields.full_name,
        whatsapp_number: fields.whatsapp_number,
        primary_category_id: fields.primary_category_id,
        locality_id: fields.locality_id,
        years_experience: fields.years_experience,
        phone: fields.phone,
        approval_status,
      })
      .eq("id", profile.id)
      .select("*")
      .single();

    if (error) {
      return apiError("INTERNAL_ERROR", error.message, 500);
    }

    return apiSuccess({
      profile: {
        ...data,
        approval_status_label: approvalStatusLabel(data.approval_status),
        profile_complete: isProfileComplete(data),
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "ACCOUNT_SUSPENDED") {
        return apiError("FORBIDDEN", "Account suspended", 403);
      }
      if (error.message === "ACCOUNT_BANNED") {
        return apiError("FORBIDDEN", "Account banned", 403);
      }
    }
    const message = error instanceof Error ? error.message : "Internal error";
    return apiError("INTERNAL_ERROR", message, 500);
  }
}
