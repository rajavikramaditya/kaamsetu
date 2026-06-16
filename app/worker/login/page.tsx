"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { PhoneOtpLogin } from "@/components/worker/PhoneOtpLogin";
import { WorkerShell } from "@/components/worker/WorkerShell";
import { createClient } from "@/lib/supabase/client";

type LoginMethod = "email" | "phone";

export default function WorkerLoginPage() {
  const router = useRouter();
  const [method, setMethod] = useState<LoginMethod>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function afterAuthSuccess() {
    const meRes = await fetch("/api/worker/me");
    const me = await meRes.json();
    if (!me.success) throw new Error(me.error?.message ?? "Session failed");

    if (me.profile.profile_complete) {
      router.push("/worker/dashboard");
    } else {
      router.push("/worker/profile");
    }
    router.refresh();
  }

  async function sendEmailOtp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const trimmed = email.trim().toLowerCase();
      if (!trimmed.includes("@")) throw new Error("Enter a valid email address");
      const supabase = createClient();
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: trimmed,
        options: { shouldCreateUser: true },
      });
      if (otpError) throw otpError;
      setStep("otp");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send OTP");
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
    <WorkerShell title="Login">
      <p className="text-sm text-stone-600">
        Login with Email OTP now. Phone OTP will be enabled later when SMS provider is
        configured.
      </p>

      <div className="flex rounded-full border border-stone-200 bg-white p-1">
        <button
          type="button"
          onClick={() => {
            setMethod("email");
            setStep("email");
            setError(null);
          }}
          className={`flex-1 rounded-full px-3 py-2 text-sm font-medium ${
            method === "email"
              ? "bg-teal-700 text-white"
              : "text-stone-600 hover:text-stone-900"
          }`}
        >
          Email OTP
        </button>
        <button
          type="button"
          onClick={() => {
            setMethod("phone");
            setError(null);
          }}
          className={`flex-1 rounded-full px-3 py-2 text-sm font-medium ${
            method === "phone"
              ? "bg-teal-700 text-white"
              : "text-stone-600 hover:text-stone-900"
          }`}
        >
          Phone OTP
        </button>
      </div>

      {method === "email" ? (
        step === "email" ? (
          <form onSubmit={sendEmailOtp} className="flex flex-col gap-4">
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium text-stone-800">Email address</span>
              <input
                type="email"
                inputMode="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="rounded-xl border border-stone-300 bg-white px-4 py-3"
                required
              />
            </label>
            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-teal-700 px-4 py-3 font-medium text-white disabled:opacity-60"
            >
              {loading ? "Sending…" : "Send Email OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={verifyEmailOtp} className="flex flex-col gap-4">
            <p className="text-sm text-stone-600">OTP sent to {email.trim().toLowerCase()}</p>
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
              className="rounded-full bg-teal-700 px-4 py-3 font-medium text-white disabled:opacity-60"
            >
              {loading ? "Verifying…" : "Verify & Continue"}
            </button>
            <button
              type="button"
              className="text-sm text-teal-700 underline"
              onClick={() => setStep("email")}
            >
              Change email
            </button>
          </form>
        )
      ) : (
        <PhoneOtpLogin onSuccess={afterAuthSuccess} />
      )}

      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      )}
    </WorkerShell>
  );
}
