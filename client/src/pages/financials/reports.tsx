
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { ReportsContent } from "@/components/financials/reports-content";

export default function FinancialsReportsPage() {
  return (
    <DashboardShell
      title="Financial Reports"
      description="Generate and view financial reports"
    >
      <ReportsContent />
    </DashboardShell>
  );
}
