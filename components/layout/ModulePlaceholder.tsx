import { Card } from "@/components/ui/Card";
import { PageShell } from "@/components/layout/PageShell";

type ModulePlaceholderProps = {
  title: string;
  module: string;
  sprint: string;
};

export function ModulePlaceholder({
  title,
  module,
  sprint,
}: ModulePlaceholderProps) {
  return (
    <PageShell title={title} description={`Module: ${module}`}>
      <Card title="Sprint 0 foundation">
        <p className="text-sm leading-6 text-zinc-600">
          This screen is scaffolded per KS-011. Business logic will be
          implemented in {sprint}.
        </p>
      </Card>
    </PageShell>
  );
}
