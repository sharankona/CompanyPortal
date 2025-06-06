
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, TrendingUp, Users, ThumbsUp, MessageCircle, Clock, Eye, Video, Youtube } from "lucide-react";
import { IconWrapper } from "@/components/ui/icon-wrapper";

export default function YouTubeAnalyticsPage() {
  return (
    <DashboardShell
      backPath="/analytics/social"
    >
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <IconWrapper><Youtube className="h-6 w-6" /></IconWrapper>
          YouTube Analytics
        </h2>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Subscribers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">36,742</div>
            <div className="text-xs text-muted-foreground mt-1">
              <span className="text-emerald-500">+4.6%</span> from last month
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Video className="h-4 w-4" />
              Total Videos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">214</div>
            <div className="text-xs text-muted-foreground mt-1">
              <span className="text-emerald-500">+7</span> new this month
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Total Views
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.8M</div>
            <div className="text-xs text-muted-foreground mt-1">
              <span className="text-emerald-500">+11.2%</span> from last month
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Watch Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">127.5K hrs</div>
            <div className="text-xs text-muted-foreground mt-1">
              <span className="text-emerald-500">+9.8%</span> from last month
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="videos">
        <TabsList className="mb-6">
          <TabsTrigger value="videos">Top Videos</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
        </TabsList>
        
        <TabsContent value="videos">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Videos</CardTitle>
                <CardDescription>
                  Videos with the highest views in the last 30 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[
                    {
                      title: "Complete Guide: How to Optimize Your Workflow",
                      stats: { views: "143.2K", likes: "9.8K", comments: "856" },
                      duration: "18:24",
                      date: "2 weeks ago"
                    },
                    {
                      title: "Behind the Scenes: Product Development Process",
                      stats: { views: "98.7K", likes: "7.4K", comments: "612" },
                      duration: "24:16",
                      date: "3 weeks ago"
                    },
                    {
                      title: "Top 10 Industry Trends for Next Year",
                      stats: { views: "87.3K", likes: "6.9K", comments: "745" },
                      duration: "15:42",
                      date: "1 month ago"
                    }
                  ].map((video, i) => (
                    <div key={i} className="space-y-2">
                      <div className="font-medium line-clamp-2">{video.title}</div>
                      <div className="text-sm text-muted-foreground mb-2">
                        {video.date} • {video.duration}
                      </div>
                      <div className="flex gap-4">
                        <div className="flex items-center text-sm">
                          <Eye className="h-3.5 w-3.5 mr-1 text-gray-500" />
                          {video.stats.views}
                        </div>
                        <div className="flex items-center text-sm">
                          <ThumbsUp className="h-3.5 w-3.5 mr-1 text-red-500" />
                          {video.stats.likes}
                        </div>
                        <div className="flex items-center text-sm">
                          <MessageCircle className="h-3.5 w-3.5 mr-1 text-blue-500" />
                          {video.stats.comments}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Video Performance by Category</CardTitle>
                <CardDescription>
                  View counts by video category
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>Video category performance visualization would appear here</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="audience">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Audience Demographics</CardTitle>
                <CardDescription>
                  Age, gender, and location breakdown of your viewers
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>Demographics visualization would appear here</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Viewer Activity</CardTitle>
                <CardDescription>
                  When your audience watches your content
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <TrendingUp className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>Activity timeline visualization would appear here</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="engagement">
          <Card>
            <CardHeader>
              <CardTitle>Engagement Metrics</CardTitle>
              <CardDescription>
                Like, comment, and share rates for your content
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>Engagement metrics visualization would appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  );
}
