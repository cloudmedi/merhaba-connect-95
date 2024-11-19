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
} from "lucide-react";

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

  return (
    <nav className="w-64 min-h-screen bg-white border-r border-gray-200 p-4">
      <div className="flex items-center gap-2 mb-8">
        <Music2 className="h-6 w-6 text-primary" />
        <h1 className="text-xl font-semibold">Merhaba Music</h1>
      </div>
      
      <div className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                isActive
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}