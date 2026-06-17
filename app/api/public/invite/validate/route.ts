import { createAdminClient } from "@/lib/supabase/admin";
import { apiError, apiSuccess } from "@/lib/api/response";
import { validateInviteSchema } from "@/lib/validation/customer";
import { validateInviteCode } from "@/server/public/invite";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = validateInviteSchema.safeParse(body);
    if (!parsed.success) {
      return apiError("VALIDATION_ERROR", "Invalid invite code format", 400, {
        issues: parsed.error.flatten(),
      });
    }

    const admin = createAdminClient();
    const result = await validateInviteCode(admin, parsed.data.invite_code);

    if (!result.valid) {
      return apiError("FORBIDDEN", result.reason, 403);
    }

    return apiSuccess({
      valid: true,
      invite_code_id: result.invite.id,
      code_type: result.invite.code_type,
      locality_id: result.invite.locality_id,
      expires_at: result.invite.expires_at,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Validation failed";
    return apiError("INTERNAL_ERROR", message, 500);
  }
}
