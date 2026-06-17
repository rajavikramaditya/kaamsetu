"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

import { CustomerShell } from "@/components/customer/CustomerShell";
import {
  JobStatusCard,
  PhoneJobSummaryCard,
  SavedRequestCard,
} from "@/components/customer/JobStatusCard";
import {
  findSavedRequest,
  readSavedRequests,
  type SavedRequest,
} from "@/lib/customer/saved-requests";
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

type PhoneJobSummary = {
  public_id: string;
  job_ref: string;
  booking_status: string;
  dispatch_status: string;
  payment_status: string;
  service_category: string | null;
  locality: string | null;
  requested_at: string;
  created_at: string;
};

async function lookupJobWithTrackCode(
  jobRef: string,
  phone: string,
  trackCode: string,
): Promise<JobStatus> {
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

async function lookupJobByPhone(jobRef: string, phone: string): Promise<JobStatus> {
  const res = await fetch("/api/public/jobs/lookup-by-phone", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      job_ref: jobRef.trim().toUpperCase(),
      phone,
    }),
  });
  const data = await res.json();
  if (!data.success) {
    throw new Error(data.error?.message ?? "Job not found");
  }
  return data.job;
}

async function fetchJobsByPhone(phone: string): Promise<PhoneJobSummary[]> {
  const res = await fetch("/api/public/jobs/by-phone", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone }),
  });
  const data = await res.json();
  if (!data.success) {
    throw new Error(data.error?.message ?? "Lookup failed");
  }
  return data.jobs ?? [];
}

export default function TrackJobPage() {
  const [savedRequests, setSavedRequests] = useState<SavedRequest[]>([]);
  const [phoneLookup, setPhoneLookup] = useState("");
  const [phoneResults, setPhoneResults] = useState<PhoneJobSummary[]>([]);
  const [phoneLoading, setPhoneLoading] = useState(false);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [loadingPhoneJob, setLoadingPhoneJob] = useState<string | null>(null);

  const [advancedForm, setAdvancedForm] = useState({
    job_ref: "",
    phone: "",
    track_code: "",
  });
  const [showAdvancedForm, setShowAdvancedForm] = useState(false);
  const [advancedLoading, setAdvancedLoading] = useState(false);
  const [advancedError, setAdvancedError] = useState<string | null>(null);

  const [loadingSaved, setLoadingSaved] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [job, setJob] = useState<JobStatus | null>(null);

  const showJob = useCallback((result: JobStatus) => {
    setJob(result);
    setError(null);
    setAdvancedError(null);
    setPhoneError(null);
  }, []);

  const openSavedRequest = useCallback(async (request: SavedRequest) => {
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
      const result = await lookupJobWithTrackCode(
        request.job_ref,
        request.phone,
        request.track_code,
      );
      showJob(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load saved request");
    } finally {
      setLoadingSaved(null);
    }
  }, [showJob]);

  const openPhoneJob = useCallback(
    async (summary: PhoneJobSummary, phone: string) => {
      setLoadingPhoneJob(summary.job_ref);
      setError(null);
      setJob(null);
      try {
        const result = await lookupJobByPhone(summary.job_ref, phone);
        showJob(result);
      } catch (err) {
        setPhoneError(err instanceof Error ? err.message : "Could not load request");
      } finally {
        setLoadingPhoneJob(null);
      }
    },
    [showJob],
  );

  const openFromRef = useCallback(
    async (jobRef: string) => {
      const normalized = jobRef.trim().toUpperCase();
      const saved = readSavedRequests();
      const request =
        findSavedRequest(normalized) ?? saved.find((r) => r.job_ref === normalized);

      if (request) {
        await openSavedRequest(request);
        return;
      }

      const session = readCustomerSession();
      if (
        session?.job_ref === normalized &&
        session.phone &&
        session.track_code
      ) {
        setLoadingSaved(normalized);
        try {
          const result = await lookupJobWithTrackCode(
            normalized,
            session.phone,
            session.track_code,
          );
          showJob(result);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Could not load request");
        } finally {
          setLoadingSaved(null);
        }
        return;
      }

      setAdvancedForm((prev) => ({ ...prev, job_ref: normalized }));
      setShowAdvancedForm(true);
      setError("Open this request with your mobile number below, or use advanced lookup.");
    },
    [openSavedRequest, showJob],
  );

  useEffect(() => {
    const saved = readSavedRequests();
    setSavedRequests(saved);

    const params = new URLSearchParams(window.location.search);
    const openRef = params.get("open");
    const prefilledPhone = params.get("phone")?.replace(/\D/g, "").slice(-10) ?? "";
    const prefilledJobRef = params.get("job_ref")?.trim().toUpperCase() ?? "";

    if (prefilledPhone) {
      setPhoneLookup(prefilledPhone);
    }
    if (prefilledJobRef) {
      setAdvancedForm((prev) => ({
        ...prev,
        job_ref: prefilledJobRef,
        phone: prefilledPhone || prev.phone,
      }));
    }

    if (openRef) {
      void openFromRef(openRef);
    }
  }, [openFromRef]);

  async function handlePhoneLookup(e: React.FormEvent) {
    e.preventDefault();
    setPhoneLoading(true);
    setPhoneError(null);
    setPhoneResults([]);
    setJob(null);

    try {
      const phone = phoneLookup.replace(/\D/g, "").slice(-10);
      const results = await fetchJobsByPhone(phone);
      if (results.length === 0) {
        setPhoneError("No recent requests found for this mobile number.");
      } else {
        setPhoneResults(results);
      }
    } catch (err) {
      setPhoneError(err instanceof Error ? err.message : "Lookup failed");
    } finally {
      setPhoneLoading(false);
    }
  }

  async function handleAdvancedSubmit(e: React.FormEvent) {
    e.preventDefault();
    setAdvancedLoading(true);
    setAdvancedError(null);
    setJob(null);

    try {
      const result = await lookupJobWithTrackCode(
        advancedForm.job_ref,
        advancedForm.phone,
        advancedForm.track_code,
      );
      showJob(result);
    } catch (err) {
      setAdvancedError(err instanceof Error ? err.message : "Lookup failed");
    } finally {
      setAdvancedLoading(false);
    }
  }

  const normalizedPhone = phoneLookup.replace(/\D/g, "").slice(-10);

  return (
    <CustomerShell title="My Requests" active="track">
      {savedRequests.length > 0 && (
        <section className="flex flex-col gap-3">
          <div>
            <h2 className="text-sm font-semibold text-stone-900">My Requests on this device</h2>
            <p className="mt-1 text-xs text-stone-500">
              Tap a saved request — no codes needed on this phone.
            </p>
          </div>

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
          No saved requests on this device yet. Submit a request or track by mobile number
          below.
        </p>
      )}

      <section className="flex flex-col gap-3 border-t border-stone-200 pt-4">
        <div>
          <h2 className="text-sm font-semibold text-stone-900">Track by mobile number</h2>
          <p className="mt-1 text-sm text-stone-600">
            On another phone? Enter the mobile number used when submitting the request.
          </p>
        </div>

        <form onSubmit={handlePhoneLookup} className="flex flex-col gap-3">
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">Mobile number *</span>
            <input
              required
              type="tel"
              inputMode="numeric"
              maxLength={10}
              value={phoneLookup}
              onChange={(e) => setPhoneLookup(e.target.value)}
              placeholder="10-digit mobile"
              className="rounded-xl border border-stone-300 bg-white px-4 py-3"
            />
          </label>

          {phoneError && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">{phoneError}</p>
          )}

          <button
            type="submit"
            disabled={phoneLoading}
            className="rounded-full bg-teal-700 px-6 py-3 text-sm font-medium text-white disabled:opacity-60"
          >
            {phoneLoading ? "Searching…" : "Find my requests"}
          </button>
        </form>

        {phoneResults.length > 0 && (
          <div className="flex flex-col gap-2">
            {phoneResults.map((item) => (
              <PhoneJobSummaryCard
                key={item.job_ref}
                job={item}
                loading={loadingPhoneJob === item.job_ref}
                onOpen={() => openPhoneJob(item, normalizedPhone)}
              />
            ))}
          </div>
        )}
      </section>

      <section className="flex flex-col gap-3 border-t border-stone-200 pt-4">
        <button
          type="button"
          onClick={() => setShowAdvancedForm((v) => !v)}
          className="text-left text-sm font-medium text-teal-800 underline-offset-4 hover:underline"
        >
          {showAdvancedForm
            ? "Hide advanced lookup"
            : "Advanced lookup (job ref + phone + track code)"}
        </button>

        {showAdvancedForm && (
          <form onSubmit={handleAdvancedSubmit} className="flex flex-col gap-4">
            <p className="text-sm text-stone-600">
              Backup if you saved your job reference and 6-digit track code.
            </p>

            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium">Job reference *</span>
              <input
                required
                value={advancedForm.job_ref}
                onChange={(e) =>
                  setAdvancedForm({ ...advancedForm, job_ref: e.target.value.toUpperCase() })
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
                value={advancedForm.phone}
                onChange={(e) =>
                  setAdvancedForm({ ...advancedForm, phone: e.target.value })
                }
                className="rounded-xl border border-stone-300 bg-white px-4 py-3"
              />
            </label>

            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium">Track code *</span>
              <input
                required
                inputMode="numeric"
                maxLength={6}
                value={advancedForm.track_code}
                onChange={(e) =>
                  setAdvancedForm({ ...advancedForm, track_code: e.target.value })
                }
                placeholder="6 digits"
                className="rounded-xl border border-stone-300 bg-white px-4 py-3 font-mono tracking-widest"
              />
            </label>

            {advancedError && (
              <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">
                {advancedError}
              </p>
            )}

            <button
              type="submit"
              disabled={advancedLoading}
              className="rounded-full border border-teal-700 px-6 py-3 text-sm font-medium text-teal-800 disabled:opacity-60"
            >
              {advancedLoading ? "Looking up…" : "Advanced track"}
            </button>
          </form>
        )}
      </section>

      {error && !job && (
        <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">{error}</p>
      )}

      {job && <JobStatusCard job={job} />}

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
