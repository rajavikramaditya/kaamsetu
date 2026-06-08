import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/lib/constants/routes";

export default function HomePage() {
  return (
    <PageShell
      title="Trusted local help in Orai"
      description="Request verified workers for electrician, plumbing, carpentry, and more."
      actions={
        <>
          <Link href={ROUTES.public.request}>
            <Button>Request Service</Button>
          </Link>
          <Link href={ROUTES.public.track}>
            <Button variant="secondary">Track Job</Button>
          </Link>
        </>
      }
    >
      <div className="grid gap-4 md:grid-cols-3">
        <Card title="For customers">
          <p className="text-sm text-zinc-600">
            Submit a service request with an invite code and track progress
            without creating an account.
          </p>
        </Card>
        <Card title="For workers">
          <p className="mb-4 text-sm text-zinc-600">
            Complete your profile, upload documents, and accept dispatch offers.
          </p>
          <Link href={ROUTES.worker.login}>
            <Button variant="secondary">Worker Login</Button>
          </Link>
        </Card>
        <Card title="For admins">
          <p className="mb-4 text-sm text-zinc-600">
            Validate jobs, dispatch workers, confirm payments, and resolve
            complaints.
          </p>
          <Link href={ROUTES.admin.login}>
            <Button variant="ghost">Admin Login</Button>
          </Link>
        </Card>
      </div>
    </PageShell>
  );
}
