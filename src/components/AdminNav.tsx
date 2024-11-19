import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Music2,
  Radio,
  FolderTree,
  Heart,
  ListMusic,
  ChevronLeft,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/super-admin" },
  { icon: Users, label: "Users", href: "/super-admin/users" },
  { icon: Music2, label: "Music", href: "/super-admin/music" },
  { icon: Radio, label: "Genres", href: "/super-admin/genres" },
  { icon: FolderTree, label: "Categories", href: "/super-admin/categories" },
  { icon: Heart, label: "Moods", href: "/super-admin/moods" },
  { icon: ListMusic, label: "Playlists", href: "/super-admin/playlists" },
];

export function AdminNav() {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <nav className={cn(
      "min-h-screen bg-[#1A1F2C] text-white transition-all duration-300",
      isCollapsed ? "w-20" : "w-64"
    )}>
      <div className="sticky top-0 p-4">
        <div className={cn(
          "flex items-center gap-2 mb-8",
          isCollapsed && "justify-center"
        )}>
          <Music2 className="h-6 w-6 text-purple-400" />
          {!isCollapsed && <h1 className="text-xl font-semibold">Merhaba Music</h1>}
        </div>
        
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute right-[-12px] top-6 bg-[#1A1F2C] p-1 rounded-full hover:bg-purple-900 transition-colors"
        >
          <ChevronLeft className={cn(
            "h-5 w-5 transition-transform",
            isCollapsed && "rotate-180"
          )} />
        </button>
        
        <div className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all hover:bg-purple-900/50",
                  isActive
                    ? "bg-purple-900 text-purple-200"
                    : "text-gray-300",
                  isCollapsed && "justify-center px-2"
                )}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className="h-5 w-5" />
                {!isCollapsed && item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}