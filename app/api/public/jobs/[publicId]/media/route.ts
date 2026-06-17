import { createAdminClient } from "@/lib/supabase/admin";
import { apiError, apiSuccess } from "@/lib/api/response";
import { validateJobMediaFile } from "@/lib/validation/customer";
import { uploadJobIssuePhoto } from "@/server/public/job-media";
import { verifyJobAccess } from "@/server/public/track-job";

type RouteContext = { params: Promise<{ publicId: string }> };

export async function POST(request: Request, context: RouteContext) {
  try {
    const { publicId } = await context.params;
    const formData = await request.formData();

    const jobRef = String(formData.get("job_ref") ?? "").trim().toUpperCase();
    const phone = String(formData.get("phone") ?? "").replace(/\D/g, "").slice(-10);
    const trackCode = String(formData.get("track_code") ?? "").trim();
    const file = formData.get("file");

    if (!jobRef || !phone || !trackCode) {
      return apiError("VALIDATION_ERROR", "Job ref, phone, and track code are required", 400);
    }

    if (!(file instanceof File)) {
      return apiError("VALIDATION_ERROR", "Photo file is required", 400);
    }

    try {
      validateJobMediaFile(file);
    } catch {
      return apiError(
        "VALIDATION_ERROR",
        "Photo must be JPEG, PNG, or WebP and under 5 MB",
        400,
      );
    }

    const admin = createAdminClient();
    const access = await verifyJobAccess(admin, publicId, jobRef, phone, trackCode);
    if (!access) {
      return apiError("FORBIDDEN", "Invalid job credentials", 403);
    }

    const mediaId = await uploadJobIssuePhoto(admin, access.job_id, file);

    return apiSuccess({ media_id: mediaId, uploaded_count: 1 });
  } catch (error) {
    if (error instanceof Error && error.message === "PHOTO_LIMIT") {
      return apiError("VALIDATION_ERROR", "Maximum 3 photos per job", 400);
    }
    const message = error instanceof Error ? error.message : "Upload failed";
    return apiError("INTERNAL_ERROR", message, 500);
  }
}
