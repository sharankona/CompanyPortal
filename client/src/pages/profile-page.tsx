import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Instagram, Linkedin, Youtube, Facebook, Twitter } from "lucide-react";
import { IconWrapper } from "@/components/ui/icon-wrapper";

export default function SocialMediaAnalyticsPage() {
  const [location] = useLocation();
  const [activeTab, setActiveTab] = useState("instagram");

  // Sync tab with URL
  useEffect(() => {
    if (location.includes("instagram")) {
      setActiveTab("instagram");
    } else if (location.includes("linkedin")) {
      setActiveTab("linkedin");
    } else if (location.includes("youtube")) {
      setActiveTab("youtube");
    } else if (location.includes("facebook")) {
      setActiveTab("facebook");
    } else if (location.includes("twitter")) {
      setActiveTab("twitter");
    }
  }, [location]);

  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Social Media Analytics</h1>
          <p className="text-muted-foreground">View analytics for different social media platforms.</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="instagram" className="flex items-center gap-2">
              <IconWrapper><Instagram size={16} /></IconWrapper>
              <span className="hidden sm:inline">Instagram</span>
            </TabsTrigger>
            <TabsTrigger value="linkedin" className="flex items-center gap-2">
              <IconWrapper><Linkedin size={16} /></IconWrapper>
              <span className="hidden sm:inline">LinkedIn</span>
            </TabsTrigger>
            <TabsTrigger value="youtube" className="flex items-center gap-2">
              <IconWrapper><Youtube size={16} /></IconWrapper>
              <span className="hidden sm:inline">YouTube</span>
            </TabsTrigger>
            <TabsTrigger value="facebook" className="flex items-center gap-2">
              <IconWrapper><Facebook size={16} /></IconWrapper>
              <span className="hidden sm:inline">Facebook</span>
            </TabsTrigger>
            <TabsTrigger value="twitter" className="flex items-center gap-2">
              <IconWrapper><Twitter size={16} /></IconWrapper>
              <span className="hidden sm:inline">X (Twitter)</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="instagram" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconWrapper><Instagram /></IconWrapper>
                  Instagram Analytics
                </CardTitle>
                <CardDescription>
                  Track followers, engagement, and growth on Instagram
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Followers</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">9,745</div>
                      <p className="text-xs text-muted-foreground">+5% from last month</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Post Engagement</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">4.2%</div>
                      <p className="text-xs text-muted-foreground">+1.5% from last month</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Average Likes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">427</div>
                      <p className="text-xs text-muted-foreground">+2% from last month</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Story Views</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">1,245</div>
                      <p className="text-xs text-muted-foreground">+7% from last month</p>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Follower Growth</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[300px] flex items-center justify-center">
                    <p className="text-muted-foreground">Instagram follower growth chart will be displayed here</p>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Similar structure for other social media platforms */}
          <TabsContent value="linkedin" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconWrapper><Linkedin /></IconWrapper>
                  LinkedIn Analytics
                </CardTitle>
                <CardDescription>
                  Track connections, engagement, and company page analytics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Connections</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">3,210</div>
                      <p className="text-xs text-muted-foreground">+7% from last month</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Post Views</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">8,547</div>
                      <p className="text-xs text-muted-foreground">+12% from last month</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Profile Views</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">745</div>
                      <p className="text-xs text-muted-foreground">+5% from last month</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">3.8%</div>
                      <p className="text-xs text-muted-foreground">+0.5% from last month</p>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>LinkedIn Engagement</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[300px] flex items-center justify-center">
                    <p className="text-muted-foreground">LinkedIn engagement chart will be displayed here</p>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="youtube" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconWrapper><Youtube /></IconWrapper>
                  YouTube Analytics
                </CardTitle>
                <CardDescription>
                  Track subscribers, views, and channel performance
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[500px] flex items-center justify-center">
                <p className="text-muted-foreground">YouTube analytics will be displayed here</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="facebook" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconWrapper><Facebook /></IconWrapper>
                  Facebook Analytics
                </CardTitle>
                <CardDescription>
                  Track page likes, post reach, and audience engagement
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[500px] flex items-center justify-center">
                <p className="text-muted-foreground">Facebook analytics will be displayed here</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="twitter" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconWrapper><Twitter /></IconWrapper>
                  X (Twitter) Analytics
                </CardTitle>
                <CardDescription>
                  Track followers, tweet performance, and engagement metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[500px] flex items-center justify-center">
                <p className="text-muted-foreground">X (Twitter) analytics will be displayed here</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardShell>
  );
}