"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { AdminShell, StatusBadge } from "@/components/admin/AdminShell";

type WorkerRow = {
  id: string;
  worker_code: string;
  full_name: string;
  phone: string;
  approval_status: string;
  approval_status_label: string;
  primary_category: string | null;
  locality: string | null;
  is_available: boolean;
  created_at: string;
};

const STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  { value: "pending", label: "Pending" },
  { value: "under_review", label: "Under review" },
  { value: "draft", label: "Draft" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "suspended", label: "Suspended" },
];

type AdminWorkersClientProps = {
  initialStatus: string;
};

export function AdminWorkersClient({ initialStatus }: AdminWorkersClientProps) {
  const router = useRouter();
  const statusFilter = initialStatus;

  const [workers, setWorkers] = useState<WorkerRow[]>([]);
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

      const res = await fetch(`/api/admin/workers?${params.toString()}`);
      const data = await res.json();
      if (!data.success) {
        setError(data.error?.message ?? "Failed to load workers");
        return;
      }
      setWorkers(data.workers);
    }

    setLoading(true);
    load()
      .catch(() => setError("Failed to load workers"))
      .finally(() => setLoading(false));
  }, [router, statusFilter]);

  function onStatusChange(value: string) {
    const params = new URLSearchParams();
    if (value) params.set("status", value);
    router.push(`/admin/workers${params.toString() ? `?${params}` : ""}`);
  }

  return (
    <AdminShell title="Workers" active="workers">
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
        <p className="text-sm text-stone-500">{workers.length} shown</p>
      </div>

      {loading && <p className="text-sm text-stone-600">Loading…</p>}
      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      )}

      {!loading && workers.length === 0 && (
        <p className="text-sm text-stone-600">No workers match this filter.</p>
      )}

      <ul className="flex flex-col gap-3">
        {workers.map((worker) => (
          <li key={worker.id}>
            <Link
              href={`/admin/workers/${worker.id}`}
              className="block rounded-xl border border-stone-200 bg-white p-4 transition hover:border-amber-300"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-stone-900">{worker.full_name}</p>
                  <p className="font-mono text-xs text-stone-500">{worker.worker_code}</p>
                  <p className="text-sm text-stone-700">{worker.phone}</p>
                  <p className="text-sm text-stone-600">
                    {worker.primary_category ?? "Category"} · {worker.locality ?? "Locality"}
                  </p>
                </div>
                <StatusBadge status={worker.approval_status_label} />
              </div>
              <p className="mt-1 text-xs text-stone-400">
                Joined {new Date(worker.created_at).toLocaleDateString("en-IN")}
                {worker.is_available ? " · Available" : " · Not available"}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </AdminShell>
  );
}
