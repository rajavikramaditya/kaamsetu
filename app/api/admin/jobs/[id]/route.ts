import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { apiError, apiSuccess } from "@/lib/api/response";
import { AdminAuthError, requireAdminUser } from "@/server/auth/require-admin";
import { getAdminJobDetail } from "@/server/admin/jobs";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const supabase = await createClient();
    await requireAdminUser(supabase);
    const admin = createAdminClient();
    const { id } = await context.params;

    const job = await getAdminJobDetail(admin, id);
    if (!job) {
      return apiError("NOT_FOUND", "Job not found", 404);
    }

    return apiSuccess({ job });
  } catch (error) {
    if (error instanceof AdminAuthError) {
      if (error.code === "UNAUTHORIZED") {
        return apiError("UNAUTHORIZED", "Admin login required", 401);
      }
      return apiError("FORBIDDEN", "Admin access only", 403);
    }
    const message = error instanceof Error ? error.message : "Internal error";
    return apiError("INTERNAL_ERROR", message, 500);
  }
}
