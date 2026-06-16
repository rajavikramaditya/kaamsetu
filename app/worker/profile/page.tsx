"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { isPendingProfilePhone } from "@/types/worker";
import { WorkerShell } from "@/components/worker/WorkerShell";

type BootstrapData = {
  service_categories: { id: string; name_en: string }[];
  localities: { id: string; name: string }[];
};

type MeResponse = {
  success: boolean;
  profile?: {
    full_name: string;
    phone: string;
    whatsapp_number: string | null;
    primary_category_id: string | null;
    locality_id: string | null;
    years_experience: number;
    approval_status: string;
    approval_status_label: string;
    rejection_reason: string | null;
  };
  documents?: { aadhaar_uploaded: boolean; pan_uploaded: boolean };
};

export default function WorkerProfilePage() {
  const router = useRouter();
  const [bootstrap, setBootstrap] = useState<BootstrapData | null>(null);
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    whatsapp_number: "",
    primary_category_id: "",
    locality_id: "",
    years_experience: "0",
  });
  const [aadhaarFile, setAadhaarFile] = useState<File | null>(null);
  const [panFile, setPanFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [bootRes, meRes] = await Promise.all([
          fetch("/api/public/bootstrap"),
          fetch("/api/worker/me"),
        ]);
        const boot = await bootRes.json();
        const me: MeResponse = await meRes.json();
        if (!me.success) {
          router.push("/worker/login");
          return;
        }
        setBootstrap(boot);
        if (me.profile) {
          setForm({
            full_name: me.profile.full_name === "Pending Worker" ? "" : me.profile.full_name,
            phone: isPendingProfilePhone(me.profile.phone) ? "" : me.profile.phone,
            whatsapp_number: me.profile.whatsapp_number ?? "",
            primary_category_id: me.profile.primary_category_id ?? "",
            locality_id: me.profile.locality_id ?? "",
            years_experience: String(me.profile.years_experience ?? 0),
          });
          setStatus(me.profile.approval_status_label);
        }
      } catch {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [router]);

  async function uploadDocument(file: File, documentType: "aadhaar_image" | "pan_image") {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("document_type", documentType);
    const res = await fetch("/api/worker/documents", { method: "POST", body: fd });
    const data = await res.json();
    if (!data.success) throw new Error(data.error?.message ?? "Upload failed");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (aadhaarFile) await uploadDocument(aadhaarFile, "aadhaar_image");
      if (panFile) await uploadDocument(panFile, "pan_image");

      const res = await fetch("/api/worker/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          years_experience: Number(form.years_experience),
          submit_for_review: true,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error?.message ?? "Save failed");
      setStatus(data.profile.approval_status_label);
      router.push("/worker/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <WorkerShell title="Profile">
        <p className="text-sm text-stone-600">Loading…</p>
      </WorkerShell>
    );
  }

  return (
    <WorkerShell title="Worker Profile">
      {status && (
        <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Status: <strong>{status}</strong>
        </p>
      )}
      <p className="text-sm text-stone-600">
        Complete your profile for Orai. Your mobile number and Aadhaar are used for
        identity verification. Home locality is for your records only — you can accept
        jobs anywhere in the city.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Full name *</span>
          <input
            required
            value={form.full_name}
            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
            className="rounded-xl border border-stone-300 bg-white px-4 py-3"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Mobile number *</span>
          <input
            required
            type="tel"
            inputMode="numeric"
            maxLength={10}
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="10-digit mobile"
            className="rounded-xl border border-stone-300 bg-white px-4 py-3"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">WhatsApp number *</span>
          <input
            required
            maxLength={10}
            value={form.whatsapp_number}
            onChange={(e) => setForm({ ...form, whatsapp_number: e.target.value })}
            className="rounded-xl border border-stone-300 bg-white px-4 py-3"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Primary category *</span>
          <select
            required
            value={form.primary_category_id}
            onChange={(e) => setForm({ ...form, primary_category_id: e.target.value })}
            className="rounded-xl border border-stone-300 bg-white px-4 py-3"
          >
            <option value="">Select category</option>
            {bootstrap?.service_categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name_en}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Home locality *</span>
          <select
            required
            value={form.locality_id}
            onChange={(e) => setForm({ ...form, locality_id: e.target.value })}
            className="rounded-xl border border-stone-300 bg-white px-4 py-3"
          >
            <option value="">Select locality</option>
            {bootstrap?.localities.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Experience (years) *</span>
          <input
            required
            type="number"
            min={0}
            max={40}
            value={form.years_experience}
            onChange={(e) => setForm({ ...form, years_experience: e.target.value })}
            className="rounded-xl border border-stone-300 bg-white px-4 py-3"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Aadhaar image * (JPEG/PNG, max 5MB)</span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => setAadhaarFile(e.target.files?.[0] ?? null)}
            className="text-sm"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">PAN image (optional)</span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => setPanFile(e.target.files?.[0] ?? null)}
            className="text-sm"
          />
        </label>

        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-teal-700 px-4 py-3 font-medium text-white disabled:opacity-60"
        >
          {saving ? "Submitting…" : "Submit for Review"}
        </button>
      </form>

      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      )}
    </WorkerShell>
  );
}
