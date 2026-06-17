import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { apiError, apiSuccess } from "@/lib/api/response";
import { AdminAuthError, requireAdminUser } from "@/server/auth/require-admin";
import { listAdminJobs } from "@/server/admin/jobs";
import { adminJobsQuerySchema } from "@/lib/validation/admin";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    await requireAdminUser(supabase);
    const admin = createAdminClient();

    const { searchParams } = new URL(request.url);
    const parsed = adminJobsQuerySchema.safeParse({
      status: searchParams.get("status") ?? undefined,
      limit: searchParams.get("limit") ?? undefined,
    });

    if (!parsed.success) {
      return apiError("VALIDATION_ERROR", "Invalid query parameters", 400, {
        issues: parsed.error.flatten(),
      });
    }

    const jobs = await listAdminJobs(admin, parsed.data);
    return apiSuccess({ jobs });
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
