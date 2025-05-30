import { ReactNode } from "react";
import Sidebar from "@/components/layout/Sidebar";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";

interface AnalyticsLayoutProps {
  children: ReactNode;
}

export default function AnalyticsLayout({ children }: AnalyticsLayoutProps) {
  const { user } = useAuth();
  const [location] = useLocation();

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}