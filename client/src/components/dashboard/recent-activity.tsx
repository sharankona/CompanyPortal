import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Activity } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import { FileEdit, FilePlus, UserCheck, UserPlus } from "lucide-react";

interface RecentActivityProps {
  activities: Activity[];
  isLoading: boolean;
}

export function RecentActivity({ activities, isLoading }: RecentActivityProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "document_created":
        return <FilePlus size={16} className="text-primary" />;
      case "document_modified":
        return <FileEdit size={16} className="text-primary" />;
      case "user_joined":
        return <UserPlus size={16} className="text-primary" />;
      default:
        return <UserCheck size={16} className="text-primary" />;
    }
  };

  const getRelativeTime = (date: Date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="px-6 py-4 border-b border-border">
        <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {isLoading ? (
          <div className="flex justify-center p-4">
            <div className="animate-spin h-6 w-6 border-2 border-primary border-opacity-50 border-t-primary rounded-full"></div>
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            No recent activity
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex gap-4">
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                  {getActivityIcon(activity.type)}
                </div>
                <div>
                  <p className="text-sm">
                    {activity.description}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {getRelativeTime(activity.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
