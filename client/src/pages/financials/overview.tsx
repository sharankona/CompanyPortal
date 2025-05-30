
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { OverviewContent } from "@/components/financials/overview-content";

export default function FinancialsOverviewPage() {
  return (
    <DashboardShell
      title="Financial Overview"
      description="Overview of your financial metrics and performance"
    >
      <OverviewContent />
    </DashboardShell>
  );
}
