import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { AlertTriangle } from "lucide-react";

interface NewsCardProps {
  id: number;
  title: string;
  content: string;
  author: {
    name: string;
    initials: string;
    department: string;
  };
  createdAt: Date;
  isImportant?: boolean;
  department?: string;
}

export default function NewsCard({
  id,
  title,
  content,
  author,
  createdAt,
  isImportant = false,
  department,
}: NewsCardProps) {
  return (
    <Card className={isImportant ? "border-yellow-300 shadow-md" : ""}>
      {isImportant && (
        <div className="bg-yellow-50 px-4 py-2 border-b border-yellow-200 flex items-center">
          <AlertTriangle className="h-4 w-4 text-yellow-600 mr-2" />
          <span className="text-sm font-medium text-yellow-800">Important Announcement</span>
        </div>
      )}
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1.5">
            <h3 className="font-semibold text-lg text-slate-800">{title}</h3>
            {department && (
              <Badge variant="outline" className="bg-blue-50 text-blue-600">
                {department}
              </Badge>
            )}
          </div>
          <div className="text-xs text-slate-500">
            {formatDistanceToNow(createdAt, { addSuffix: true })}
          </div>
        </div>
        
        <div className="mt-4">
          <p className="text-slate-600 whitespace-pre-line">{content}</p>
        </div>
      </CardContent>
      <CardFooter className="border-t border-slate-100 pt-4 pb-4">
        <div className="flex items-center">
          <Avatar className="h-8 w-8 mr-2">
            <AvatarFallback>{author.initials}</AvatarFallback>
          </Avatar>
          <div className="text-sm">
            <p className="font-medium text-slate-700">{author.name}</p>
            <p className="text-slate-500">{author.department}</p>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
