import { createClient } from "@/lib/supabase/server";
import { apiError, apiSuccess } from "@/lib/api/response";
import {
  assertWorkerCanEdit,
  ensureWorkerProfile,
  getAuthUserPhone,
  getWorkerDocuments,
  getWorkerProfileByAuthId,
  getWorkerProfileLabels,
} from "@/server/worker/profile";
import { hasRequiredDocuments } from "@/server/worker/documents";
import {
  approvalStatusLabel,
  availabilityLabel,
  canReceiveJobOffers,
  isProfileComplete,
} from "@/types/worker";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return apiError("UNAUTHORIZED", "Login required", 401);
    }

    let profile = await getWorkerProfileByAuthId(supabase, user.id);
    if (!profile) {
      const authPhone = await getAuthUserPhone(supabase);
      profile = await ensureWorkerProfile(supabase, user.id, authPhone);
    }

    const documents = await getWorkerDocuments(supabase, profile.id);
    const docs = hasRequiredDocuments(documents);
    const labels = await getWorkerProfileLabels(supabase, profile);

    return apiSuccess({
      profile: {
        id: profile.id,
        worker_code: profile.worker_code,
        full_name: profile.full_name,
        phone: profile.phone,
        whatsapp_number: profile.whatsapp_number,
        primary_category_id: profile.primary_category_id,
        primary_category_name: labels.primary_category_name,
        locality_id: profile.locality_id,
        locality_name: labels.locality_name,
        years_experience: profile.years_experience ?? 0,
        approval_status: profile.approval_status,
        approval_status_label: approvalStatusLabel(profile.approval_status),
        rejection_reason: profile.rejection_reason,
        is_available: profile.is_available,
        availability_label: availabilityLabel(profile.is_available),
        can_receive_offers: canReceiveJobOffers(profile.approval_status),
        profile_complete: isProfileComplete(profile),
      },
      documents: {
        aadhaar_uploaded: docs.aadhaar,
        pan_uploaded: docs.pan,
        items: documents.map((d) => ({
          id: d.id,
          document_type: d.document_type,
          verification_status: d.verification_status,
          created_at: d.created_at,
        })),
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal error";
    return apiError("INTERNAL_ERROR", message, 500);
  }
}
