"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { CustomerShell } from "@/components/customer/CustomerShell";
import { writeCustomerSession } from "@/lib/customer/session";

export default function RequestInvitePage() {
  const router = useRouter();
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/public/invite/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invite_code: inviteCode.trim() }),
      });
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error?.message ?? "Invalid invite code");
      }

      writeCustomerSession({ invite_code: inviteCode.trim().toUpperCase() });
      router.push("/request/new");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Validation failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <CustomerShell title="Request a Worker" active="request">
      <p className="text-sm text-stone-600">
        KaamSetu is in closed beta for Orai. Enter your invite code to submit a
        service request — no account needed.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Invite code *</span>
          <input
            required
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
            placeholder="e.g. ORAI2026"
            className="rounded-xl border border-stone-300 bg-white px-4 py-3 uppercase tracking-widest"
          />
        </label>

        {error && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-teal-700 px-6 py-3 text-sm font-medium text-white disabled:opacity-60"
        >
          {loading ? "Checking…" : "Continue"}
        </button>
      </form>

      <p className="text-sm text-stone-500">
        Already submitted?{" "}
        <Link href="/track" className="text-teal-700 underline-offset-4 hover:underline">
          Track your job
        </Link>
      </p>
    </CustomerShell>
  );
}
