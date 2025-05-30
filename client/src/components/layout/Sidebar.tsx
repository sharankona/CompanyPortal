import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

import {
  Home,
  FileText,
  Users,
  Settings,
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  ChartNoAxesColumnIncreasing,
  DollarSign,
  Calendar,
  Newspaper,
  TrendingUp,
  CreditCard,
  Wallet,
  Layers,
  PenTool,
  Share2,
  Globe,
  Instagram,
  Linkedin,
  Youtube,
  Facebook,
  Twitter,
  BarChart,
  Grid
} from "lucide-react";
import { IconWrapper } from "@/components/ui/icon-wrapper";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  children?: NavItem[];
  allowedRoles?: string[];
}

export default function Sidebar() {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();

  // Initialize expanded items based on current location
  const initializeExpandedItems = () => {
    const expandedList: string[] = [];

    // If we're on any content page, expand the Content item
    if (location.startsWith('/content')) {
      expandedList.push('Content');

      // If we're on any social media content page, expand the Social Media item
      if (location.startsWith('/content/social-media')) {
        expandedList.push('Social Media');
      }
    }

    // If we're on any analytics page, expand the Analytics item
    if (location.startsWith('/analytics')) {
      expandedList.push('Analytics');

      // If we're on any social media analytics page, expand the Social Media item
      if (location.startsWith('/analytics/social')) {
        expandedList.push('Social Media');
      }
    }

    // If we're on any financials page, expand the Financials item
    if (location.startsWith('/financials')) {
      expandedList.push('Financials');
    }

    return expandedList;
  };

  const [expandedItems, setExpandedItems] = useState<string[]>(initializeExpandedItems());

  // Update expanded items when location changes
  useEffect(() => {
    const newExpandedItems = initializeExpandedItems();
    setExpandedItems(prev => {
      // Keep previously expanded items that aren't in the path
      const filtered = prev.filter(item => {
        // Don't filter out Content or Social Media if we're on a related page
        if (item === 'Content' && location.startsWith('/content')) return true;
        if (item === 'Social Media' && (location.startsWith('/content/social-media') || location.startsWith('/analytics/social'))) return true;
        if (item === 'Analytics' && location.startsWith('/analytics')) return true;
        if (item === 'Financials' && location.startsWith('/financials')) return true;

        // For other items, keep them if they were manually expanded
        return !['Content', 'Analytics', 'Social Media', 'Financials'].includes(item);
      });

      // Add new items based on current location using ES5-compatible deduplication
      const combined = [...filtered, ...newExpandedItems];
      const uniqueItems: string[] = [];

      combined.forEach(item => {
        if (!uniqueItems.includes(item)) {
          uniqueItems.push(item);
        }
      });

      return uniqueItems;
    });
  }, [location]);

  const toggleExpand = (label: string) => {
    setExpandedItems(prev => 
      prev.includes(label) 
        ? prev.filter(item => item !== label) 
        : [...prev, label]
    );
  };

  const navItems: NavItem[] = [
    {
      label: "Dashboard",
      href: "/",
      icon: <LayoutDashboard size={18} />,
    },
    {
      label: "Content",
      href: "/content",
      icon: <PenTool size={18} />,
      children: [
        {
          label: "All Content",
          href: "/content/all-content",
          icon: <Grid size={16} />,
        },
        {
          label: "Blog",
          href: "/content/blog",
          icon: <Globe size={16} />,
        },
        {
          label: "Social Media",
          href: "/content/social-media",
          icon: <Share2 size={16} />,
          children: [
            {
              label: "Instagram",
              href: "/content/social-media/instagram",
              icon: <Instagram size={14} />,
            },
            {
              label: "LinkedIn", 
              href: "/content/social-media/linkedin",
              icon: <Linkedin size={14} />,
            },
            {
              label: "YouTube",
              href: "/content/social-media/youtube",
              icon: <Youtube size={14} />,
            },
            {
              label: "Facebook",
              href: "/content/social-media/facebook",
              icon: <Facebook size={14} />,
            },
            {
              label: "X (Twitter)",
              href: "/content/social-media/twitter",
              icon: <Twitter size={14} />,
            },
          ],
        },
        {
          label: "Product Listings",
          href: "/content/product-listings",
          icon: <Layers size={16} />,
        },
      ],
    },
    {
      label: "Analytics",
      href: "/analytics",
      icon: <BarChart size={18} />,
      children: [
        {
          label: "Website",
          href: "/analytics/website",
          icon: <Globe size={16} />,
        },
        {
          label: "Social Media",
          href: "/analytics/social",
          icon: <BarChart size={16} />,
          children: [
            {
              label: "Instagram",
              href: "/analytics/social/instagram",
              icon: <IconWrapper><Instagram size={14} /></IconWrapper>,
            },
            {
              label: "LinkedIn",
              href: "/analytics/social/linkedin",
              icon: <IconWrapper><Linkedin size={14} /></IconWrapper>,
            },
            {
              label: "YouTube",
              href: "/analytics/social/youtube",
              icon: <IconWrapper><Youtube size={14} /></IconWrapper>,
            },
            {
              label: "Facebook",
              href: "/analytics/social/facebook",
              icon: <IconWrapper><Facebook size={14} /></IconWrapper>,
            },
            {
              label: "X (Twitter)",
              href: "/analytics/social/twitter",
              icon: <IconWrapper><Twitter size={14} /></IconWrapper>,
            },
          ],
        },
      ],
    },
    {
      label: "Financials",
      href: "/financials",
      icon: <DollarSign size={18} />,
      children: [
        {
          label: "Overview",
          href: "/financials/overview",
          icon: <LayoutDashboard size={16} />,
        },
        {
          label: "Revenue",
          href: "/financials/revenue",
          icon: <TrendingUp size={16} />,
        },
        {
          label: "Expenses",
          href: "/financials/expenses",
          icon: <CreditCard size={16} />,
        },
        {
          label: "Invoices",
          href: "/financials/invoices",
          icon: <FileText size={16} />,
        },
        {
          label: "Budget",
          href: "/financials/budget",
          icon: <Wallet size={16} />,
        },
        {
          label: "Reports",
          href: "/financials/reports",
          icon: <BarChart size={16} />,
        },
      ],
    },
    {
      label: "Documents",
      href: "/documents",
      icon: <Layers size={18} />,
    },
    {
      label: "Announcements",
      href: "/announcements",
      icon: <Newspaper size={18} />,
    },
    {
      label: "Users",
      href: "/users",
      icon: <Users size={18} />,
    },

    {
      label: "Settings",
      href: "/settings",
      icon: <Settings size={18} />,
    },
  ];

  // Filter items based on user role if needed
  const filteredNavItems = React.useMemo(() => {
    if (!user) return navItems;

    return navItems.filter(item => {
      if (!item.allowedRoles) return true;
      return item.allowedRoles.includes(user.role);
    });
  }, [navItems, user]);

  return (
    <aside className={cn("flex flex-col w-64 border-r border-border bg-card h-full", 
      {
        "hidden md:flex": !location.includes("sheet") 
      }
    )}>
      <div className="h-16 flex items-center justify-center border-b border-border">
        <div className="flex flex-col items-center justify-center">
          <span className="text-primary text-2xl font-bold" style={{ fontFamily: '"Source Code Pro", monospace' }}>cirkuitry</span>
          <span className="text-muted-foreground text-sm w-full text-center" style={{ fontFamily: '"Inter", sans-serif', letterSpacing: '0.5em', paddingLeft: '0.5em' }}>PORTAL</span>
        </div>
      </div>

      <div className="flex flex-col flex-1 overflow-y-auto pt-2">
        <nav className="flex-1 space-y-1 px-4">
          {filteredNavItems.map((item) => (
            <div key={item.href}>
              {item.children ? (
                <>
                  <button 
                    onClick={() => toggleExpand(item.label)}
                    className={cn(
                      "flex items-center justify-between w-full px-3 py-2 text-sm rounded-md transition-colors",
                      location.startsWith(item.href) 
                        ? "bg-accent text-primary font-medium" 
                        : "text-foreground hover:bg-accent hover:text-primary"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      {item.label}
                    </div>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="14" 
                      height="14" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      className={cn(
                        "transition-transform", 
                        expandedItems.includes(item.label) ? "rotate-180" : ""
                      )}
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </button>

                  {expandedItems.includes(item.label) && (
                    <div className="ml-4 pl-2 border-l border-border space-y-1 mt-1">
                      {item.children.map(childItem => (
                        <div key={childItem.href}>
                          {childItem.children ? (
                            <>
                              <button 
                                onClick={() => toggleExpand(childItem.label)}
                                className={cn(
                                  "flex items-center justify-between w-full px-3 py-2 text-sm rounded-md transition-colors",
                                  location.startsWith(childItem.href) 
                                    ? "bg-accent text-primary font-medium" 
                                    : "text-foreground hover:bg-accent hover:text-primary"
                                )}
                              >
                                <div className="flex items-center gap-3">
                                  {childItem.icon}
                                  {childItem.label}
                                </div>
                                <svg 
                                  xmlns="http://www.w3.org/2000/svg" 
                                  width="14" 
                                  height="14" 
                                  viewBox="0 0 24 24" 
                                  fill="none" 
                                  stroke="currentColor" 
                                  strokeWidth="2" 
                                  strokeLinecap="round" 
                                  strokeLinejoin="round"
                                  className={cn(
                                    "transition-transform", 
                                    expandedItems.includes(childItem.label) ? "rotate-180" : ""
                                  )}
                                >
                                  <polyline points="6 9 12 15 18 9"></polyline>
                                </svg>
                              </button>

                              {expandedItems.includes(childItem.label) && (
                                <div className="ml-4 pl-2 border-l border-border space-y-1 mt-1">
                                  {childItem.children.map(grandChildItem => (
                                    <Link 
                                      key={grandChildItem.href}
                                      href={grandChildItem.href}
                                      className={cn(
                                        "flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors justify-start",
                                        location === grandChildItem.href 
                                          ? "bg-accent text-primary font-medium" 
                                          : "text-foreground hover:bg-accent hover:text-primary"
                                      )}
                                    >
                                      {grandChildItem.icon}
                                      {grandChildItem.label}
                                    </Link>
                                  ))}
                                </div>
                              )}
                            </>
                          ) : (
                            <Link 
                              href={childItem.href}
                              className={cn(
                                "flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors justify-start",
                                location === childItem.href 
                                  ? "bg-accent text-primary font-medium" 
                                  : "text-foreground hover:bg-accent hover:text-primary"
                              )}
                            >
                              {childItem.icon}
                              {childItem.label}
                            </Link>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link 
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors justify-start",
                    location === item.href 
                      ? "bg-accent text-primary font-medium" 
                      : "text-foreground hover:bg-accent hover:text-primary"
                  )}
                >
                  {item.icon}
                  {item.label}
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
}