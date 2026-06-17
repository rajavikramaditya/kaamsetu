"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { CustomerShell } from "@/components/customer/CustomerShell";
import { VoiceNoteRecorder } from "@/components/customer/VoiceNoteRecorder";
import { compressImageFiles } from "@/lib/customer/compress-image";
import { findSavedRequest } from "@/lib/customer/saved-requests";
import { readCustomerSession } from "@/lib/customer/session";
import { buildTrackFallbackUrl, buildTrackOpenUrl } from "@/lib/customer/track-url";
import { MAX_ISSUE_PHOTOS } from "@/lib/validation/customer";

type Credentials = {
  public_id: string;
  job_ref: string;
  phone: string;
  track_code: string;
};

async function uploadMedia(
  credentials: Credentials,
  file: File,
  mediaKind: "issue_photo" | "issue_voice_note",
) {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("job_ref", credentials.job_ref);
  fd.append("phone", credentials.phone);
  fd.append("track_code", credentials.track_code);
  fd.append("media_kind", mediaKind);

  const res = await fetch(`/api/public/jobs/${credentials.public_id}/media`, {
    method: "POST",
    body: fd,
  });
  const data = await res.json();
  if (!data.success) {
    throw new Error(data.error?.message ?? "Upload failed");
  }
}

function resolveTrackUrls(credentials: Credentials) {
  const saved = findSavedRequest(credentials.job_ref);
  if (saved) {
    const href = buildTrackOpenUrl(credentials.job_ref, credentials.phone);
    return { primary: href, secondary: href };
  }
  return {
    primary: buildTrackOpenUrl(credentials.job_ref, credentials.phone),
    secondary: buildTrackFallbackUrl(credentials.job_ref, credentials.phone),
  };
}

export default function RequestPhotosPage() {
  const router = useRouter();
  const [credentials, setCredentials] = useState<Credentials | null>(null);
  const [trackUrls, setTrackUrls] = useState({ primary: "/track", secondary: "/track" });
  const [photosUploaded, setPhotosUploaded] = useState(0);
  const [voiceUploaded, setVoiceUploaded] = useState(false);
  const [compressing, setCompressing] = useState(false);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [uploadingVoice, setUploadingVoice] = useState(false);
  const [pendingVoice, setPendingVoice] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const session = readCustomerSession();
    if (!session?.public_id || !session.job_ref || !session.track_code || !session.phone) {
      router.replace("/track");
      return;
    }
    const creds = {
      public_id: session.public_id,
      job_ref: session.job_ref,
      phone: session.phone,
      track_code: session.track_code,
    };
    setCredentials(creds);
    setTrackUrls(resolveTrackUrls(creds));
  }, [router]);

  async function handlePhotoSelect(e: React.ChangeEvent<HTMLInputElement>) {
    if (!credentials) return;
    const picked = Array.from(e.target.files ?? []);
    if (picked.length === 0) return;

    const remaining = MAX_ISSUE_PHOTOS - photosUploaded;
    if (remaining <= 0) {
      setError(`Maximum ${MAX_ISSUE_PHOTOS} photos allowed.`);
      return;
    }

    const toUpload = picked.slice(0, remaining);
    setError(null);
    setCompressing(true);
    setUploadingPhotos(true);

    try {
      const compressed = await compressImageFiles(toUpload);
      let count = 0;
      for (const file of compressed) {
        if (photosUploaded + count >= MAX_ISSUE_PHOTOS) break;
        await uploadMedia(credentials, file, "issue_photo");
        count += 1;
      }
      setPhotosUploaded((n) => n + count);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Photo upload failed");
    } finally {
      setCompressing(false);
      setUploadingPhotos(false);
      e.target.value = "";
    }
  }

  async function handleVoiceUpload() {
    if (!credentials || !pendingVoice || voiceUploaded) return;
    setUploadingVoice(true);
    setError(null);
    try {
      await uploadMedia(credentials, pendingVoice, "issue_voice_note");
      setVoiceUploaded(true);
      setPendingVoice(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Voice upload failed");
    } finally {
      setUploadingVoice(false);
    }
  }

  if (!credentials) {
    return (
      <CustomerShell title="Add Photos & Voice" active="request">
        <p className="text-sm text-stone-600">Loading…</p>
      </CustomerShell>
    );
  }

  const photosRemaining = MAX_ISSUE_PHOTOS - photosUploaded;
  const photoLimitReached = photosRemaining <= 0;

  return (
    <CustomerShell title="Add Photos & Voice" active="request">
      <p className="text-sm text-stone-600">
        Optional: add up to {MAX_ISSUE_PHOTOS} photos and one voice note for job{" "}
        <strong>{credentials.job_ref}</strong>. When you are done, view your request status.
      </p>

      {photosUploaded > 0 && (
        <p className="rounded-xl bg-teal-50 px-4 py-3 text-sm text-teal-900">
          {photosUploaded} photo{photosUploaded === 1 ? "" : "s"} uploaded.
        </p>
      )}

      <div className="flex flex-col gap-3 rounded-2xl border border-stone-200 bg-white p-4">
        <p className="text-sm font-medium text-stone-900">Issue photos (optional)</p>
        {!photoLimitReached ? (
          <label className="flex flex-col gap-2 text-sm">
            <span className="text-stone-600">
              Select one or more photos ({photosRemaining} remaining)
            </span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              disabled={compressing || uploadingPhotos}
              onChange={handlePhotoSelect}
              className="text-sm"
            />
          </label>
        ) : (
          <p className="text-sm text-amber-900">Photo limit reached for this job.</p>
        )}
        {(compressing || uploadingPhotos) && (
          <p className="text-sm text-stone-600">
            {compressing ? "Compressing…" : "Uploading photos…"}
          </p>
        )}
      </div>

      <VoiceNoteRecorder
        disabled={voiceUploaded || uploadingVoice}
        uploading={uploadingVoice}
        uploaded={voiceUploaded}
        onRecorded={(file) => setPendingVoice(file)}
      />

      {pendingVoice && !voiceUploaded && (
        <button
          type="button"
          disabled={uploadingVoice}
          onClick={handleVoiceUpload}
          className="rounded-full bg-teal-700 px-6 py-3 text-sm font-medium text-white disabled:opacity-60"
        >
          {uploadingVoice ? "Uploading…" : "Upload voice note"}
        </button>
      )}

      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>
      )}

      <div className="flex flex-col gap-3 border-t border-stone-200 pt-4">
        <Link
          href={trackUrls.primary}
          className="inline-flex items-center justify-center rounded-full bg-teal-700 px-6 py-3 text-sm font-medium text-white"
        >
          View this request
        </Link>
        <Link
          href={trackUrls.secondary}
          className="text-center text-sm text-teal-700 underline-offset-4 hover:underline"
        >
          Skip and track job
        </Link>
      </div>
    </CustomerShell>
  );
}
