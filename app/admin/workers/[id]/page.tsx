"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { AdminShell, StatusBadge } from "@/components/admin/AdminShell";

type WorkerDocument = {
  id: string;
  document_type: string;
  mime_type: string;
  verification_status: string;
  url: string | null;
  created_at: string;
};

type WorkerDetail = {
  id: string;
  worker_code: string;
  full_name: string;
  phone: string;
  whatsapp_number: string | null;
  years_experience: number | null;
  address_text: string | null;
  approval_status: string;
  approval_status_label: string;
  rejection_reason: string | null;
  is_available: boolean;
  primary_category: string | null;
  locality: string | null;
  approved_at: string | null;
  created_at: string;
  documents: WorkerDocument[];
};

export default function AdminWorkerDetailPage() {
  const router = useRouter();
  const params = useParams();
  const workerId = params.id as string;

  const [worker, setWorker] = useState<WorkerDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState(false);
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function loadWorker() {
    const res = await fetch(`/api/admin/workers/${workerId}`);
    const data = await res.json();
    if (!data.success) {
      setError(data.error?.message ?? "Failed to load worker");
      return;
    }
    setWorker(data.worker);
  }

  useEffect(() => {
    async function load() {
      const meRes = await fetch("/api/admin/me");
      const me = await meRes.json();
      if (!me.success) {
        router.push("/admin/login");
        return;
      }
      await loadWorker();
    }

    load()
      .catch(() => setError("Failed to load worker"))
      .finally(() => setLoading(false));
  }, [router, workerId]);

  async function runAction(action: "approve" | "reject" | "suspend") {
    setActing(true);
    setError(null);
    setMessage(null);
    try {
      const body =
        action === "approve" ? undefined : JSON.stringify({ rejection_reason: reason.trim() || undefined });

      const res = await fetch(`/api/admin/workers/${workerId}/${action}`, {
        method: "POST",
        headers: body ? { "Content-Type": "application/json" } : undefined,
        body,
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error?.message ?? "Action failed");
      setMessage(`Worker ${action}d successfully`);
      setReason("");
      await loadWorker();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action failed");
    } finally {
      setActing(false);
    }
  }

  const canApprove = worker && !["approved", "suspended", "banned"].includes(worker.approval_status);
  const canReject = worker && !["rejected", "banned"].includes(worker.approval_status);
  const canSuspend = worker && worker.approval_status === "approved";

  return (
    <AdminShell title="Worker Profile" active="workers">
      <Link href="/admin/workers" className="text-sm text-amber-800 underline">
        ← Back to workers
      </Link>

      {loading && <p className="text-sm text-stone-600">Loading…</p>}
      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      )}
      {message && (
        <p className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-800">{message}</p>
      )}

      {worker && (
        <div className="flex flex-col gap-4">
          <section className="rounded-xl border border-stone-200 bg-white p-4">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-lg font-semibold">{worker.full_name}</p>
              <StatusBadge status={worker.approval_status_label} />
            </div>
            <p className="font-mono text-sm text-stone-500">{worker.worker_code}</p>
            <dl className="mt-3 space-y-1 text-sm text-stone-700">
              <div>
                <dt className="inline font-medium">Phone: </dt>
                <dd className="inline">
                  <a href={`tel:${worker.phone}`} className="text-amber-800 underline">
                    {worker.phone}
                  </a>
                </dd>
              </div>
              {worker.whatsapp_number && (
                <div>
                  <dt className="inline font-medium">WhatsApp: </dt>
                  <dd className="inline">{worker.whatsapp_number}</dd>
                </div>
              )}
              <div>
                <dt className="inline font-medium">Category: </dt>
                <dd className="inline">{worker.primary_category ?? "—"}</dd>
              </div>
              <div>
                <dt className="inline font-medium">Locality: </dt>
                <dd className="inline">{worker.locality ?? "—"}</dd>
              </div>
              {worker.years_experience != null && (
                <div>
                  <dt className="inline font-medium">Experience: </dt>
                  <dd className="inline">{worker.years_experience} years</dd>
                </div>
              )}
              {worker.address_text && (
                <div>
                  <dt className="font-medium">Address</dt>
                  <dd>{worker.address_text}</dd>
                </div>
              )}
            </dl>
            {worker.rejection_reason && (
              <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                Reason: {worker.rejection_reason}
              </p>
            )}
            <p className="mt-2 text-xs text-stone-400">
              Joined {new Date(worker.created_at).toLocaleDateString("en-IN")}
              {worker.approved_at &&
                ` · Approved ${new Date(worker.approved_at).toLocaleDateString("en-IN")}`}
            </p>
          </section>

          {worker.documents.length > 0 && (
            <section className="rounded-xl border border-stone-200 bg-white p-4">
              <h2 className="font-medium text-stone-900">Documents</h2>
              <ul className="mt-3 flex flex-col gap-3">
                {worker.documents.map((doc) => (
                  <li key={doc.id} className="text-sm">
                    <p className="font-medium capitalize text-stone-800">
                      {doc.document_type.replace(/_/g, " ")}
                    </p>
                    <p className="text-xs text-stone-500">{doc.verification_status}</p>
                    {doc.url ? (
                      doc.mime_type.startsWith("image/") ? (
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 block overflow-hidden rounded-lg border border-stone-200"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={doc.url}
                            alt={doc.document_type}
                            className="max-h-64 w-full object-contain"
                          />
                        </a>
                      ) : (
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-amber-800 underline"
                        >
                          View document
                        </a>
                      )
                    ) : (
                      <p className="text-stone-500">Document unavailable</p>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="rounded-xl border border-amber-200 bg-amber-50 p-4">
            <h2 className="font-medium text-stone-900">Actions</h2>
            <label className="mt-2 flex flex-col gap-1 text-sm">
              <span className="text-stone-700">Reason (for reject / suspend)</span>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={2}
                className="rounded-lg border border-stone-300 bg-white px-3 py-2"
                placeholder="Optional for reject; recommended for suspend"
              />
            </label>
            <div className="mt-3 flex flex-wrap gap-2">
              {canApprove && (
                <button
                  type="button"
                  disabled={acting}
                  onClick={() => void runAction("approve")}
                  className="rounded-full bg-green-700 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
                >
                  Approve
                </button>
              )}
              {canReject && (
                <button
                  type="button"
                  disabled={acting}
                  onClick={() => void runAction("reject")}
                  className="rounded-full bg-red-700 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
                >
                  Reject
                </button>
              )}
              {canSuspend && (
                <button
                  type="button"
                  disabled={acting}
                  onClick={() => void runAction("suspend")}
                  className="rounded-full bg-stone-700 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
                >
                  Suspend
                </button>
              )}
            </div>
          </section>
        </div>
      )}
    </AdminShell>
  );
}
