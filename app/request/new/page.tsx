"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { CustomerShell } from "@/components/customer/CustomerShell";
import {
  patchCustomerSession,
  readCustomerSession,
} from "@/lib/customer/session";
import { saveRequestToDevice } from "@/lib/customer/saved-requests";

type BootstrapCategory = {
  id: string;
  name_en: string;
  requires_shift_fields: boolean;
};

type BootstrapLocality = {
  id: string;
  name: string;
};

const TIME_SLOTS = [
  { value: "morning", label: "Morning (8 AM – 12 PM)" },
  { value: "afternoon", label: "Afternoon (12 PM – 5 PM)" },
  { value: "evening", label: "Evening (5 PM – 8 PM)" },
  { value: "anytime", label: "Anytime" },
] as const;

export default function NewRequestPage() {
  const router = useRouter();
  const [inviteCode, setInviteCode] = useState("");
  const [categories, setCategories] = useState<BootstrapCategory[]>([]);
  const [localities, setLocalities] = useState<BootstrapLocality[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    alternate_phone: "",
    locality_id: "",
    address_text: "",
    landmark: "",
    service_category_id: "",
    description: "",
    preferred_date: "",
    preferred_time_slot: "anytime" as string,
    payment_preference: "either" as string,
    workers_needed: "",
    shift_type: "" as string,
  });

  const selectedCategory = categories.find((c) => c.id === form.service_category_id);
  const needsShiftFields = selectedCategory?.requires_shift_fields ?? false;

  useEffect(() => {
    const session = readCustomerSession();
    if (!session?.invite_code) {
      router.replace("/request");
      return;
    }
    setInviteCode(session.invite_code);

    fetch("/api/public/bootstrap")
      .then((r) => r.json())
      .then((boot) => {
        setCategories(boot.service_categories ?? []);
        setLocalities(boot.localities ?? []);
      })
      .catch(() => setError("Failed to load form options"))
      .finally(() => setLoading(false));
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const payload: Record<string, unknown> = {
        invite_code: inviteCode,
        full_name: form.full_name,
        phone: form.phone,
        locality_id: form.locality_id,
        service_category_id: form.service_category_id,
        preferred_time_slot: form.preferred_time_slot,
        payment_preference: form.payment_preference,
      };

      if (form.address_text.trim()) payload.address_text = form.address_text.trim();
      if (form.description.trim()) payload.description = form.description.trim();
      if (form.alternate_phone) payload.alternate_phone = form.alternate_phone;
      if (form.landmark) payload.landmark = form.landmark;
      if (form.preferred_date) payload.preferred_date = form.preferred_date;

      if (needsShiftFields && form.workers_needed) {
        payload.workers_needed = Number(form.workers_needed);
      }
      if (needsShiftFields && form.shift_type) {
        payload.shift_type = form.shift_type;
      }

      const res = await fetch("/api/public/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error?.message ?? "Request failed");
      }

      patchCustomerSession({
        job_ref: data.job_ref,
        public_id: data.public_id,
        track_code: data.track_code,
        phone: form.phone.replace(/\D/g, "").slice(-10),
      });

      const categoryName =
        categories.find((c) => c.id === form.service_category_id)?.name_en ?? "Service";
      const localityName =
        localities.find((l) => l.id === form.locality_id)?.name ?? "Locality";

      saveRequestToDevice({
        job_ref: data.job_ref,
        public_id: data.public_id,
        track_code: data.track_code,
        phone: form.phone.replace(/\D/g, "").slice(-10),
        category: categoryName,
        locality: localityName,
        created_at: new Date().toISOString(),
      });

      router.push("/request/success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <CustomerShell title="New Request" active="request">
        <p className="text-sm text-stone-600">Loading…</p>
      </CustomerShell>
    );
  }

  return (
    <CustomerShell title="New Request" active="request">
      <p className="rounded-xl bg-teal-50 px-4 py-3 text-sm text-teal-900">
        Invite: <strong>{inviteCode}</strong>
      </p>

      <p className="text-sm text-stone-600">
        Only name, mobile, service, and locality are required. Add more details if you have
        them — our team can call you for the rest.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Your name *</span>
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
          <span className="font-medium">Alternate phone (optional)</span>
          <input
            type="tel"
            inputMode="numeric"
            maxLength={10}
            value={form.alternate_phone}
            onChange={(e) => setForm({ ...form, alternate_phone: e.target.value })}
            className="rounded-xl border border-stone-300 bg-white px-4 py-3"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Service needed *</span>
          <select
            required
            value={form.service_category_id}
            onChange={(e) =>
              setForm({ ...form, service_category_id: e.target.value })
            }
            className="rounded-xl border border-stone-300 bg-white px-4 py-3"
          >
            <option value="">Select service</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name_en}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Locality *</span>
          <select
            required
            value={form.locality_id}
            onChange={(e) => setForm({ ...form, locality_id: e.target.value })}
            className="rounded-xl border border-stone-300 bg-white px-4 py-3"
          >
            <option value="">Select locality</option>
            {localities.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Full address (optional)</span>
          <textarea
            rows={3}
            value={form.address_text}
            onChange={(e) => setForm({ ...form, address_text: e.target.value })}
            placeholder="House no., street, area — we can call for this"
            className="rounded-xl border border-stone-300 bg-white px-4 py-3"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Landmark (optional)</span>
          <input
            value={form.landmark}
            onChange={(e) => setForm({ ...form, landmark: e.target.value })}
            className="rounded-xl border border-stone-300 bg-white px-4 py-3"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Describe the issue (optional)</span>
          <textarea
            rows={4}
            maxLength={500}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="What needs to be done? — or tell us on a call"
            className="rounded-xl border border-stone-300 bg-white px-4 py-3"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Preferred date (optional)</span>
          <input
            type="date"
            value={form.preferred_date}
            onChange={(e) => setForm({ ...form, preferred_date: e.target.value })}
            className="rounded-xl border border-stone-300 bg-white px-4 py-3"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Preferred time (optional)</span>
          <select
            value={form.preferred_time_slot}
            onChange={(e) =>
              setForm({ ...form, preferred_time_slot: e.target.value })
            }
            className="rounded-xl border border-stone-300 bg-white px-4 py-3"
          >
            {TIME_SLOTS.map((slot) => (
              <option key={slot.value} value={slot.value}>
                {slot.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Payment preference (optional)</span>
          <select
            value={form.payment_preference}
            onChange={(e) =>
              setForm({ ...form, payment_preference: e.target.value })
            }
            className="rounded-xl border border-stone-300 bg-white px-4 py-3"
          >
            <option value="either">Cash or UPI</option>
            <option value="cash">Cash only</option>
            <option value="upi">UPI only</option>
          </select>
        </label>

        {needsShiftFields && (
          <>
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium">Workers needed (optional)</span>
              <input
                type="number"
                min={1}
                max={20}
                value={form.workers_needed}
                onChange={(e) =>
                  setForm({ ...form, workers_needed: e.target.value })
                }
                className="rounded-xl border border-stone-300 bg-white px-4 py-3"
              />
            </label>

            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium">Shift type (optional)</span>
              <select
                value={form.shift_type}
                onChange={(e) => setForm({ ...form, shift_type: e.target.value })}
                className="rounded-xl border border-stone-300 bg-white px-4 py-3"
              >
                <option value="">Select shift</option>
                <option value="half_day">Half day</option>
                <option value="full_day">Full day</option>
              </select>
            </label>
          </>
        )}

        {error && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="rounded-full bg-teal-700 px-6 py-3 text-sm font-medium text-white disabled:opacity-60"
        >
          {submitting ? "Submitting…" : "Submit Request"}
        </button>
      </form>

      <Link
        href="/request"
        className="text-center text-sm text-teal-700 underline-offset-4 hover:underline"
      >
        ← Change invite code
      </Link>
    </CustomerShell>
  );
}
