import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { Instagram, Linkedin, Youtube, Facebook, Twitter } from "lucide-react";
import { IconWrapper } from "@/components/ui/icon-wrapper";
import { TrendingUp, BarChart, Users, Eye } from "lucide-react";
import AnalyticsLayout from "@/components/layout/AnalyticsLayout";

const bestPerformingPosts = [
  {
    platform: "Instagram",
    icon: <IconWrapper><Instagram className="h-4 w-4" /></IconWrapper>,
    content: "Our new office space is finally ready! #newbeginnings",
    engagement: "2,468 likes • 143 comments",
    date: "2 weeks ago"
  },
  {
    platform: "LinkedIn",
    icon: <IconWrapper><Linkedin className="h-4 w-4" /></IconWrapper>,
    content: "We're excited to announce our new partnership with...",
    engagement: "842 likes • 96 comments • 38 shares",
    date: "1 week ago"
  },
  {
    platform: "Facebook",
    icon: <IconWrapper><Facebook className="h-4 w-4" /></IconWrapper>,
    content: "Join us for our upcoming product launch event on March 25th!",
    engagement: "1,235 likes • 87 comments • 63 shares",
    date: "3 days ago"
  }
];

export default function SocialMediaMainPage() {
  const platforms = [
    {
      name: "Instagram",
      icon: <IconWrapper><Instagram className="h-5 w-5" /></IconWrapper>,
      color: "bg-gray-100",
      textColor: "text-gray-900",
      followers: "24.8K",
      engagement: "5.7%",
      growth: "+3.2%",
      path: "/analytics/social/instagram"
    },
    {
      name: "LinkedIn",
      icon: <IconWrapper><Linkedin className="h-5 w-5" /></IconWrapper>,
      color: "bg-gray-100",
      textColor: "text-gray-900",
      followers: "15.2K",
      engagement: "3.2%",
      growth: "+5.3%",
      path: "/analytics/social/linkedin"
    },
    {
      name: "YouTube",
      icon: <IconWrapper><Youtube className="h-5 w-5" /></IconWrapper>,
      color: "bg-gray-100",
      textColor: "text-gray-900",
      followers: "8.7K",
      engagement: "4.1%",
      growth: "+2.8%",
      path: "/analytics/social/youtube"
    },
    {
      name: "Facebook",
      icon: <IconWrapper><Facebook className="h-5 w-5" /></IconWrapper>,
      color: "bg-gray-100",
      textColor: "text-gray-900",
      followers: "32.5K",
      engagement: "2.9%",
      growth: "+1.7%",
      path: "/analytics/social/facebook"
    },
    {
      name: "X (Twitter)",
      icon: <IconWrapper><Twitter className="h-5 w-5" /></IconWrapper>,
      color: "bg-gray-100",
      textColor: "text-gray-900",
      followers: "18.3K",
      engagement: "1.8%",
      growth: "+0.9%",
      path: "/analytics/social/twitter"
    }
  ];

  const overallStats = [
    {
      name: "Total Followers",
      value: "99.5K",
      change: "+2.8%",
      icon: <Users className="h-5 w-5 text-gray-500" />
    },
    {
      name: "Average Engagement",
      value: "3.5%",
      change: "+0.7%",
      icon: <TrendingUp className="h-5 w-5 text-gray-500" />
    },
    {
      name: "Total Impressions",
      value: "1.2M",
      change: "+15.3%",
      icon: <Eye className="h-5 w-5 text-gray-500" />
    },
    {
      name: "Content Published",
      value: "427",
      change: "+34",
      icon: <BarChart className="h-5 w-5 text-gray-500" />
    }
  ];

  return (
    <AnalyticsLayout>
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Social Media Analytics</h1>
          <p className="text-muted-foreground">
            Performance metrics across all your social media platforms
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-10">
          {overallStats.map((stat, i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  {stat.icon}
                  {stat.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  <span className="text-emerald-500">{stat.change}</span> this month
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <h2 className="text-xl font-semibold mb-6">Platforms</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {platforms.map((platform, i) => (
            <Link key={i} href={platform.path}>
              <Card className="cursor-pointer transition-all duration-200 hover:shadow-md">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${platform.color} hover:bg-gray-200`}>
                      <div className="text-gray-600">{platform.icon}</div>
                    </div>
                    <CardTitle className={`text-lg ${platform.textColor}`}>{platform.name}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Followers</p>
                      <p className="font-semibold">{platform.followers}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Engagement</p>
                      <p className="font-semibold">{platform.engagement}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Growth</p>
                      <p className="font-semibold text-emerald-500">{platform.growth}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <h2 className="text-xl font-semibold mt-10 mb-6">Top Performing Content</h2>
        <Card>
          <CardHeader>
            <CardTitle>Best Performing Posts</CardTitle>
            <CardDescription>Top posts across all platforms in the last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {bestPerformingPosts.map((post, i) => (
                <div key={i} className="flex items-start gap-3 pb-6 border-b last:border-b-0 last:pb-0">
                  <div className="pt-0.5">
                    {post.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{post.platform}</span>
                      <span className="text-sm text-muted-foreground">{post.date}</span>
                    </div>
                    <p className="mb-2">{post.content}</p>
                    <p className="text-sm text-muted-foreground">{post.engagement}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AnalyticsLayout>
  );
}