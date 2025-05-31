import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  Users,
  FileText,
  Newspaper,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function MobileNavigation() {
  const [location] = useLocation();

  const navItems = [
    {
      href: "/",
      label: "Dashboard",
      icon: <LayoutDashboard className="text-xl" />,
    },
    {
      href: "/employees",
      label: "Employees",
      icon: <Users className="text-xl" />,
    },
    {
      href: "/documents",
      label: "Documents",
      icon: <FileText className="text-xl" />,
    },
    {
      href: "/news",
      label: "News",
      icon: <Newspaper className="text-xl" />,
    },
    {
      href: "/more",
      label: "More",
      icon: <MoreHorizontal className="text-xl" />,
    },
  ];

  return (
    <nav className="fixed bottom-0 w-full bg-white shadow-lg flex justify-around items-center h-16 lg:hidden z-40">
      {navItems.map((item) => (
        <Link key={item.href} href={item.href}>
          <a
            className={cn(
              "flex flex-col items-center py-1 px-3",
              location === item.href ? "text-primary" : "text-slate-500"
            )}
          >
            {item.icon}
            <span className="text-xs mt-1">{item.label}</span>
          </a>
        </Link>
      ))}
    </nav>
  );
}
