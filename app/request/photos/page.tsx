"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { CustomerShell } from "@/components/customer/CustomerShell";
import { readCustomerSession } from "@/lib/customer/session";

export default function RequestPhotosPage() {
  const router = useRouter();
  const [credentials, setCredentials] = useState<{
    public_id: string;
    job_ref: string;
    phone: string;
    track_code: string;
  } | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const session = readCustomerSession();
    if (!session?.public_id || !session.job_ref || !session.track_code || !session.phone) {
      router.replace("/track");
      return;
    }
    setCredentials({
      public_id: session.public_id,
      job_ref: session.job_ref,
      phone: session.phone,
      track_code: session.track_code,
    });
  }, [router]);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!credentials || !file) return;

    setUploading(true);
    setError(null);

    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("job_ref", credentials.job_ref);
      fd.append("phone", credentials.phone);
      fd.append("track_code", credentials.track_code);

      const res = await fetch(
        `/api/public/jobs/${credentials.public_id}/media`,
        { method: "POST", body: fd },
      );
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error?.message ?? "Upload failed");
      }

      setUploaded((n) => n + 1);
      setFile(null);
      if (uploaded + 1 >= 3) setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  if (!credentials) {
    return (
      <CustomerShell title="Upload Photos" active="request">
        <p className="text-sm text-stone-600">Loading…</p>
      </CustomerShell>
    );
  }

  return (
    <CustomerShell title="Upload Photos" active="request">
      <p className="text-sm text-stone-600">
        Add up to 3 photos of the issue for job <strong>{credentials.job_ref}</strong>.
        JPEG, PNG, or WebP — max 5 MB each.
      </p>

      {uploaded > 0 && (
        <p className="rounded-xl bg-teal-50 px-4 py-3 text-sm text-teal-900">
          {uploaded} photo{uploaded === 1 ? "" : "s"} uploaded.
        </p>
      )}

      {!done && uploaded < 3 && (
        <form onSubmit={handleUpload} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">Issue photo</span>
            <input
              required
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="text-sm"
            />
          </label>

          {error && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>
          )}

          <button
            type="submit"
            disabled={uploading || !file}
            className="rounded-full bg-teal-700 px-6 py-3 text-sm font-medium text-white disabled:opacity-60"
          >
            {uploading ? "Uploading…" : "Upload photo"}
          </button>
        </form>
      )}

      {(done || uploaded >= 3) && (
        <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Photo limit reached for this job.
        </p>
      )}

      <Link
        href="/track"
        className="text-center text-sm text-teal-700 underline-offset-4 hover:underline"
      >
        Track job status →
      </Link>
    </CustomerShell>
  );
}
