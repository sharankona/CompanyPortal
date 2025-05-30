
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { RevenueContent } from "@/components/financials/revenue-content";

export default function FinancialsRevenuePage() {
  return (
    <DashboardShell
      title="Revenue"
      description="Track and manage your revenue streams"
    >
      <RevenueContent />
    </DashboardShell>
  );
}
