import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import {
  ensureWorkerProfile,
  getAuthUserPhone,
  getWorkerProfileByAuthId,
} from "@/server/worker/profile";
import { isProfileComplete } from "@/types/worker";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const origin = requestUrl.origin;

  if (!code) {
    return NextResponse.redirect(`${origin}/worker/login?error=missing_code`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(`${origin}/worker/login?error=auth_callback`);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const authPhone = await getAuthUserPhone(supabase);
    let profile = await getWorkerProfileByAuthId(supabase, user.id);
    if (!profile) {
      profile = await ensureWorkerProfile(supabase, user.id, authPhone);
    }

    const next = isProfileComplete(profile) ? "/worker/dashboard" : "/worker/profile";
    return NextResponse.redirect(`${origin}${next}`);
  }

  return NextResponse.redirect(`${origin}/worker/profile`);
}
