import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Link } from "wouter";
import { PlusCircle, UserPlus, Megaphone, Settings } from "lucide-react";

interface QuickAccessItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

export function QuickAccess() {
  const quickAccessItems: QuickAccessItem[] = [
    {
      label: "Create New Document",
      href: "/documents/new",
      icon: <PlusCircle size={18} className="text-primary" />
    },
    {
      label: "Add New User",
      href: "/users/new",
      icon: <UserPlus size={18} className="text-primary" />
    },
    {
      label: "Create Announcement",
      href: "/announcements/new",
      icon: <Megaphone size={18} className="text-primary" />
    },
    {
      label: "Settings",
      href: "/settings",
      icon: <Settings size={18} className="text-primary" />
    }
  ];

  return (
    <Card className="shadow-sm">
      <CardHeader className="px-6 py-4 border-b border-border">
        <CardTitle className="text-lg font-semibold">Quick Access</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {quickAccessItems.map((item) => (
          <Link 
            key={item.href} 
            href={item.href}
            className="flex items-center gap-3 p-2 hover:bg-accent rounded-md transition-colors"
          >
            <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center shrink-0">
              {item.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{item.label}</p>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
