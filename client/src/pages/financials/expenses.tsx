
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { ExpensesContent } from "@/components/financials/expenses-content";

export default function FinancialsExpensesPage() {
  return (
    <DashboardShell
      title="Expenses"
      description="Monitor and manage your expenses"
    >
      <ExpensesContent />
    </DashboardShell>
  );
}
