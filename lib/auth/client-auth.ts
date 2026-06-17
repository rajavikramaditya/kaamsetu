import { createClient } from "@/lib/supabase/client";

type LoginPath = "/admin/login" | "/worker/login";

export async function clientSignOut(loginPath: LoginPath): Promise<void> {
  const supabase = createClient();
  await supabase.auth.signOut({ scope: "global" });
  window.location.assign(loginPath);
}

export function authCallbackErrorMessage(errorCode: string | null): string | null {
  if (errorCode === "auth_callback") {
    return "Sign-in link expired or invalid. Request a new OTP and try again.";
  }
  if (errorCode === "missing_code") {
    return "Sign-in link was incomplete. Request a new OTP and try again.";
  }
  return null;
}

export function authCallbackRedirectTo(path: "/admin/dashboard" | "/worker/dashboard"): string {
  const next = encodeURIComponent(path);
  return `${window.location.origin}/auth/callback?next=${next}`;
}
