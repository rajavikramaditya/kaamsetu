import { AdminJobsClient } from "@/components/admin/AdminJobsClient";

type PageProps = {
  searchParams: Promise<{ status?: string }>;
};

export default async function AdminJobsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  return <AdminJobsClient initialStatus={params.status ?? "requested"} />;
}
