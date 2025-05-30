import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import StatsCard from "@/components/dashboard/StatsCard";
import AnnouncementCard from "@/components/dashboard/AnnouncementCard";
import EventCard from "@/components/dashboard/EventCard";
import DocumentsTable, { DocumentItem } from "@/components/dashboard/DocumentsTable";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { 
  FileText, 
  Calendar as CalendarIcon, 
  Megaphone, 
  Users 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { LoadingState } from "@/components/ui/loading-state";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const { data: documents, isLoading: isLoadingDocuments } = useQuery({
    queryKey: ["/api/documents"],
    select: (data: any) => {
      // Format for DocumentsTable component
      return data.slice(0, 4).map((doc: any) => ({
        id: doc.id,
        name: doc.name,
        type: doc.type,
        uploadedBy: {
          name: doc.uploadedById === user?.id ? user.fullName : "Unknown User",
          initials: (doc.uploadedById === user?.id ? user.fullName : "Unknown User")
            .split(" ")
            .map((n: string) => n[0])
            .join("")
            .toUpperCase(),
        },
        date: new Date(doc.createdAt),
      }));
    },
  });

  const { data: announcements, isLoading: isLoadingAnnouncements } = useQuery({
    queryKey: ["/api/announcements"],
    select: (data: any) => {
      return data.slice(0, 3);
    },
  });

  const { data: events, isLoading: isLoadingEvents } = useQuery({
    queryKey: ["/api/events"],
    select: (data: any) => {
      return data
        .filter((event: any) => new Date(event.startDate) >= new Date())
        .sort((a: any, b: any) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
        .slice(0, 3);
    },
  });

  const { data: employeesCount } = useQuery({
    queryKey: ["/api/users"],
    select: (data: any) => data.length,
  });

  const handleDocumentDownload = (id: number) => {
    toast({
      title: "Download started",
      description: "Your document is being downloaded...",
    });
  };

  const handleDocumentView = (id: number) => {
    toast({
      title: "Opening document",
      description: "The document viewer is opening...",
    });
  };

  return (
    <LoadingState loading={loading}>
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-slate-800">Dashboard</h2>
          <p className="text-slate-500 mt-1">
            Welcome back, {user?.fullName || "Guest"}! Here's what's happening today.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <StatsCard
            title="New Documents"
            value={isLoadingDocuments ? "..." : documents?.length || 0}
            icon={<FileText className="h-5 w-5 text-primary" />}
            changeType="increase"
            changeValue="12%"
            changeText="from last week"
          />
          <StatsCard
            title="Upcoming Events"
            value={isLoadingEvents ? "..." : events?.length || 0}
            icon={<CalendarIcon className="h-5 w-5 text-primary" />}
            changeText={`${events?.length || 0} events this week`}
          />
          <StatsCard
            title="Announcements"
            value={isLoadingAnnouncements ? "..." : announcements?.length || 0}
            icon={<Megaphone className="h-5 w-5 text-primary" />}
            changeType="decrease"
            changeValue="3%"
            changeText="from last week"
          />
          <StatsCard
            title="Team Members"
            value={employeesCount || 0}
            icon={<Users className="h-5 w-5 text-primary" />}
            changeType="increase"
            changeValue="2"
            changeText="new this month"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Announcements */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-slate-100">
            <div className="p-5 border-b border-slate-100">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-slate-800">Recent Announcements</h3>
                <Link href="/news">
                  <Button variant="link" className="text-primary text-sm font-medium hover:text-primary-dark">
                    View All
                  </Button>
                </Link>
              </div>
            </div>
            <div className="p-5 space-y-5">
              {isLoadingAnnouncements ? (
                <p className="text-sm text-slate-500">Loading announcements...</p>
              ) : announcements && announcements.length > 0 ? (
                announcements.map((announcement: any) => (
                  <AnnouncementCard
                    key={announcement.id}
                    title={announcement.title}
                    content={announcement.content}
                    author={announcement.authorId === user?.id ? user.fullName : "HR Department"}
                    timestamp={new Date(announcement.createdAt)}
                    isNew={new Date(announcement.createdAt) > new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)}
                  />
                ))
              ) : (
                <p className="text-sm text-slate-500">No announcements found.</p>
              )}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-100">
            <div className="p-5 border-b border-slate-100">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-slate-800">Upcoming Events</h3>
                <Link href="/calendar">
                  <Button variant="link" className="text-primary text-sm font-medium hover:text-primary-dark">
                    View Calendar
                  </Button>
                </Link>
              </div>
            </div>
            <div className="p-5 space-y-4">
              {isLoadingEvents ? (
                <p className="text-sm text-slate-500">Loading events...</p>
              ) : events && events.length > 0 ? (
                events.map((event: any) => (
                  <EventCard
                    key={event.id}
                    title={event.title}
                    startDate={new Date(event.startDate)}
                    endDate={new Date(event.endDate)}
                    location={event.location}
                  />
                ))
              ) : (
                <p className="text-sm text-slate-500">No upcoming events.</p>
              )}

              <Link href="/calendar">
                <Button variant="ghost" className="w-full mt-3 text-center py-2 text-sm font-medium text-primary hover:bg-primary-50 rounded-md">
                  + Add Event
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Documents */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-slate-100">
          <div className="p-5 border-b border-slate-100">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-slate-800">Recent Documents</h3>
              <Link href="/documents">
                <Button variant="link" className="text-primary text-sm font-medium hover:text-primary-dark">
                  View All Documents
                </Button>
              </Link>
            </div>
          </div>
          {isLoadingDocuments ? (
            <div className="p-5">
              <p className="text-sm text-slate-500">Loading documents...</p>
            </div>
          ) : documents && documents.length > 0 ? (
            <DocumentsTable
              documents={documents as DocumentItem[]}
              onDownload={handleDocumentDownload}
              onView={handleDocumentView}
            />
          ) : (
            <div className="p-5">
              <p className="text-sm text-slate-500">No documents found.</p>
            </div>
          )}
          <div className="px-4 py-3 border-t border-slate-100 text-right">
            <Link href="/documents">
              <Button variant="outline" className="inline-flex items-center px-4 py-2 border border-primary-300 text-sm font-medium rounded-md text-primary bg-white hover:bg-primary-50">
                <FileText className="h-4 w-4 mr-2" />
                Upload Document
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </LoadingState>
  )
}