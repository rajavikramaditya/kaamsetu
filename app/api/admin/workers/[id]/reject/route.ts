import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { apiError, apiSuccess } from "@/lib/api/response";
import { AdminAuthError, requireAdminUser } from "@/server/auth/require-admin";
import { rejectWorker } from "@/server/admin/workers";
import { adminWorkerActionSchema } from "@/lib/validation/admin";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: Request, context: RouteContext) {
  try {
    const supabase = await createClient();
    await requireAdminUser(supabase);
    const admin = createAdminClient();
    const { id } = await context.params;

    const body = await request.json().catch(() => ({}));
    const parsed = adminWorkerActionSchema.safeParse(body);
    if (!parsed.success) {
      return apiError("VALIDATION_ERROR", "Invalid request body", 400, {
        issues: parsed.error.flatten(),
      });
    }

    const result = await rejectWorker(admin, id, parsed.data.rejection_reason);
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
    const message = error instanceof Error ? error.message : "Internal error";
    return apiError("INTERNAL_ERROR", message, 500);
  }
}
