import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { format, isToday, isSameDay } from "date-fns";

interface ContentItem {
  id: number;
  title: string;
  description?: string;
  contentType: string;
  status: string;
  assignedTo?: number;
  deadline?: string;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
}

interface ContentCalendarProps {
  contentItems: ContentItem[];
  onStatusChange: (id: number, status: string, notes?: string) => void;
  onEdit: (id: number, data: any) => void;
  onDelete: (id: number) => void;
}

export default function ContentCalendar({ contentItems, onStatusChange, onEdit, onDelete }: ContentCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [detailsOpen, setDetailsOpen] = useState(false);

  const getContentTypeColor = (type: string) => {
    switch (type) {
      case "blog":
        return "bg-blue-100 text-blue-800";
      case "social":
        return "bg-purple-100 text-purple-800";
      case "product":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "review":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-blue-100 text-blue-800";
      case "scheduled":
        return "bg-purple-100 text-purple-800";
      case "published":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Helper function to find content items with deadlines on a specific date
  const getContentItemsForDate = (date: Date) => {
    return contentItems.filter((item) => {
      if (!item.deadline) return false;
      return isSameDay(new Date(item.deadline), date);
    });
  };

  // Get content items for the selected date
  const selectedDateItems = selectedDate ? getContentItemsForDate(selectedDate) : [];

  // Create a map of dates to count of content items
  const contentItemsByDate = new Map<string, number>();
  contentItems.forEach((item) => {
    if (item.deadline) {
      const dateStr = format(new Date(item.deadline), "yyyy-MM-dd");
      const count = contentItemsByDate.get(dateStr) || 0;
      contentItemsByDate.set(dateStr, count + 1);
    }
  });

  return (
    <div className="space-y-6 w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Select Date</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
                modifiers={{
                  hasContent: (date) => {
                    const dateStr = format(date, "yyyy-MM-dd");
                    return contentItemsByDate.has(dateStr);
                  },
                }}
                modifiersStyles={{
                  hasContent: { 
                    fontWeight: "bold",
                    backgroundColor: "rgba(59, 130, 246, 0.1)" 
                  },
                }}
              />
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "No date selected"}
                {isToday(selectedDate as Date) && " (Today)"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDateItems.length > 0 ? (
                <div className="space-y-4">
                  {selectedDateItems.map((item) => (
                    <div 
                      key={item.id} 
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-md cursor-pointer hover:bg-slate-100"
                      onClick={() => setDetailsOpen(true)}
                    >
                      <div>
                        <div className="font-medium">{item.title}</div>
                        <div className="flex mt-1 space-x-2">
                          <Badge className={getContentTypeColor(item.contentType)}>
                            {item.contentType}
                          </Badge>
                          <Badge className={getStatusColor(item.status)}>
                            {item.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-slate-500">
                  No content items scheduled for this date
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Content Details</DialogTitle>
              <DialogDescription>
                View and manage content scheduled for {selectedDate ? format(selectedDate, "MMMM d, yyyy") : ""}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {selectedDateItems.map((item) => (
                <div key={item.id} className="p-4 border rounded-md">
                  <h3 className="font-medium">{item.title}</h3>
                  {item.description && (
                    <p className="mt-1 text-sm text-slate-600">{item.description}</p>
                  )}
                  <div className="flex mt-2 space-x-2">
                    <Badge className={getContentTypeColor(item.contentType)}>
                      {item.contentType}
                    </Badge>
                    <Badge className={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}