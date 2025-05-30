import { cn } from "@/lib/utils";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  changeType?: "increase" | "decrease";
  changeValue?: string;
  changeText?: string;
}

export default function StatsCard({
  title,
  value,
  icon,
  changeType,
  changeValue,
  changeText,
}: StatsCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-5 border border-slate-100">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="text-2xl font-semibold mt-1">{value}</p>
        </div>
        <div className="bg-blue-50 p-2 rounded-lg">{icon}</div>
      </div>
      {(changeValue || changeText) && (
        <div className="mt-3 flex items-center text-xs font-medium">
          {changeType && changeValue && (
            <span
              className={cn(
                "flex items-center",
                changeType === "increase" ? "text-green-500" : "text-red-500"
              )}
            >
              {changeType === "increase" ? (
                <ArrowUpIcon className="text-sm mr-1 h-3 w-3" />
              ) : (
                <ArrowDownIcon className="text-sm mr-1 h-3 w-3" />
              )}
              {changeValue}
            </span>
          )}
          {changeText && (
            <span className="text-slate-500 ml-2">{changeText}</span>
          )}
        </div>
      )}
    </div>
  );
}
