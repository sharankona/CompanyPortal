import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
    label: string;
  };
}

export function StatCard({ title, value, icon, trend }: StatCardProps) {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-muted-foreground text-sm font-medium">{title}</span>
          <span className="p-1.5 rounded-md bg-muted text-primary">
            {icon}
          </span>
        </div>
        
        <h3 className="text-2xl font-bold">{value}</h3>
        
        {trend && (
          <p className="text-sm text-muted-foreground mt-1">
            <span className={cn(
              "inline-flex items-center",
              trend.isPositive ? "text-green-500" : "text-red-500"
            )}>
              {trend.isPositive ? (
                <TrendingUp className="mr-1" size={16} />
              ) : (
                <TrendingDown className="mr-1" size={16} />
              )}
              {Math.abs(trend.value)}%
            </span>
            {" "}
            {trend.label}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
