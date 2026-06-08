import type { ErrorCode } from "./enums";

export type ApiSuccessResponse<T> = {
  success: true;
  data: T;
};

export type ApiFieldErrors = Record<string, string[]>;

export type ApiErrorBody = {
  code: ErrorCode;
  message: string;
  field_errors?: ApiFieldErrors;
};

export type ApiErrorResponse = {
  success: false;
  error: ApiErrorBody;
};

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export type PaginationMeta = {
  page: number;
  page_size: number;
  total: number;
};

export type Paginated<T> = {
  items: T[];
  meta: PaginationMeta;
};
