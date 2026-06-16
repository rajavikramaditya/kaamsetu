import { NextResponse } from "next/server";

export function apiSuccess<T extends Record<string, unknown>>(
  data: T,
  status = 200,
) {
  return NextResponse.json({ success: true, ...data }, { status });
}

export function apiError(
  code: string,
  message: string,
  status: number,
  details?: Record<string, unknown>,
) {
  return NextResponse.json(
    {
      success: false,
      error: { code, message, ...(details ? { details } : {}) },
    },
    { status },
  );
}
