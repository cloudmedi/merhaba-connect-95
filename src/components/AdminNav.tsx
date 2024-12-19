import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Music2,
  FolderTree,
  Heart,
  ListMusic,
  ChevronLeft,
  Tag,
  Menu,
  Settings as SettingsIcon,
  BarChart2,
  Bell,
  Activity,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/super-admin" },
  { icon: Users, label: "Users", href: "/super-admin/users" },
  { icon: Music2, label: "Music", href: "/super-admin/music" },
  { icon: Tag, label: "Genres", href: "/super-admin/genres" },
  { icon: FolderTree, label: "Categories", href: "/super-admin/categories" },
  { icon: Heart, label: "Moods", href: "/super-admin/moods" },
  { icon: ListMusic, label: "Playlists", href: "/super-admin/playlists" },
  { icon: Bell, label: "Notifications", href: "/super-admin/notifications" },
  { icon: Activity, label: "Performance", href: "/super-admin/performance" },
  { icon: BarChart2, label: "Reports", href: "/super-admin/reports" },
  { icon: SettingsIcon, label: "Settings", href: "/super-admin/settings" },
];

export function AdminNav() {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
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
          <div className="flex items-center justify-between mb-8">
            <div className={cn("flex items-center gap-3", isCollapsed && "justify-center")}>
              <Music2 className="h-8 w-8 text-[#9b87f5]" />
              {!isCollapsed && (
                <h1 className="text-xl font-semibold tracking-tight">
                  Merhaba Music
                </h1>
              )}
            </div>
          </div>

          {/* Profil Avatar - Yeni Konum */}
          <div className="mb-8">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full flex items-center gap-2 px-2 py-1.5">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-[#9b87f5] text-white">
                      {user?.firstName?.charAt(0) || user?.email?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  {!isCollapsed && (
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium">{user?.firstName} {user?.lastName}</span>
                      <span className="text-xs text-gray-400">{user?.email}</span>
                    </div>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.firstName} {user?.lastName}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Çıkış Yap
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}