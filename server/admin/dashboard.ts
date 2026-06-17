import type { SupabaseClient } from "@supabase/supabase-js";

export async function getAdminDashboardMetrics(admin: SupabaseClient) {
  const [
    requestedJobs,
    pendingWorkers,
    openComplaints,
    duePayments,
    totalWorkers,
    totalJobs,
  ] = await Promise.all([
    admin
      .from("jobs")
      .select("*", { count: "exact", head: true })
      .eq("booking_status", "requested"),
    admin
      .from("worker_profiles")
      .select("*", { count: "exact", head: true })
      .in("approval_status", ["pending", "under_review", "draft"]),
    admin
      .from("complaints")
      .select("*", { count: "exact", head: true })
      .in("status", ["open", "under_review"]),
    admin
      .from("jobs")
      .select("*", { count: "exact", head: true })
      .in("payment_status", ["due", "customer_marked_paid"]),
    admin.from("worker_profiles").select("*", { count: "exact", head: true }),
    admin.from("jobs").select("*", { count: "exact", head: true }),
  ]);

  return {
    new_requests: requestedJobs.count ?? 0,
    pending_workers: pendingWorkers.count ?? 0,
    open_complaints: openComplaints.count ?? 0,
    pending_payments: duePayments.count ?? 0,
    total_workers: totalWorkers.count ?? 0,
    total_jobs: totalJobs.count ?? 0,
  };
}
