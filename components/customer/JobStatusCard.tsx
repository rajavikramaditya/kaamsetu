"use client";

import type { SavedRequest } from "@/lib/customer/saved-requests";

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

export function statusLabel(value: string) {
  return value.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function JobStatusCard({ job }: { job: JobStatus }) {
  return (
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
      {job.address_text ? (
        <p>
          <span className="text-stone-500">Address:</span> {job.address_text}
        </p>
      ) : null}
      {job.description ? (
        <p>
          <span className="text-stone-500">Issue:</span> {job.description}
        </p>
      ) : null}

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
  );
}

export function PhoneJobSummaryCard({
  job,
  loading,
  onOpen,
}: {
  job: {
    job_ref: string;
    booking_status: string;
    service_category: string | null;
    locality: string | null;
    created_at: string;
  };
  loading?: boolean;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      disabled={loading}
      className="flex w-full flex-col gap-1 rounded-2xl border border-stone-200 bg-white p-4 text-left transition hover:border-teal-300 disabled:opacity-60"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-semibold text-stone-900">{job.job_ref}</span>
        <span className="rounded-full bg-teal-100 px-2 py-0.5 text-xs font-medium text-teal-900">
          {statusLabel(job.booking_status)}
        </span>
      </div>
      <p className="text-sm text-stone-600">
        {[job.service_category, job.locality].filter(Boolean).join(" · ") || "Service request"}
      </p>
      <p className="text-xs text-teal-700">{loading ? "Loading…" : "View details →"}</p>
      <p className="text-xs text-stone-400">
        {new Date(job.created_at).toLocaleString("en-IN")}
      </p>
    </button>
  );
}

export function SavedRequestCard({
  request,
  loading,
  onOpen,
}: {
  request: SavedRequest;
  loading?: boolean;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      disabled={loading}
      className="flex w-full flex-col gap-1 rounded-2xl border border-stone-200 bg-white p-4 text-left transition hover:border-teal-300 disabled:opacity-60"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-semibold text-stone-900">{request.job_ref}</span>
        <span className="text-xs text-teal-700">{loading ? "Loading…" : "View status →"}</span>
      </div>
      <p className="text-sm text-stone-600">
        {request.category} · {request.locality}
      </p>
      <p className="text-xs text-stone-400">
        {new Date(request.created_at).toLocaleString("en-IN")}
      </p>
    </button>
  );
}
