import { jsonOk } from "@/server/http/api-response";

export async function GET() {
  return jsonOk({
    status: "ok",
    service: "kaamsetu",
    env: process.env.APP_ENV ?? "development",
    timestamp: new Date().toISOString(),
  });
}
