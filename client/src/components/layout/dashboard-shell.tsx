import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useState } from "react";
import Sidebar from "./Sidebar";
import { Menu, ArrowLeft } from "lucide-react";
import { Link, useLocation } from "wouter";

interface DashboardShellProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  backPath?: string;
}

export function DashboardShell({
  children,
  title,
  description,
  backPath,
}: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="container mx-auto px-4 py-6 md:px-6 lg:px-8">
      {(title || description || backPath) && (
        <div className="mb-6">
          {backPath && (
            <Button
              variant="ghost"
              size="sm"
              className="mb-2"
              asChild
            >
              <Link href={backPath}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Link>
            </Button>
          )}
          {title && <h1 className="text-2xl font-bold">{title}</h1>}
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}