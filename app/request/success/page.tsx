"use client";

import { useEffect, useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";

import { CustomerShell } from "@/components/customer/CustomerShell";
import { readCustomerSession } from "@/lib/customer/session";

export default function RequestSuccessPage() {
  const router = useRouter();
  const [session, setSession] = useState<{
    job_ref?: string;
    track_code?: string;
  } | null>(null);

  useEffect(() => {
    const data = readCustomerSession();
    if (!data?.job_ref || !data?.track_code) {
      router.replace("/track");
      return;
    }
    setSession({ job_ref: data.job_ref, track_code: data.track_code });
  }, [router]);

  if (!session) {
    return (
      <CustomerShell title="Request Submitted" active="request">
        <p className="text-sm text-stone-600">Loading…</p>
      </CustomerShell>
    );
  }

  return (
    <CustomerShell title="Request Submitted" active="request">
      <div className="rounded-2xl border border-teal-200 bg-teal-50 p-6 text-center">
        <p className="text-sm font-medium text-teal-800">Your request is received</p>
        <p className="mt-4 text-2xl font-semibold tracking-wide text-stone-900">
          {session.job_ref}
        </p>
        <p className="mt-1 text-xs uppercase tracking-widest text-stone-500">Job reference</p>
      </div>

      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center">
        <p className="text-sm font-medium text-amber-900">Track code (backup)</p>
        <p className="mt-3 font-mono text-3xl font-bold tracking-[0.3em] text-stone-900">
          {session.track_code}
        </p>
        <p className="mt-3 text-xs text-amber-900">
          Saved on this device. If you switch phones, note your job reference and track code.
        </p>
      </div>

      <p className="rounded-xl bg-teal-50 px-4 py-3 text-sm text-teal-900">
        This request is saved on this device. Open <strong>Track Job → My Requests</strong>{" "}
        anytime to check status without re-entering details.
      </p>

      <p className="text-sm text-stone-600">
        Our team will review your request and assign a verified worker. You can add photos
        or a voice note now, or track status anytime.
      </p>

      <div className="flex flex-col gap-3">
        <NextLink
          href="/request/photos"
          className="inline-flex items-center justify-center rounded-full bg-teal-700 px-6 py-3 text-sm font-medium text-white"
        >
          Add photos & voice note
        </NextLink>
        <NextLink
          href="/track"
          className="inline-flex items-center justify-center rounded-full border border-teal-700 px-6 py-3 text-sm font-medium text-teal-800"
        >
          View in My Requests
        </NextLink>
      </div>
    </CustomerShell>
  );
}
