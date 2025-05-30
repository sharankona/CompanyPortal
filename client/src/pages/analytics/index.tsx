import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Instagram, Linkedin, Youtube, Facebook, Twitter } from "lucide-react";
import { IconWrapper } from "@/components/ui/icon-wrapper";
import { Link } from "wouter";

export default function SocialMediaAnalyticsPage() {
  return (
    <DashboardShell 
      title="Social Media Analytics" 
      description="Track performance across all social platforms"
      backPath="/analytics"
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/analytics/social/instagram">
          <Card className="hover:border-primary cursor-pointer transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Instagram</CardTitle>
              <IconWrapper><Instagram className="h-5 w-5" /></IconWrapper>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">22.4K</div>
              <p className="text-xs text-muted-foreground">Followers</p>
              <div className="flex items-center justify-between mt-4">
                <div>
                  <p className="text-sm font-medium">524</p>
                  <p className="text-xs text-muted-foreground">New this week</p>
                </div>
                <div>
                  <p className="text-sm font-medium">4.8%</p>
                  <p className="text-xs text-muted-foreground">Engagement</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/analytics/social/linkedin">
          <Card className="hover:border-primary cursor-pointer transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">LinkedIn</CardTitle>
              <IconWrapper><Linkedin className="h-5 w-5" /></IconWrapper>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15.7K</div>
              <p className="text-xs text-muted-foreground">Followers</p>
              <div className="flex items-center justify-between mt-4">
                <div>
                  <p className="text-sm font-medium">342</p>
                  <p className="text-xs text-muted-foreground">New this week</p>
                </div>
                <div>
                  <p className="text-sm font-medium">2.6%</p>
                  <p className="text-xs text-muted-foreground">Engagement</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/analytics/social/youtube">
          <Card className="hover:border-primary cursor-pointer transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">YouTube</CardTitle>
              <IconWrapper><Youtube className="h-5 w-5" /></IconWrapper>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8.2K</div>
              <p className="text-xs text-muted-foreground">Subscribers</p>
              <div className="flex items-center justify-between mt-4">
                <div>
                  <p className="text-sm font-medium">98</p>
                  <p className="text-xs text-muted-foreground">New this week</p>
                </div>
                <div>
                  <p className="text-sm font-medium">3.2%</p>
                  <p className="text-xs text-muted-foreground">Engagement</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/analytics/social/facebook">
          <Card className="hover:border-primary cursor-pointer transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Facebook</CardTitle>
              <IconWrapper><Facebook className="h-5 w-5" /></IconWrapper>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">32.5K</div>
              <p className="text-xs text-muted-foreground">Followers</p>
              <div className="flex items-center justify-between mt-4">
                <div>
                  <p className="text-sm font-medium">214</p>
                  <p className="text-xs text-muted-foreground">New this week</p>
                </div>
                <div>
                  <p className="text-sm font-medium">1.8%</p>
                  <p className="text-xs text-muted-foreground">Engagement</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/analytics/social/twitter">
          <Card className="hover:border-primary cursor-pointer transition-colors">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">X (Twitter)</CardTitle>
              <IconWrapper><Twitter className="h-5 w-5" /></IconWrapper>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">18.9K</div>
              <p className="text-xs text-muted-foreground">Followers</p>
              <div className="flex items-center justify-between mt-4">
                <div>
                  <p className="text-sm font-medium">156</p>
                  <p className="text-xs text-muted-foreground">New this week</p>
                </div>
                <div>
                  <p className="text-sm font-medium">2.4%</p>
                  <p className="text-xs text-muted-foreground">Engagement</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Social Media Performance Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center bg-accent/30 rounded-md">
              <p className="text-muted-foreground">Social media performance comparison chart goes here</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}