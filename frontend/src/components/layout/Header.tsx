import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useNotifications } from "@/context/NotificationContext";
import { Link } from "wouter";
import {
  Menu,
  Search,
  ChevronDown,
  LogOut,
  User,
  Settings,
  Moon,
  Sun,
} from "lucide-react";
import { NotificationDropdown } from "@/components/ui/notification-dropdown";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type HeaderProps = {
  toggleSidebar: () => void;
};

export default function Header({ toggleSidebar }: HeaderProps) {
  const { user, logoutMutation } = useAuth();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDark;
    setIsDark(newMode);
    document.documentElement.classList.toggle("dark", newMode);
  };

  const getUserInitials = (name: string): string => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <header className="fixed right-0 w-[calc(100%-16rem)] md:w-[calc(100%-16rem)] bg-background shadow-sm z-50 border-b border-border">
      <div className="flex items-center justify-end h-16 px-4">
        <div className="lg:hidden mr-auto">
          <Button
            variant="ghost"
            size="icon"
            className="p-2 rounded-md text-slate-500 hover:bg-slate-100"
            onClick={toggleSidebar}
          >
            <Menu />
            <span className="sr-only">Toggle sidebar</span>
          </Button>
        </div>
        <div className="flex items-center space-x-4">
          {/* Search removed */}
          <div className="relative">
            <NotificationDropdown />
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-slate-100"
          >
            {isDark ? (
              <Sun className="h-5 w-5 text-slate-500" />
            ) : (
              <Moon className="h-5 w-5 text-slate-500" />
            )}
          </Button>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8 bg-primary text-white">
                    <AvatarFallback>
                      {getUserInitials(user.fullName)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:block text-sm font-medium">
                    {user.fullName}
                  </span>
                  <ChevronDown className="h-4 w-4 text-slate-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logoutMutation.mutate()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="outline" size="sm">
              Log in
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}