import { apiSuccess } from "@/server/api/response";
import { getAppEnv } from "@/server/db/env";

export async function GET() {
  return apiSuccess({
    status: "ok",
    service: "kaamsetu",
    environment: getAppEnv(),
    timestamp: new Date().toISOString(),
  });
}
