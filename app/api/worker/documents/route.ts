import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { apiError, apiSuccess } from "@/lib/api/response";
import {
  validateDocumentFile,
  workerDocumentTypeSchema,
} from "@/lib/validation/worker";
import {
  assertWorkerCanEdit,
  getWorkerProfileByAuthId,
} from "@/server/worker/profile";
import { uploadWorkerDocument } from "@/server/worker/documents";
import type { WorkerDocumentType } from "@/types/worker";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return apiError("UNAUTHORIZED", "Login required", 401);

    const profile = await getWorkerProfileByAuthId(supabase, user.id);
    if (!profile) return apiError("NOT_FOUND", "Worker profile not found", 404);

    assertWorkerCanEdit(profile);

    if (!["draft", "pending", "under_review", "rejected", "invited"].includes(profile.approval_status)) {
      return apiError(
        "FORBIDDEN",
        "Documents cannot be changed after approval",
        403,
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");
    const documentTypeRaw = formData.get("document_type");

    if (!(file instanceof File)) {
      return apiError("VALIDATION_ERROR", "File is required", 400);
    }

    const typeParsed = workerDocumentTypeSchema.safeParse(documentTypeRaw);
    if (!typeParsed.success) {
      return apiError("VALIDATION_ERROR", "Invalid document type", 400);
    }

    try {
      validateDocumentFile(file);
    } catch {
      return apiError(
        "VALIDATION_ERROR",
        "File must be JPEG/PNG/WebP and under 5MB",
        400,
      );
    }

    const admin = createAdminClient();
    const result = await uploadWorkerDocument(
      admin,
      profile.id,
      typeParsed.data as WorkerDocumentType,
      file,
    );

    return apiSuccess({
      document_id: result.document_id,
      storage_path: result.storage_path,
      document_type: typeParsed.data,
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
    const message = error instanceof Error ? error.message : "Upload failed";
    return apiError("INTERNAL_ERROR", message, 500);
  }
}
