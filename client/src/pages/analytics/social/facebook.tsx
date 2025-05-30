
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, TrendingUp, Users, ThumbsUp, MessageCircle, Share2, Globe, Eye, Facebook } from "lucide-react";
import { IconWrapper } from "@/components/ui/icon-wrapper";

export default function FacebookAnalyticsPage() {
  return (
    <DashboardShell
      backPath="/analytics/social"
    >
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <IconWrapper><Facebook className="h-6 w-6" /></IconWrapper>
          Facebook Analytics
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Page Followers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42,817</div>
            <div className="text-xs text-muted-foreground mt-1">
              <span className="text-emerald-500">+2.8%</span> from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Page Reach
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">138.5K</div>
            <div className="text-xs text-muted-foreground mt-1">
              <span className="text-emerald-500">+7.3%</span> from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Engagement Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2%</div>
            <div className="text-xs text-muted-foreground mt-1">
              <span className="text-emerald-500">+0.6%</span> from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Page Views
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">10.3K</div>
            <div className="text-xs text-muted-foreground mt-1">
              <span className="text-emerald-500">+5.1%</span> from last month
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="posts">
        <TabsList className="mb-6">
          <TabsTrigger value="posts">Top Posts</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
          <TabsTrigger value="stories">Stories</TabsTrigger>
        </TabsList>

        <TabsContent value="posts">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Posts</CardTitle>
                <CardDescription>
                  Posts with the highest engagement in the last 30 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[
                    {
                      caption: "We're thrilled to announce the launch of our new product line...",
                      engagement: { likes: "3,754", comments: "428", shares: "256" },
                      date: "5 days ago"
                    },
                    {
                      caption: "Thank you to everyone who attended our annual conference...",
                      engagement: { likes: "2,912", comments: "374", shares: "189" },
                      date: "2 weeks ago"
                    },
                    {
                      caption: "Celebrating our team's achievement in winning the industry award...",
                      engagement: { likes: "2,586", comments: "312", shares: "203" },
                      date: "3 weeks ago"
                    }
                  ].map((post, i) => (
                    <div key={i} className="space-y-2">
                      <div className="font-medium line-clamp-2">{post.caption}</div>
                      <div className="text-sm text-muted-foreground mb-2">{post.date}</div>
                      <div className="flex gap-4">
                        <div className="flex items-center text-sm">
                          <ThumbsUp className="h-3.5 w-3.5 mr-1 text-blue-500" />
                          {post.engagement.likes}
                        </div>
                        <div className="flex items-center text-sm">
                          <MessageCircle className="h-3.5 w-3.5 mr-1 text-blue-500" />
                          {post.engagement.comments}
                        </div>
                        <div className="flex items-center text-sm">
                          <Share2 className="h-3.5 w-3.5 mr-1 text-blue-500" />
                          {post.engagement.shares}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Content Performance</CardTitle>
                <CardDescription>
                  Engagement by content type
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>Content performance visualization would appear here</p>
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
                  Age, gender, and location breakdown of your page followers
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
                <CardTitle>Fan Activity</CardTitle>
                <CardDescription>
                  When your audience is most active on Facebook
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <TrendingUp className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>Activity heatmap would appear here</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="stories">
          <Card>
            <CardHeader>
              <CardTitle>Stories Performance</CardTitle>
              <CardDescription>
                Metrics for your Facebook stories in the past 14 days
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <Eye className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>Stories performance visualization would appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  );
}
