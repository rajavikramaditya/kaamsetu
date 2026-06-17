"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { CustomerShell } from "@/components/customer/CustomerShell";
import { JobStatusCard, SavedRequestCard } from "@/components/customer/JobStatusCard";
import { readSavedRequests, type SavedRequest } from "@/lib/customer/saved-requests";
import { patchCustomerSession, readCustomerSession } from "@/lib/customer/session";

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

async function lookupJob(jobRef: string, phone: string, trackCode: string): Promise<JobStatus> {
  const res = await fetch("/api/public/jobs/lookup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      job_ref: jobRef.trim().toUpperCase(),
      phone,
      track_code: trackCode.trim(),
    }),
  });
  const data = await res.json();
  if (!data.success) {
    throw new Error(data.error?.message ?? "Job not found");
  }
  return data.job;
}

export default function TrackJobPage() {
  const [savedRequests, setSavedRequests] = useState<SavedRequest[]>([]);
  const [form, setForm] = useState({
    job_ref: "",
    phone: "",
    track_code: "",
  });
  const [loading, setLoading] = useState(false);
  const [loadingSaved, setLoadingSaved] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [job, setJob] = useState<JobStatus | null>(null);
  const [showManualForm, setShowManualForm] = useState(false);

  useEffect(() => {
    setSavedRequests(readSavedRequests());
    const session = readCustomerSession();
    if (session?.job_ref) {
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
      const result = await lookupJob(form.job_ref, form.phone, form.track_code);
      setJob(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lookup failed");
    } finally {
      setLoading(false);
    }
  }

  async function openSavedRequest(request: SavedRequest) {
    setLoadingSaved(request.job_ref);
    setError(null);
    setJob(null);

    patchCustomerSession({
      invite_code: "",
      job_ref: request.job_ref,
      public_id: request.public_id,
      track_code: request.track_code,
      phone: request.phone,
    });

    try {
      const result = await lookupJob(request.job_ref, request.phone, request.track_code);
      setJob(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load saved request");
    } finally {
      setLoadingSaved(null);
    }
  }

  return (
    <CustomerShell title="My Requests" active="track">
      {savedRequests.length > 0 && (
        <section className="flex flex-col gap-3">
          <div>
            <h2 className="text-sm font-semibold text-stone-900">My Requests</h2>
            <p className="mt-1 text-xs text-stone-500">
              Tap a saved request to view status on this device.
            </p>
          </div>

          <p className="rounded-xl bg-amber-50 px-4 py-3 text-xs text-amber-900">
            This request is saved on this device. If you use another phone, save your job
            reference and track code.
          </p>

          <div className="flex flex-col gap-2">
            {savedRequests.map((request) => (
              <SavedRequestCard
                key={request.job_ref}
                request={request}
                loading={loadingSaved === request.job_ref}
                onOpen={() => openSavedRequest(request)}
              />
            ))}
          </div>
        </section>
      )}

      {savedRequests.length === 0 && (
        <p className="rounded-xl bg-stone-100 px-4 py-3 text-sm text-stone-600">
          No saved requests on this device yet. Submit a request to see it here automatically.
        </p>
      )}

      <section className="flex flex-col gap-3 border-t border-stone-200 pt-4">
        <button
          type="button"
          onClick={() => setShowManualForm((v) => !v)}
          className="text-left text-sm font-medium text-teal-800 underline-offset-4 hover:underline"
        >
          {showManualForm ? "Hide manual lookup" : "Track with job ref + track code"}
        </button>

        {showManualForm && (
          <>
            <p className="text-sm text-stone-600">
              Use this if you are on a different device or cleared app data.
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
          </>
        )}
      </section>

      {job && !error && <JobStatusCard job={job} />}

      {error && savedRequests.length > 0 && !showManualForm && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>
      )}

      {job && (
        <Link
          href="/request/photos"
          className="text-center text-sm text-teal-700 underline-offset-4 hover:underline"
        >
          Add photos or voice note →
        </Link>
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
