import { NextResponse } from "next/server";
import type { ApiErrorResponse, ApiSuccessResponse } from "@/types/common";
import type { ErrorCode } from "@/types/enums";
import { fail, ok } from "@/lib/utils/result";

const STATUS_BY_CODE: Record<ErrorCode, number> = {
  VALIDATION_ERROR: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  RATE_LIMITED: 429,
  UPLOAD_ERROR: 400,
  INVALID_STATE_TRANSITION: 409,
  INTERNAL_ERROR: 500,
};

export function jsonOk<T>(data: T, status = 200): NextResponse<ApiSuccessResponse<T>> {
  return NextResponse.json(ok(data), { status });
}

export function jsonError(
  code: ErrorCode,
  message: string,
  field_errors?: Record<string, string[]>,
): NextResponse<ApiErrorResponse> {
  return NextResponse.json(fail(code, message, field_errors), {
    status: STATUS_BY_CODE[code] ?? 500,
  });
}

export function notImplemented(feature: string): NextResponse<ApiErrorResponse> {
  return jsonError(
    "INTERNAL_ERROR",
    `${feature} is not implemented yet. Sprint feature work pending.`,
  );
}
