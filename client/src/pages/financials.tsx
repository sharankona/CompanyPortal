
// This file is deprecated. Please use the individual pages in /financials/ directory:
// - /financials/overview.tsx
// - /financials/revenue.tsx
// - /financials/expenses.tsx
// - /financials/invoices.tsx
// - /financials/budget.tsx
// - /financials/reports.tsx

import { DashboardShell } from "@/components/layout/dashboard-shell";

export default function FinancialsPage() {
  return (
    <DashboardShell
      title="Financials"
      description="Manage your financial data"
    >
      <div>Please use the specific financial pages from the menu.</div>
    </DashboardShell>
  );
}
