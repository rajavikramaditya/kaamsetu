"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { AdminShell, StatusBadge } from "@/components/admin/AdminShell";

type JobMedia = {
  id: string;
  media_kind: string;
  mime_type: string;
  url: string | null;
  created_at: string;
};

type JobDetail = {
  id: string;
  job_ref: string;
  booking_status: string;
  dispatch_status: string;
  payment_status: string;
  description: string;
  address_text: string;
  landmark: string | null;
  preferred_date: string | null;
  preferred_time_slot: string;
  service_category: string | null;
  locality: string | null;
  requested_at: string;
  customer: {
    full_name: string;
    phone: string;
    alternate_phone: string | null;
    default_address_text: string | null;
    landmark: string | null;
  } | null;
  media: JobMedia[];
};

export default function AdminJobDetailPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = params.id as string;

  const [job, setJob] = useState<JobDetail | null>(null);
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

      const res = await fetch(`/api/admin/jobs/${jobId}`);
      const data = await res.json();
      if (!data.success) {
        setError(data.error?.message ?? "Failed to load job");
        return;
      }
      setJob(data.job);
    }

    load()
      .catch(() => setError("Failed to load job"))
      .finally(() => setLoading(false));
  }, [router, jobId]);

  const photos = job?.media.filter((m) => m.media_kind === "issue_photo") ?? [];
  const voiceNotes = job?.media.filter((m) => m.media_kind === "issue_voice_note") ?? [];

  return (
    <AdminShell title="Request Detail" active="jobs">
      <Link href="/admin/jobs" className="text-sm text-amber-800 underline">
        ← Back to queue
      </Link>

      {loading && <p className="text-sm text-stone-600">Loading…</p>}
      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      )}

      {job && (
        <div className="flex flex-col gap-4">
          <section className="rounded-xl border border-stone-200 bg-white p-4">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-mono text-lg font-semibold">{job.job_ref}</p>
              <StatusBadge status={job.booking_status} />
              <StatusBadge status={job.dispatch_status} />
              <StatusBadge status={job.payment_status} />
            </div>
            <p className="mt-2 text-sm text-stone-600">
              {job.service_category ?? "Service"} · {job.locality ?? "Locality"}
            </p>
            <p className="text-xs text-stone-400">
              Requested {new Date(job.requested_at).toLocaleString("en-IN")}
            </p>
          </section>

          <section className="rounded-xl border border-stone-200 bg-white p-4">
            <h2 className="font-medium text-stone-900">Customer</h2>
            {job.customer ? (
              <dl className="mt-2 space-y-1 text-sm text-stone-700">
                <div>
                  <dt className="inline font-medium">Name: </dt>
                  <dd className="inline">{job.customer.full_name}</dd>
                </div>
                <div>
                  <dt className="inline font-medium">Phone: </dt>
                  <dd className="inline">
                    <a href={`tel:${job.customer.phone}`} className="text-amber-800 underline">
                      {job.customer.phone}
                    </a>
                  </dd>
                </div>
                {job.customer.alternate_phone && (
                  <div>
                    <dt className="inline font-medium">Alt phone: </dt>
                    <dd className="inline">{job.customer.alternate_phone}</dd>
                  </div>
                )}
              </dl>
            ) : (
              <p className="text-sm text-stone-600">No customer record</p>
            )}
          </section>

          <section className="rounded-xl border border-stone-200 bg-white p-4">
            <h2 className="font-medium text-stone-900">Job details</h2>
            <dl className="mt-2 space-y-2 text-sm text-stone-700">
              <div>
                <dt className="font-medium text-stone-800">Description</dt>
                <dd className="whitespace-pre-wrap">{job.description}</dd>
              </div>
              <div>
                <dt className="font-medium text-stone-800">Address</dt>
                <dd>{job.address_text}</dd>
              </div>
              {job.landmark && (
                <div>
                  <dt className="font-medium text-stone-800">Landmark</dt>
                  <dd>{job.landmark}</dd>
                </div>
              )}
              <div>
                <dt className="font-medium text-stone-800">Preferred slot</dt>
                <dd>
                  {job.preferred_date ?? "Flexible"} · {job.preferred_time_slot}
                </dd>
              </div>
            </dl>
          </section>

          {(photos.length > 0 || voiceNotes.length > 0) && (
            <section className="rounded-xl border border-stone-200 bg-white p-4">
              <h2 className="font-medium text-stone-900">Photos & voice note</h2>

              {photos.length > 0 && (
                <div className="mt-3">
                  <p className="mb-2 text-sm text-stone-600">
                    {photos.length} photo{photos.length > 1 ? "s" : ""}
                  </p>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {photos.map((photo) =>
                      photo.url ? (
                        <a
                          key={photo.id}
                          href={photo.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block overflow-hidden rounded-lg border border-stone-200"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={photo.url}
                            alt="Issue photo"
                            className="aspect-square w-full object-cover"
                          />
                        </a>
                      ) : (
                        <div
                          key={photo.id}
                          className="flex aspect-square items-center justify-center rounded-lg bg-stone-100 text-xs text-stone-500"
                        >
                          Unavailable
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}

              {voiceNotes.map((note) => (
                <div key={note.id} className="mt-4">
                  <p className="mb-2 text-sm text-stone-600">Voice note</p>
                  {note.url ? (
                    <audio controls className="w-full" src={note.url}>
                      Your browser does not support audio playback.
                    </audio>
                  ) : (
                    <p className="text-sm text-stone-500">Voice note unavailable</p>
                  )}
                </div>
              ))}
            </section>
          )}

          {job.media.length === 0 && (
            <p className="text-sm text-stone-500">No photos or voice note uploaded yet.</p>
          )}
        </div>
      )}
    </AdminShell>
  );
}
