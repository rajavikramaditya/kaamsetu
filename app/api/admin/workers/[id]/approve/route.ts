import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { apiError, apiSuccess } from "@/lib/api/response";
import { AdminAuthError, requireAdminUser } from "@/server/auth/require-admin";
import { approveWorker } from "@/server/admin/workers";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(_request: Request, context: RouteContext) {
  try {
    const supabase = await createClient();
    await requireAdminUser(supabase);
    const admin = createAdminClient();
    const { id } = await context.params;

    const result = await approveWorker(admin, id);
    if (!result) {
      return apiError("NOT_FOUND", "Worker not found", 404);
    }

    return apiSuccess({ worker: result });
  } catch (error) {
    if (error instanceof AdminAuthError) {
      if (error.code === "UNAUTHORIZED") {
        return apiError("UNAUTHORIZED", "Admin login required", 401);
      }
      return apiError("FORBIDDEN", "Admin access only", 403);
    }
    if (error instanceof Error && error.message === "INVALID_STATE") {
      return apiError("VALIDATION_ERROR", "Worker cannot be approved in current state", 400);
    }
    const message = error instanceof Error ? error.message : "Internal error";
    return apiError("INTERNAL_ERROR", message, 500);
  }
}
