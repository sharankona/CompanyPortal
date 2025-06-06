
import { Link } from "wouter";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Instagram, Linkedin, Youtube, Facebook, Twitter } from "lucide-react";

const socialPlatforms = [
  {
    name: "Instagram",
    description: "Manage your Instagram content and posts",
    icon: Instagram,
    path: "/content/social-media/instagram",
    color: "text-pink-600"
  },
  {
    name: "LinkedIn",
    description: "Professional content for LinkedIn",
    icon: Linkedin,
    path: "/content/social-media/linkedin",
    color: "text-blue-600"
  },
  {
    name: "YouTube",
    description: "Video content and YouTube channel management",
    icon: Youtube,
    path: "/content/social-media/youtube",
    color: "text-red-600"
  },
  {
    name: "Facebook",
    description: "Facebook posts and page content",
    icon: Facebook,
    path: "/content/social-media/facebook",
    color: "text-blue-700"
  },
  {
    name: "X (Twitter)",
    description: "Tweets and Twitter content",
    icon: Twitter,
    path: "/content/social-media/twitter",
    color: "text-gray-900"
  }
];

export default function SocialMediaIndex() {
  document.title = "Social Media Content | Dashboard";

  return (
    <DashboardShell title="Social Media Content" description="Manage content across all your social media platforms">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {socialPlatforms.map((platform) => {
          const IconComponent = platform.icon;
          return (
            <Link key={platform.name} to={platform.path}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4">
                    <IconComponent className={`h-12 w-12 ${platform.color}`} />
                  </div>
                  <CardTitle className="text-lg">{platform.name}</CardTitle>
                  <CardDescription>{platform.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <span className="text-sm text-muted-foreground">Click to manage content</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </DashboardShell>
  );
}
