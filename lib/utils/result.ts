import type { ApiErrorBody, ApiErrorResponse, ApiSuccessResponse } from "@/types/common";
import type { ErrorCode } from "@/types/enums";

export function ok<T>(data: T): ApiSuccessResponse<T> {
  return { success: true, data };
}

export function fail(
  code: ErrorCode,
  message: string,
  field_errors?: Record<string, string[]>,
): ApiErrorResponse {
  const error: ApiErrorBody = { code, message };
  if (field_errors) error.field_errors = field_errors;
  return { success: false, error };
}

export function isSuccess<T>(
  response: ApiSuccessResponse<T> | ApiErrorResponse,
): response is ApiSuccessResponse<T> {
  return response.success === true;
}
