import { NextResponse } from "next/server";
import type { ApiErrorBody, ApiResponse } from "@/types/common";
import type { ErrorCode } from "@/types/enums";

export function apiSuccess<T>(data: T, status = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json({ success: true, data }, { status });
}

export function apiError(
  code: ErrorCode,
  message: string,
  status: number,
  fieldErrors?: ApiErrorBody["field_errors"],
): NextResponse<ApiResponse<never>> {
  return NextResponse.json(
    {
      success: false,
      error: {
        code,
        message,
        ...(fieldErrors ? { field_errors: fieldErrors } : {}),
      },
    },
    { status },
  );
}

export function apiNotImplemented(feature: string): NextResponse<ApiResponse<never>> {
  return apiError(
    "INTERNAL_ERROR",
    `${feature} is not implemented yet. See KS-013 sprint plan.`,
    501,
  );
}

export function apiValidationError(
  message: string,
  fieldErrors?: ApiErrorBody["field_errors"],
): NextResponse<ApiResponse<never>> {
  return apiError("VALIDATION_ERROR", message, 400, fieldErrors);
}

export function apiUnauthorized(message = "Unauthorized"): NextResponse<ApiResponse<never>> {
  return apiError("UNAUTHORIZED", message, 401);
}

export function apiForbidden(message = "Forbidden"): NextResponse<ApiResponse<never>> {
  return apiError("FORBIDDEN", message, 403);
}

export function apiNotFound(message = "Not found"): NextResponse<ApiResponse<never>> {
  return apiError("NOT_FOUND", message, 404);
}
