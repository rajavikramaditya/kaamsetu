"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { WorkerShell } from "@/components/worker/WorkerShell";
import { createClient } from "@/lib/supabase/client";
import { toE164IndianPhone } from "@/types/worker";

export default function WorkerLoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function sendOtp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const digits = phone.replace(/\D/g, "");
      if (digits.length !== 10) throw new Error("Enter a valid 10-digit mobile number");
      const supabase = createClient();
      const { error: otpError } = await supabase.auth.signInWithOtp({
        phone: toE164IndianPhone(digits),
      });
      if (otpError) throw otpError;
      setStep("otp");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const digits = phone.replace(/\D/g, "");
      const supabase = createClient();
      const { error: verifyError } = await supabase.auth.verifyOtp({
        phone: toE164IndianPhone(digits),
        token: otp.trim(),
        type: "sms",
      });
      if (verifyError) throw verifyError;

      const meRes = await fetch("/api/worker/me");
      const me = await meRes.json();
      if (!me.success) throw new Error(me.error?.message ?? "Session failed");

      if (me.profile.profile_complete) {
        router.push("/worker/dashboard");
      } else {
        router.push("/worker/profile");
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid OTP");
    } finally {
      setLoading(false);
    }
  }

  return (
    <WorkerShell title="Login">
      <p className="text-sm text-stone-600">
        Enter your registered mobile number. We will send a one-time password (OTP).
      </p>

      {step === "phone" ? (
        <form onSubmit={sendOtp} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-stone-800">Mobile number</span>
            <input
              type="tel"
              inputMode="numeric"
              maxLength={10}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="10-digit mobile"
              className="rounded-xl border border-stone-300 bg-white px-4 py-3"
              required
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-teal-700 px-4 py-3 font-medium text-white disabled:opacity-60"
          >
            {loading ? "Sending…" : "Send OTP"}
          </button>
        </form>
      ) : (
        <form onSubmit={verifyOtp} className="flex flex-col gap-4">
          <p className="text-sm text-stone-600">OTP sent to +91 {phone.replace(/\D/g, "")}</p>
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
            onClick={() => setStep("phone")}
          >
            Change number
          </button>
        </form>
      )}

      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      )}
    </WorkerShell>
  );
}
