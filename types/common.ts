import type { ActorType, ErrorCode } from "./enums";

export type UUID = string;

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedMeta {
  page: number;
  limit: number;
  total: number;
}

export interface ActivityLogPayload {
  actor_type: ActorType;
  actor_user_id?: UUID | null;
  actor_label?: string | null;
  entity_type: string;
  entity_id?: UUID | null;
  action: string;
  source?: "web" | "worker" | "admin" | "system";
  metadata?: Record<string, unknown>;
}

export interface ApiErrorBody {
  code: ErrorCode;
  message: string;
  field_errors?: Record<string, string[]>;
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  error: ApiErrorBody;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
