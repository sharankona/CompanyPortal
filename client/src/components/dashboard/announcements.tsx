import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Announcement } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import { Link } from "wouter";

interface AnnouncementsProps {
  announcements: Announcement[];
  isLoading: boolean;
}

export function Announcements({ announcements, isLoading }: AnnouncementsProps) {
  const getCategoryBadge = (category: string) => {
    const categoryClasses = {
      company: "bg-primary text-primary-foreground",
      important: "bg-red-500 text-white",
      hr: "bg-blue-500 text-white",
    };
    
    return (
      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${categoryClasses[category as keyof typeof categoryClasses]} mb-3`}>
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </span>
    );
  };

  const getRelativeTime = (date: Date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="px-6 py-4 border-b border-border flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Announcements</CardTitle>
        <Link href="/announcements" className="text-sm text-primary hover:underline">
          View all
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin h-6 w-6 border-2 border-primary border-opacity-50 border-t-primary rounded-full"></div>
          </div>
        ) : announcements.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No announcements
          </div>
        ) : (
          <div className="divide-y divide-border">
            {announcements.map((announcement) => (
              <div key={announcement.id} className="p-6">
                {getCategoryBadge(announcement.category)}
                <h3 className="font-medium">{announcement.title}</h3>
                <p className="text-sm text-muted-foreground mt-1 mb-3">
                  {announcement.content}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {getRelativeTime(announcement.createdAt)}
                  </span>
                  <span className="text-xs font-medium">
                    {announcement.createdById}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
