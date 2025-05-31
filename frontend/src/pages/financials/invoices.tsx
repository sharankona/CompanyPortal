
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { InvoicesContent } from "@/components/financials/invoices-content";

export default function FinancialsInvoicesPage() {
  return (
    <DashboardShell
      title="Invoices"
      description="Manage your invoices and billing"
    >
      <InvoicesContent />
    </DashboardShell>
  );
}
