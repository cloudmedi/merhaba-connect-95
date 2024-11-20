import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutGrid,
  Music2,
  Radio,
  Calendar,
  Building2,
  Smartphone,
  BarChart2,
  Bell,
  Settings,
  Menu,
  ChevronLeft,
} from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

const navItems = [
  { icon: LayoutGrid, label: "Dashboard", href: "/manager" },
  { icon: Music2, label: "Media Library", href: "/manager/media" },
  { icon: Radio, label: "Announcements", href: "/manager/announcements" },
  { icon: Calendar, label: "Schedule", href: "/manager/schedule" },
  { icon: Building2, label: "Branches", href: "/manager/branches" },
  { icon: Smartphone, label: "Devices", href: "/manager/devices" },
  { icon: BarChart2, label: "Reports", href: "/manager/reports" },
  { icon: Bell, label: "Activities", href: "/manager/activities" },
  { icon: Settings, label: "Settings", href: "/manager/settings" },
];

export function ManagerNav() {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <Menu className="h-6 w-6" />
      </Button>

      <nav
        className={cn(
          "min-h-screen bg-white border-r text-gray-600 transition-all duration-300 relative",
          isCollapsed ? "w-20" : "w-64",
          "fixed md:relative",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          "z-40"
        )}
      >
        <div className="sticky top-0 p-6">
          <div
            className={cn(
              "flex items-center gap-3 mb-8",
              isCollapsed && "justify-center"
            )}
          >
            <Radio className="h-8 w-8 text-blue-600" />
            {!isCollapsed && (
              <h1 className="text-xl font-semibold tracking-tight text-gray-900">
                Cloud Media
              </h1>
            )}
          </div>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute right-[-12px] top-8 bg-white p-1.5 rounded-full hover:bg-gray-50 transition-colors border shadow-sm hidden md:block"
          >
            <ChevronLeft
              className={cn(
                "h-4 w-4 transition-transform text-gray-600",
                isCollapsed && "rotate-180"
              )}
            />
          </button>

          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:text-blue-600 hover:bg-blue-50",
                    isCollapsed && "justify-center px-2"
                  )}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon className={cn("h-5 w-5", isActive && "text-blue-600")} />
                  {!isCollapsed && item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}