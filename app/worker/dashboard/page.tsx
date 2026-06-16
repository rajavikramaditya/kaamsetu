"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { WorkerShell } from "@/components/worker/WorkerShell";
import { createClient } from "@/lib/supabase/client";

type MeResponse = {
  success: boolean;
  profile?: {
    worker_code: string;
    full_name: string;
    phone: string;
    approval_status: string;
    approval_status_label: string;
    rejection_reason: string | null;
    is_available: boolean;
    availability_label: string;
    can_receive_offers: boolean;
    profile_complete: boolean;
  };
  documents?: { aadhaar_uploaded: boolean; pan_uploaded: boolean };
};

export default function WorkerDashboardPage() {
  const router = useRouter();
  const [me, setMe] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadMe() {
    const res = await fetch("/api/worker/me");
    const data: MeResponse = await res.json();
    if (!data.success) {
      router.push("/worker/login");
      return;
    }
    if (!data.profile?.profile_complete) {
      router.push("/worker/profile");
      return;
    }
    setMe(data);
  }

  useEffect(() => {
    loadMe()
      .catch(() => setError("Failed to load dashboard"))
      .finally(() => setLoading(false));
  }, [router]);

  async function toggleAvailability() {
    if (!me?.profile || me.profile.approval_status !== "approved") return;
    setToggling(true);
    setError(null);
    try {
      const res = await fetch("/api/worker/availability", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_available: !me.profile.is_available }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error?.message ?? "Update failed");
      await loadMe();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setToggling(false);
    }
  }

  async function logout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/worker/login");
    router.refresh();
  }

  if (loading) {
    return (
      <WorkerShell title="Dashboard">
        <p className="text-sm text-stone-600">Loading…</p>
      </WorkerShell>
    );
  }

  const profile = me?.profile;

  return (
    <WorkerShell title="Dashboard">
      {profile && (
        <>
          <div className="rounded-2xl border border-stone-200 bg-white p-4">
            <p className="text-sm text-stone-500">{profile.worker_code}</p>
            <p className="text-lg font-semibold text-stone-900">{profile.full_name}</p>
            <p className="text-sm text-stone-600">+91 {profile.phone}</p>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-white p-4">
            <p className="text-sm font-medium text-stone-800">Approval status</p>
            <p className="mt-1 text-lg font-semibold text-teal-800">
              {profile.approval_status_label}
            </p>
            {profile.rejection_reason && (
              <p className="mt-2 text-sm text-red-700">{profile.rejection_reason}</p>
            )}
            {!profile.can_receive_offers && (
              <p className="mt-2 text-sm text-stone-600">
                Job offers will appear only after founder approval.
              </p>
            )}
          </div>

          {profile.approval_status === "approved" && (
            <div className="rounded-2xl border border-stone-200 bg-white p-4">
              <p className="text-sm font-medium text-stone-800">Availability</p>
              <p className="mt-1 text-lg font-semibold capitalize text-stone-900">
                {profile.availability_label}
              </p>
              <button
                type="button"
                disabled={toggling}
                onClick={toggleAvailability}
                className="mt-3 rounded-full border border-teal-700 px-4 py-2 text-sm font-medium text-teal-800 disabled:opacity-60"
              >
                {toggling
                  ? "Updating…"
                  : profile.is_available
                    ? "Mark Busy"
                    : "Mark Available"}
              </button>
            </div>
          )}

          <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-4 text-sm text-stone-600">
            Job offers and dispatch arrive in Sprint 5. Your profile is ready for founder
            review.
          </div>

          <div className="flex flex-col gap-2">
            <Link
              href="/worker/profile"
              className="text-center text-sm text-teal-700 underline"
            >
              Edit profile
            </Link>
            <button
              type="button"
              onClick={logout}
              className="text-center text-sm text-stone-500 underline"
            >
              Log out
            </button>
          </div>
        </>
      )}

      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      )}
    </WorkerShell>
  );
}
