
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { BarChart, Globe, Instagram, Facebook, Linkedin, Twitter, Youtube } from "lucide-react";
import { IconWrapper } from "@/components/ui/icon-wrapper";

export default function AnalyticsPage() {
  return (
    <DashboardShell
      title="Analytics"
      description="Track and analyze performance metrics across platforms"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="hover:border-primary transition-colors">
          <Link href="/analytics/website">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Website Analytics</CardTitle>
                <Globe className="h-5 w-5 text-blue-500" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Track website performance, visitors, and engagement metrics.</p>
              <div className="mt-4 flex justify-between items-center text-sm">
                <div>
                  <p className="font-medium">25.4K</p>
                  <p className="text-xs text-muted-foreground">Visitors</p>
                </div>
                <div>
                  <p className="font-medium">142.5K</p>
                  <p className="text-xs text-muted-foreground">Page Views</p>
                </div>
                <div>
                  <p className="font-medium">38.2%</p>
                  <p className="text-xs text-muted-foreground">Bounce Rate</p>
                </div>
              </div>
            </CardContent>
          </Link>
        </Card>

        <Card className="hover:border-primary transition-colors">
          <Link href="/analytics/social">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Social Media Analytics</CardTitle>
                <div className="flex space-x-1">
                  <IconWrapper><Instagram className="h-4 w-4" /></IconWrapper>
                  <IconWrapper><Facebook className="h-4 w-4" /></IconWrapper>
                  <IconWrapper><Twitter className="h-4 w-4" /></IconWrapper>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Monitor performance across all social media platforms.</p>
              <div className="mt-4 flex justify-between items-center text-sm">
                <div>
                  <p className="font-medium">97.8K</p>
                  <p className="text-xs text-muted-foreground">Total Followers</p>
                </div>
                <div>
                  <p className="font-medium">1,334</p>
                  <p className="text-xs text-muted-foreground">New This Month</p>
                </div>
                <div>
                  <p className="font-medium">3.2%</p>
                  <p className="text-xs text-muted-foreground">Avg. Engagement</p>
                </div>
              </div>
            </CardContent>
          </Link>
        </Card>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Performance Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center bg-accent/30 rounded-md">
              <p className="text-muted-foreground">Performance analytics chart goes here</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
