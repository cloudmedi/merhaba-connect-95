import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Music2,
  Building2,
  Laptop2,
  Calendar,
  Bell,
  Settings as SettingsIcon,
  Menu,
  ChevronLeft,
  Megaphone,
} from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/manager" },
  { icon: Building2, label: "Branches", href: "/manager/branches" },
  { icon: Users, label: "Staff", href: "/manager/staff" },
  { icon: Music2, label: "Playlists", href: "/manager/playlists" },
  { icon: Laptop2, label: "Devices", href: "/manager/devices" },
  { icon: Calendar, label: "Schedule", href: "/manager/schedule" },
  { icon: Megaphone, label: "Announcements", href: "/manager/announcements" },
  { icon: Bell, label: "Notifications", href: "/manager/notifications" },
  { icon: SettingsIcon, label: "Settings", href: "/manager/settings" },
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
          "min-h-screen bg-gradient-to-b from-[#1A1F2C] to-[#2C3444] text-white transition-all duration-300 relative",
          isCollapsed ? "w-20" : "w-64",
          "fixed md:relative",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          "z-40"
        )}
      >
        <div className="sticky top-0 p-6">
          <div className={cn("flex items-center gap-3 mb-8", isCollapsed && "justify-center")}>
            <Building2 className="h-8 w-8 text-[#9b87f5]" />
            {!isCollapsed && (
              <h1 className="text-xl font-semibold tracking-tight">
                Manager Panel
              </h1>
            )}
          </div>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute right-[-12px] top-8 bg-[#1A1F2C] p-1.5 rounded-full hover:bg-[#2C3444] transition-colors shadow-lg hidden md:block"
          >
            <ChevronLeft
              className={cn(
                "h-4 w-4 transition-transform text-[#9b87f5]",
                isCollapsed && "rotate-180"
              )}
            />
          </button>

          <div className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                    isActive
                      ? "bg-[#9b87f5]/20 text-[#9b87f5]"
                      : "text-gray-300 hover:bg-white/10",
                    isCollapsed && "justify-center px-2"
                  )}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon className={cn("h-5 w-5", isActive && "text-[#9b87f5]")} />
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