import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Instagram, ArrowUpRight, Users, Image, MessageCircle, Eye } from "lucide-react";
import { IconWrapper } from "@/components/ui/icon-wrapper";

export default function InstagramAnalyticsPage() {
  return (
    <DashboardShell
      backPath="/analytics/social"
    >
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <IconWrapper><Instagram className="h-6 w-6" /></IconWrapper>
          Instagram Analytics
        </h2>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Followers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">22,431</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 text-green-500">
                  <ArrowUpRight className="h-3 w-3" /> 
                  +524 this month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Posts</CardTitle>
                <Image className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">342</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 text-green-500">
                  <ArrowUpRight className="h-3 w-3" /> 
                  +15 this month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Comments</CardTitle>
                <MessageCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4,128</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 text-green-500">
                  <ArrowUpRight className="h-3 w-3" /> 
                  +283 this month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Impressions</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1.2M</div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 text-green-500">
                  <ArrowUpRight className="h-3 w-3" /> 
                  +18% from last month
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Follower Growth</CardTitle>
                <CardDescription>Daily follower increase over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center bg-accent/30 rounded-md">
                <p className="text-muted-foreground">Follower growth chart visualization goes here</p>
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Top Posts</CardTitle>
                <CardDescription>Your most engaging Instagram content</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <div className="space-y-4">
                  {[
                    { title: "Product launch announcement", likes: "1,245", comments: "86" },
                    { title: "Behind the scenes video", likes: "983", comments: "42" },
                    { title: "Customer testimonial", likes: "756", comments: "28" },
                    { title: "Team spotlight", likes: "632", comments: "19" }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-16 h-16 bg-accent rounded-md flex items-center justify-center">
                        <Image className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div>
                        <div className="font-medium">{item.title}</div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span>{item.likes} likes</span>
                          <span>{item.comments} comments</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="audience" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Audience Demographics</CardTitle>
              <CardDescription>Information about your Instagram followers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center bg-accent/30 rounded-md">
                <p className="text-muted-foreground">Audience demographics visualization goes here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Content Performance</CardTitle>
              <CardDescription>How your Instagram posts are performing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center bg-accent/30 rounded-md">
                <p className="text-muted-foreground">Content performance visualization goes here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Engagement Metrics</CardTitle>
              <CardDescription>How users interact with your Instagram content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center bg-accent/30 rounded-md">
                <p className="text-muted-foreground">Engagement metrics visualization goes here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  );
}