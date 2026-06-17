import { AdminWorkersClient } from "@/components/admin/AdminWorkersClient";

type PageProps = {
  searchParams: Promise<{ status?: string }>;
};

export default async function AdminWorkersPage({ searchParams }: PageProps) {
  const params = await searchParams;
  return <AdminWorkersClient initialStatus={params.status ?? ""} />;
}
