"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { AdminShell, StatusBadge } from "@/components/admin/AdminShell";

type JobRow = {
  id: string;
  job_ref: string;
  booking_status: string;
  service_category: string | null;
  locality: string | null;
  customer_name: string | null;
  customer_phone: string | null;
  description: string;
  requested_at: string;
};

const STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  { value: "requested", label: "Requested" },
  { value: "validated", label: "Validated" },
  { value: "dispatching", label: "Dispatching" },
  { value: "assigned", label: "Assigned" },
  { value: "in_progress", label: "In progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "closed", label: "Closed" },
];

type AdminJobsClientProps = {
  initialStatus: string;
};

export function AdminJobsClient({ initialStatus }: AdminJobsClientProps) {
  const router = useRouter();
  const statusFilter = initialStatus;

  const [jobs, setJobs] = useState<JobRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const meRes = await fetch("/api/admin/me");
      const me = await meRes.json();
      if (!me.success) {
        router.push("/admin/login");
        return;
      }

      const params = new URLSearchParams();
      if (statusFilter) params.set("status", statusFilter);

      const res = await fetch(`/api/admin/jobs?${params.toString()}`);
      const data = await res.json();
      if (!data.success) {
        setError(data.error?.message ?? "Failed to load jobs");
        return;
      }
      setJobs(data.jobs);
    }

    setLoading(true);
    load()
      .catch(() => setError("Failed to load jobs"))
      .finally(() => setLoading(false));
  }, [router, statusFilter]);

  function onStatusChange(value: string) {
    const params = new URLSearchParams();
    if (value) params.set("status", value);
    router.push(`/admin/jobs${params.toString() ? `?${params}` : ""}`);
  }

  return (
    <AdminShell title="Customer Requests" active="jobs">
      <div className="flex items-center justify-between gap-2">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-stone-700">Filter by status</span>
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="rounded-lg border border-stone-300 bg-white px-3 py-2"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value || "all"} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
        <p className="text-sm text-stone-500">{jobs.length} shown</p>
      </div>

      {loading && <p className="text-sm text-stone-600">Loading…</p>}
      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      )}

      {!loading && jobs.length === 0 && (
        <p className="text-sm text-stone-600">No requests in this queue.</p>
      )}

      <ul className="flex flex-col gap-3">
        {jobs.map((job) => (
          <li key={job.id}>
            <Link
              href={`/admin/jobs/${job.id}`}
              className="block rounded-xl border border-stone-200 bg-white p-4 transition hover:border-amber-300"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-mono text-sm font-semibold text-stone-900">
                    {job.job_ref}
                  </p>
                  <p className="text-sm text-stone-700">
                    {job.customer_name ?? "Customer"} · {job.customer_phone ?? "—"}
                  </p>
                  <p className="text-sm text-stone-600">
                    {job.service_category ?? "Service"} · {job.locality ?? "Locality"}
                  </p>
                </div>
                <StatusBadge status={job.booking_status} />
              </div>
              <p className="mt-2 line-clamp-2 text-sm text-stone-600">{job.description}</p>
              <p className="mt-1 text-xs text-stone-400">
                {new Date(job.requested_at).toLocaleString("en-IN")}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </AdminShell>
  );
}
