import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Music,
  GitBranch,
  Heart,
  Radio,
  Bell,
  Activity,
  BarChart2,
  Settings,
  Menu,
  ChevronLeft,
} from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/manager" },
  { icon: Users, label: "Users", href: "/manager/users" },
  { icon: Music, label: "Music", href: "/manager/music" },
  { icon: GitBranch, label: "Genres", href: "/manager/genres" },
  { icon: GitBranch, label: "Categories", href: "/manager/categories" },
  { icon: Heart, label: "Moods", href: "/manager/moods" },
  { icon: Radio, label: "Playlists", href: "/manager/playlists" },
  { icon: Bell, label: "Notifications", href: "/manager/notifications" },
  { icon: Activity, label: "Performance", href: "/manager/performance" },
  { icon: BarChart2, label: "Reports", href: "/manager/reports" },
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
          "min-h-screen bg-[#1A1F2C] text-white transition-all duration-300 relative",
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
            <Radio className="h-8 w-8 text-[#FFD700]" />
            {!isCollapsed && (
              <h1 className="text-xl font-semibold tracking-tight">
                Merhaba Music
              </h1>
            )}
          </div>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute right-[-12px] top-8 bg-[#1A1F2C] p-1.5 rounded-full hover:bg-[#2C3444] transition-colors shadow-lg hidden md:block"
          >
            <ChevronLeft
              className={cn(
                "h-4 w-4 transition-transform text-[#FFD700]",
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
                      ? "bg-[#2C3444] text-white"
                      : "text-gray-400 hover:text-white hover:bg-[#2C3444]",
                    isCollapsed && "justify-center px-2"
                  )}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon className={cn("h-5 w-5", isActive && "text-white")} />
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