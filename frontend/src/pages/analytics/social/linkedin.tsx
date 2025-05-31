
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, TrendingUp, Users, MessageCircle, ThumbsUp, Share2, Eye, Linkedin } from "lucide-react";
import { IconWrapper } from "@/components/ui/icon-wrapper";

export default function LinkedInAnalyticsPage() {
  return (
    <DashboardShell
      backPath="/analytics/social"
    >
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <IconWrapper><Linkedin className="h-6 w-6" /></IconWrapper>
          LinkedIn Analytics
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Followers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15,248</div>
            <div className="text-xs text-muted-foreground mt-1">
              <span className="text-emerald-500">+5.3%</span> from last month
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
            <div className="text-2xl font-bold">3.2%</div>
            <div className="text-xs text-muted-foreground mt-1">
              <span className="text-emerald-500">+0.4%</span> from last month
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
            <div className="text-2xl font-bold">9.5K</div>
            <div className="text-xs text-muted-foreground mt-1">
              <span className="text-emerald-500">+8.7%</span> from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Unique Visitors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.3K</div>
            <div className="text-xs text-muted-foreground mt-1">
              <span className="text-emerald-500">+7.2%</span> from last month
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="posts">
        <TabsList className="mb-6">
          <TabsTrigger value="posts">Top Posts</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
          <TabsTrigger value="jobs">Job Posts</TabsTrigger>
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
                      caption: "We're excited to announce our new partnership with...",
                      engagement: { likes: "842", comments: "96", shares: "38" },
                      date: "1 week ago"
                    },
                    {
                      caption: "Join us for our upcoming webinar on industry trends...",
                      engagement: { likes: "631", comments: "73", shares: "52" },
                      date: "2 weeks ago"
                    },
                    {
                      caption: "Congratulations to our team for winning the industry award...",
                      engagement: { likes: "587", comments: "124", shares: "41" },
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
                  Performance by content type
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
                  Breakdown of your followers by industry, seniority, and location
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
                <CardTitle>Follower Growth</CardTitle>
                <CardDescription>
                  Net follower growth over the past 90 days
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <TrendingUp className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>Follower growth visualization would appear here</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="jobs">
          <Card>
            <CardHeader>
              <CardTitle>Job Post Performance</CardTitle>
              <CardDescription>
                Metrics for your LinkedIn job postings
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <Eye className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>Job post performance visualization would appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  );
}
