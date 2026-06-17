import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { isAdminUser } from "@/server/auth/require-admin";
import {
  ensureWorkerProfile,
  getAuthUserPhone,
  getWorkerProfileByAuthId,
} from "@/server/worker/profile";
import { isProfileComplete } from "@/types/worker";

function loginErrorRedirect(
  origin: string,
  next: string | null,
  error: "auth_callback" | "missing_code" = "auth_callback",
): string {
  const query = `error=${error}`;
  if (next?.startsWith("/admin")) {
    return `${origin}/admin/login?${query}`;
  }
  if (next?.startsWith("/worker")) {
    return `${origin}/worker/login?${query}`;
  }
  return `${origin}/worker/login?${query}`;
}

async function resolveWorkerRedirect(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  origin: string,
  next: string | null,
): Promise<string> {
  if (next?.startsWith("/worker")) {
    return `${origin}${next}`;
  }

  const authPhone = await getAuthUserPhone(supabase);
  let profile = await getWorkerProfileByAuthId(supabase, userId);
  if (!profile) {
    profile = await ensureWorkerProfile(supabase, userId, authPhone);
  }

  const path = isProfileComplete(profile) ? "/worker/dashboard" : "/worker/profile";
  return `${origin}${path}`;
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next");
  const origin = requestUrl.origin;

  if (!code) {
    return NextResponse.redirect(loginErrorRedirect(origin, next, "missing_code"));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(loginErrorRedirect(origin, next, "auth_callback"));
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(loginErrorRedirect(origin, next, "auth_callback"));
  }

  if (next?.startsWith("/admin")) {
    return NextResponse.redirect(`${origin}/admin/dashboard`);
  }

  if (isAdminUser(user) && !next?.startsWith("/worker")) {
    return NextResponse.redirect(`${origin}/admin/dashboard`);
  }

  const workerRedirect = await resolveWorkerRedirect(supabase, user.id, origin, next);
  return NextResponse.redirect(workerRedirect);
}
