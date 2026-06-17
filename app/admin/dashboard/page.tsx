"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { AdminShell } from "@/components/admin/AdminShell";

type Metrics = {
  new_requests: number;
  pending_workers: number;
  open_complaints: number;
  pending_payments: number;
  total_workers: number;
  total_jobs: number;
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [email, setEmail] = useState<string | null>(null);
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
      setEmail(me.email ?? null);

      const dashRes = await fetch("/api/admin/dashboard");
      const dash = await dashRes.json();
      if (!dash.success) {
        setError(dash.error?.message ?? "Failed to load dashboard");
        return;
      }
      setMetrics(dash.metrics);
    }

    load()
      .catch(() => setError("Failed to load dashboard"))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <AdminShell title="Dashboard" active="dashboard">
        <p className="text-sm text-stone-600">Loading…</p>
      </AdminShell>
    );
  }

  return (
    <AdminShell title="Dashboard" active="dashboard">
      {email && (
        <p className="text-sm text-stone-600">
          Signed in as <span className="font-medium">{email}</span>
        </p>
      )}

      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      )}

      {metrics && (
        <div className="grid grid-cols-2 gap-3">
          <MetricCard
            label="New requests"
            value={metrics.new_requests}
            href="/admin/jobs?status=requested"
          />
          <MetricCard
            label="Pending workers"
            value={metrics.pending_workers}
            href="/admin/workers?status=pending"
          />
          <MetricCard label="Open complaints" value={metrics.open_complaints} />
          <MetricCard label="Pending payments" value={metrics.pending_payments} />
          <MetricCard label="Total workers" value={metrics.total_workers} href="/admin/workers" />
          <MetricCard label="Total jobs" value={metrics.total_jobs} href="/admin/jobs" />
        </div>
      )}

      <div className="flex flex-col gap-2 pt-2">
        <Link
          href="/admin/jobs?status=requested"
          className="rounded-xl border border-amber-200 bg-white px-4 py-3 text-sm font-medium text-amber-900"
        >
          Review customer requests →
        </Link>
        <Link
          href="/admin/workers?status=pending"
          className="rounded-xl border border-amber-200 bg-white px-4 py-3 text-sm font-medium text-amber-900"
        >
          Review worker profiles →
        </Link>
      </div>
    </AdminShell>
  );
}

function MetricCard({
  label,
  value,
  href,
}: {
  label: string;
  value: number;
  href?: string;
}) {
  const inner = (
    <div className="rounded-xl border border-stone-200 bg-white p-4">
      <p className="text-2xl font-semibold text-stone-900">{value}</p>
      <p className="text-xs text-stone-600">{label}</p>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block transition hover:border-amber-300">
        {inner}
      </Link>
    );
  }

  return inner;
}
