
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, TrendingUp, Users, MessageCircle, Repeat, Heart, Globe, Twitter } from "lucide-react";
import { IconWrapper } from "@/components/ui/icon-wrapper";

export default function TwitterAnalyticsPage() {
  return (
    <DashboardShell
      backPath="/analytics/social"
    >
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <IconWrapper><Twitter className="h-6 w-6" /></IconWrapper>
          Twitter Analytics
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
            <div className="text-2xl font-bold">32,546</div>
            <div className="text-xs text-muted-foreground mt-1">
              <span className="text-emerald-500">+3.7%</span> from last month
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Impressions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">563.8K</div>
            <div className="text-xs text-muted-foreground mt-1">
              <span className="text-emerald-500">+12.5%</span> from last month
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Mentions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">427</div>
            <div className="text-xs text-muted-foreground mt-1">
              <span className="text-emerald-500">+8.3%</span> from last month
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
            <div className="text-2xl font-bold">3.8%</div>
            <div className="text-xs text-muted-foreground mt-1">
              <span className="text-emerald-500">+0.7%</span> from last month
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="tweets">
        <TabsList className="mb-6">
          <TabsTrigger value="tweets">Top Tweets</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
          <TabsTrigger value="hashtags">Hashtags</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tweets">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Tweets</CardTitle>
                <CardDescription>
                  Tweets with the highest engagement in the last 30 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[
                    {
                      content: "We're excited to announce our new partnership with @company to bring innovative solutions to the market...",
                      engagement: { likes: "1,254", retweets: "342", replies: "98" },
                      date: "3 days ago"
                    },
                    {
                      content: "Join us for our upcoming webinar on industry trends. Register now to secure your spot!",
                      engagement: { likes: "876", retweets: "214", replies: "62" },
                      date: "1 week ago"
                    },
                    {
                      content: "Proud to share that our team has been recognized with the prestigious industry award for innovation...",
                      engagement: { likes: "965", retweets: "287", replies: "74" },
                      date: "2 weeks ago"
                    }
                  ].map((tweet, i) => (
                    <div key={i} className="space-y-2">
                      <div className="font-medium line-clamp-2">{tweet.content}</div>
                      <div className="text-sm text-muted-foreground mb-2">{tweet.date}</div>
                      <div className="flex gap-4">
                        <div className="flex items-center text-sm">
                          <Heart className="h-3.5 w-3.5 mr-1 text-pink-500" />
                          {tweet.engagement.likes}
                        </div>
                        <div className="flex items-center text-sm">
                          <Repeat className="h-3.5 w-3.5 mr-1 text-green-500" />
                          {tweet.engagement.retweets}
                        </div>
                        <div className="flex items-center text-sm">
                          <MessageCircle className="h-3.5 w-3.5 mr-1 text-blue-500" />
                          {tweet.engagement.replies}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Tweet Performance</CardTitle>
                <CardDescription>
                  Tweet engagement metrics over time
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>Tweet performance visualization would appear here</p>
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
                  Interests, locations, and activity of your followers
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
        
        <TabsContent value="hashtags">
          <Card>
            <CardHeader>
              <CardTitle>Top Hashtags</CardTitle>
              <CardDescription>
                Most effective hashtags used in your tweets
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>Hashtag performance visualization would appear here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  );
}
