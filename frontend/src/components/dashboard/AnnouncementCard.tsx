import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

interface AnnouncementCardProps {
  title: string;
  content: string;
  author: string;
  timestamp: Date;
  isNew?: boolean;
}

export default function AnnouncementCard({
  title,
  content,
  author,
  timestamp,
  isNew = false,
}: AnnouncementCardProps) {
  return (
    <div className="border-b border-slate-100 pb-5 last:border-0 last:pb-0">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-medium text-slate-800">{title}</h4>
          <p className="text-sm text-slate-500 mt-1">{content}</p>
        </div>
        {isNew && (
          <Badge variant="outline" className="bg-blue-50 text-primary">
            New
          </Badge>
        )}
      </div>
      <div className="flex items-center mt-3 text-sm text-slate-500">
        <Clock className="text-sm mr-1 h-3 w-3" />
        <span>{formatDistanceToNow(timestamp, { addSuffix: true })}</span>
        <span className="mx-2">•</span>
        <span className="font-medium text-slate-600">{author}</span>
      </div>
    </div>
  );
}
