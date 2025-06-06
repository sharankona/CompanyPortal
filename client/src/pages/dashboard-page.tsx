import Sidebar from "@/components/layout/Sidebar";
import { MobileHeader } from "@/components/mobile-header";
import { useAuth } from "@/hooks/use-auth";
import { StatCard } from "@/components/dashboard/stat-card";
import { RecentDocuments } from "@/components/dashboard/recent-documents";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { Announcements } from "@/components/dashboard/announcements";
import { QuickAccess } from "@/components/dashboard/quick-access";
import { FileText, Users, Activity, Megaphone } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Document, Activity as ActivityType, Announcement } from "@shared/schema";
import React, { useEffect } from "react";
import { useDemoNotifications } from "@/lib/demo-notifications";

interface DashboardStats {
  totalDocuments: number;
  totalUsers: number;
  activeUsers: number;
  totalAnnouncements: number;
  documentsTrend?: number;
  usersTrend?: number;
  activeUsersTrend?: number;
  announcementsTrend?: number;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { triggerDemoNotifications } = useDemoNotifications();

  useEffect(() => {
    // Trigger demo notifications when dashboard loads
    // You can comment this out if you don't want automatic notifications
    triggerDemoNotifications();
  }, []);

  // Fetch dashboard stats
  const { data: stats, isLoading: isLoadingStats } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
    refetchInterval: 30000, // Refetch every 30 seconds for more accurate active user count
  });

  // Fetch recent documents
  const { data: documents, isLoading: isLoadingDocuments } = useQuery<Document[]>({
    queryKey: ["/api/documents"],
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Fetch recent activities
  const { data: activities, isLoading: isLoadingActivities } = useQuery<ActivityType[]>({
    queryKey: ["/api/activities"],
    refetchInterval: 15000, // Refetch every 15 seconds
  });

  // Fetch announcements
  const { data: announcements, isLoading: isLoadingAnnouncements } = useQuery<Announcement[]>({
    queryKey: ["/api/announcements"],
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  return (
    <div className="flex min-h-screen">
      <main className="flex-1 min-w-0 overflow-auto">
        <MobileHeader />

        <div className="border-b border-border">
          <div className="px-6 py-5">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Welcome back, {user?.fullName}</p>
          </div>
        </div>

        <div className="p-6">
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <StatCard 
              title="Documents" 
              value={isLoadingStats ? "-" : stats?.totalDocuments.toString() || "0"} 
              icon={<FileText size={18} />} 
              trend={{ value: stats?.documentsTrend || 0, isPositive: stats?.documentsTrend ? stats.documentsTrend > 0 : true, label: "from last month" }}
            />
            <StatCard 
              title="Users" 
              value={isLoadingStats ? "-" : stats?.totalUsers.toString() || "0"} 
              icon={<Users size={18} />} 
              trend={{ value: stats?.usersTrend || 0, isPositive: stats?.usersTrend ? stats.usersTrend > 0 : true, label: "from last month" }}
            />
            <StatCard 
              title="Active Users" 
              value={isLoadingStats ? "-" : stats?.activeUsers.toString() || "0"} 
              icon={<Activity size={18} />} 
              trend={{ value: stats?.activeUsersTrend || 0, isPositive: stats?.activeUsersTrend ? stats.activeUsersTrend > 0 : true, label: "from last month" }}
            />
            <StatCard 
              title="Announcements" 
              value={isLoadingStats ? "-" : stats?.totalAnnouncements.toString() || "0"} 
              icon={<Megaphone size={18} />} 
              trend={{ value: stats?.announcementsTrend || 0, isPositive: stats?.announcementsTrend ? stats.announcementsTrend > 0 : true, label: "from last month" }}
            />
          </div>

          {/* Main Dashboard Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <RecentDocuments 
                documents={documents?.slice(0, 4) || []} 
                isLoading={isLoadingDocuments} 
              />
              <RecentActivity 
                activities={activities || []} 
                isLoading={isLoadingActivities} 
              />
            </div>

            <div className="space-y-6">
              <Announcements 
                announcements={announcements?.slice(0, 3) || []} 
                isLoading={isLoadingAnnouncements} 
              />
              <QuickAccess />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}