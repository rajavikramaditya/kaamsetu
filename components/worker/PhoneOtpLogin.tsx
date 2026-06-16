"use client";

import { useState } from "react";

import { createClient } from "@/lib/supabase/client";
import { toE164IndianPhone } from "@/types/worker";

type PhoneOtpLoginProps = {
  onSuccess: () => Promise<void>;
};

/** Phone OTP login — enabled when Supabase SMS provider is configured. */
export function PhoneOtpLogin({ onSuccess }: PhoneOtpLoginProps) {
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
      await onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid OTP");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="rounded-xl bg-stone-100 px-4 py-3 text-sm text-stone-600">
        Phone OTP will be enabled later when an SMS provider is configured. Use Email
        OTP for now.
      </p>

      {step === "phone" ? (
        <form onSubmit={sendOtp} className="flex flex-col gap-4 opacity-60">
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
              disabled
            />
          </label>
          <button
            type="submit"
            disabled
            className="rounded-full bg-stone-400 px-4 py-3 font-medium text-white"
          >
            Send OTP (coming soon)
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
    </div>
  );
}
