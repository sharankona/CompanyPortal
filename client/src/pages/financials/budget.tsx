
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { BudgetContent } from "@/components/financials/budget-content";

export default function FinancialsBudgetPage() {
  return (
    <DashboardShell
      title="Budget"
      description="Plan and track your budget allocations"
    >
      <BudgetContent />
    </DashboardShell>
  );
}
