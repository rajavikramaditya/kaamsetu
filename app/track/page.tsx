"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { CustomerShell } from "@/components/customer/CustomerShell";
import { readCustomerSession } from "@/lib/customer/session";

type JobStatus = {
  public_id: string;
  job_ref: string;
  booking_status: string;
  dispatch_status: string;
  payment_status: string;
  complaint_status: string;
  description: string;
  address_text: string;
  service_category: string | null;
  locality: string | null;
  requested_at: string;
  assigned_at: string | null;
  completed_at: string | null;
};

function statusLabel(value: string) {
  return value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function TrackJobPage() {
  const [form, setForm] = useState({
    job_ref: "",
    phone: "",
    track_code: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [job, setJob] = useState<JobStatus | null>(null);

  useEffect(() => {
    const session = readCustomerSession();
    if (session) {
      setForm({
        job_ref: session.job_ref ?? "",
        phone: session.phone ?? "",
        track_code: session.track_code ?? "",
      });
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setJob(null);

    try {
      const res = await fetch("/api/public/jobs/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          job_ref: form.job_ref.trim().toUpperCase(),
          phone: form.phone,
          track_code: form.track_code.trim(),
        }),
      });
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error?.message ?? "Job not found");
      }

      setJob(data.job);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lookup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <CustomerShell title="Track Job" active="track">
      <p className="text-sm text-stone-600">
        Enter your job reference, mobile number, and 6-digit track code from when you
        submitted the request.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Job reference *</span>
          <input
            required
            value={form.job_ref}
            onChange={(e) =>
              setForm({ ...form, job_ref: e.target.value.toUpperCase() })
            }
            placeholder="KS-000001"
            className="rounded-xl border border-stone-300 bg-white px-4 py-3 uppercase"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Mobile number *</span>
          <input
            required
            type="tel"
            inputMode="numeric"
            maxLength={10}
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="rounded-xl border border-stone-300 bg-white px-4 py-3"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Track code *</span>
          <input
            required
            inputMode="numeric"
            maxLength={6}
            value={form.track_code}
            onChange={(e) => setForm({ ...form, track_code: e.target.value })}
            placeholder="6 digits"
            className="rounded-xl border border-stone-300 bg-white px-4 py-3 font-mono tracking-widest"
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
          {loading ? "Looking up…" : "Track job"}
        </button>
      </form>

      {job && (
        <div className="flex flex-col gap-3 rounded-2xl border border-stone-200 bg-white p-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-stone-900">{job.job_ref}</span>
            <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-medium text-teal-900">
              {statusLabel(job.booking_status)}
            </span>
          </div>

          {job.service_category && (
            <p>
              <span className="text-stone-500">Service:</span> {job.service_category}
            </p>
          )}
          {job.locality && (
            <p>
              <span className="text-stone-500">Locality:</span> {job.locality}
            </p>
          )}
          <p>
            <span className="text-stone-500">Address:</span> {job.address_text}
          </p>
          <p>
            <span className="text-stone-500">Issue:</span> {job.description}
          </p>

          <div className="mt-2 grid grid-cols-2 gap-2 border-t border-stone-100 pt-3 text-xs">
            <div>
              <p className="text-stone-500">Dispatch</p>
              <p className="font-medium">{statusLabel(job.dispatch_status)}</p>
            </div>
            <div>
              <p className="text-stone-500">Payment</p>
              <p className="font-medium">{statusLabel(job.payment_status)}</p>
            </div>
          </div>

          <p className="text-xs text-stone-400">
            Requested {new Date(job.requested_at).toLocaleString("en-IN")}
          </p>
        </div>
      )}

      <Link
        href="/request"
        className="text-center text-sm text-teal-700 underline-offset-4 hover:underline"
      >
        Submit a new request
      </Link>
    </CustomerShell>
  );
}
