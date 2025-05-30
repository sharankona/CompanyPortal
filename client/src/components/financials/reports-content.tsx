import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function ReportsContent() {
  const reports = [
    { name: "Q4 2023 Financial Report", date: "2024-01-01", type: "Quarterly" },
    { name: "Annual Report 2023", date: "2024-01-15", type: "Annual" },
    { name: "Tax Report 2023", date: "2024-01-20", type: "Tax" },
    { name: "Revenue Analysis Q4", date: "2024-01-25", type: "Analysis" },
  ];

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold">Financial Reports</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {reports.map((report) => (
          <Card key={report.name} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{report.name}</h3>
                <p className="text-sm text-muted-foreground">{report.date}</p>
                <Badge className="mt-2">{report.type}</Badge>
              </div>
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}