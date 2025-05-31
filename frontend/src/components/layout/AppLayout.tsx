import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="flex">
        <Sidebar />
        <div className="flex flex-col flex-1">
          <Header toggleSidebar={toggleSidebar} />
          <main className="flex-1 overflow-auto pl-4 pr-4 md:pl-6 md:pr-6 pb-8 mt-16">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}