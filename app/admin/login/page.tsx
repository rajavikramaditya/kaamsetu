"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { AdminShell } from "@/components/admin/AdminShell";
import { authCallbackErrorMessage, authCallbackRedirectTo, clientSignOut } from "@/lib/auth/client-auth";
import { createClient } from "@/lib/supabase/client";

function formatAuthError(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("rate limit")) {
    return "Email limit reached — wait about an hour or use the last OTP email you received.";
  }
  return message;
}

function AdminLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackError = authCallbackErrorMessage(searchParams.get("error"));

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [loading, setLoading] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [error, setError] = useState<string | null>(callbackError);
  const [workerSessionEmail, setWorkerSessionEmail] = useState<string | null>(null);

  useEffect(() => {
    async function checkSession() {
      const [adminRes, workerRes] = await Promise.all([
        fetch("/api/admin/me"),
        fetch("/api/worker/me"),
      ]);
      const admin = await adminRes.json();
      const worker = await workerRes.json();

      if (admin.success) {
        router.replace("/admin/dashboard");
        return;
      }

      if (worker.success) {
        setWorkerSessionEmail(worker.profile?.phone ? `worker (${worker.profile.worker_code})` : "worker");
      }
    }

    checkSession().catch(() => undefined);
  }, [router]);

  async function afterAuthSuccess() {
    const meRes = await fetch("/api/admin/me");
    const me = await meRes.json();
    if (!me.success) {
      if (me.error?.code === "FORBIDDEN") {
        throw new Error("This account is not an admin. Set app_metadata.role = admin in Supabase.");
      }
      throw new Error(me.error?.message ?? "Admin session failed");
    }
    router.push("/admin/dashboard");
    router.refresh();
  }

  async function handleSignOut() {
    setSigningOut(true);
    setError(null);
    try {
      await clientSignOut("/admin/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign out failed");
      setSigningOut(false);
    }
  }

  async function sendEmailOtp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const trimmed = email.trim().toLowerCase();
      if (!trimmed.includes("@")) throw new Error("Enter a valid email address");
      const supabase = createClient();
      const redirectTo = authCallbackRedirectTo("/admin/dashboard");
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: trimmed,
        options: {
          shouldCreateUser: false,
          emailRedirectTo: redirectTo,
        },
      });
      if (otpError) throw otpError;
      setStep("otp");
    } catch (err) {
      setError(formatAuthError(err instanceof Error ? err.message : "Failed to send OTP"));
    } finally {
      setLoading(false);
    }
  }

  async function verifyEmailOtp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const trimmed = email.trim().toLowerCase();
      const supabase = createClient();
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email: trimmed,
        token: otp.trim(),
        type: "email",
      });
      if (verifyError) throw verifyError;
      await afterAuthSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid OTP");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminShell title="Admin Login">
      <p className="text-sm text-stone-600">
        Founder login with Email OTP. Your Supabase user must have{" "}
        <code className="text-xs">app_metadata.role = admin</code>.
      </p>

      {workerSessionEmail && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          <p className="font-medium">Signed in as a worker account</p>
          <p className="mt-1 text-amber-900">
            Admin and worker sessions cannot be mixed. Sign out before logging in as admin.
          </p>
          <button
            type="button"
            disabled={signingOut}
            onClick={() => void handleSignOut()}
            className="mt-3 rounded-full bg-amber-800 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {signingOut ? "Signing out…" : "Sign out worker session"}
          </button>
        </div>
      )}

      {step === "email" ? (
        <form onSubmit={sendEmailOtp} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-stone-800">Email address</span>
            <input
              type="email"
              inputMode="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="founder@example.com"
              className="rounded-xl border border-stone-300 bg-white px-4 py-3"
              required
            />
          </label>
          <button
            type="submit"
            disabled={loading || Boolean(workerSessionEmail)}
            className="rounded-full bg-amber-800 px-4 py-3 font-medium text-white disabled:opacity-60"
          >
            {loading ? "Sending…" : "Send Email OTP"}
          </button>
        </form>
      ) : (
        <form onSubmit={verifyEmailOtp} className="flex flex-col gap-4">
          <p className="text-sm text-stone-600">
            Check {email.trim().toLowerCase()} — click the sign-in link or enter the 6-digit
            code.
          </p>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-stone-800">Enter OTP</span>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="6-digit code"
              className="rounded-xl border border-stone-300 bg-white px-4 py-3"
              required
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-amber-800 px-4 py-3 font-medium text-white disabled:opacity-60"
          >
            {loading ? "Verifying…" : "Verify & Continue"}
          </button>
          <button
            type="button"
            className="text-sm text-amber-800 underline"
            onClick={() => setStep("email")}
          >
            Change email
          </button>
        </form>
      )}

      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      )}
    </AdminShell>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<AdminShell title="Admin Login"><p className="text-sm text-stone-600">Loading…</p></AdminShell>}>
      <AdminLoginContent />
    </Suspense>
  );
}
