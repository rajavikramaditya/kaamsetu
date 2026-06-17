import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { apiError, apiSuccess } from "@/lib/api/response";
import { AdminAuthError, requireAdminUser } from "@/server/auth/require-admin";
import { listAdminWorkers } from "@/server/admin/workers";
import { adminWorkersQuerySchema } from "@/lib/validation/admin";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    await requireAdminUser(supabase);
    const admin = createAdminClient();

    const { searchParams } = new URL(request.url);
    const parsed = adminWorkersQuerySchema.safeParse({
      status: searchParams.get("status") ?? undefined,
      limit: searchParams.get("limit") ?? undefined,
    });

    if (!parsed.success) {
      return apiError("VALIDATION_ERROR", "Invalid query parameters", 400, {
        issues: parsed.error.flatten(),
      });
    }

    const workers = await listAdminWorkers(admin, parsed.data);
    return apiSuccess({ workers });
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
