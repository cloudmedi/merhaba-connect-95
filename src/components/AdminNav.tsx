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
  Settings,
  BarChart2,
  Bell,
  Activity,
} from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

const navItems = [
  { 
    title: "Ana Sayfa",
    icon: LayoutDashboard, 
    href: "/super-admin",
    description: "Dashboard ve genel bakış"
  },
  { 
    title: "Kullanıcılar", 
    icon: Users, 
    href: "/super-admin/users",
    description: "Kullanıcı yönetimi"
  },
  { 
    title: "Müzik", 
    icon: Music2, 
    href: "/super-admin/music",
    description: "Müzik kütüphanesi"
  },
  { 
    title: "Türler", 
    icon: Tag, 
    href: "/super-admin/genres",
    description: "Müzik türleri"
  },
  { 
    title: "Kategoriler", 
    icon: FolderTree, 
    href: "/super-admin/categories",
    description: "Müzik kategorileri"
  },
  { 
    title: "Ruh Halleri", 
    icon: Heart, 
    href: "/super-admin/moods",
    description: "Müzik ruh halleri"
  },
  { 
    title: "Çalma Listeleri", 
    icon: ListMusic, 
    href: "/super-admin/playlists",
    description: "Playlist yönetimi"
  },
  { 
    title: "Bildirimler", 
    icon: Bell, 
    href: "/super-admin/notifications",
    description: "Sistem bildirimleri"
  },
  { 
    title: "Performans", 
    icon: Activity, 
    href: "/super-admin/performance",
    description: "Sistem performansı"
  },
  { 
    title: "Raporlar", 
    icon: BarChart2, 
    href: "/super-admin/reports",
    description: "Sistem raporları"
  },
  { 
    title: "Ayarlar", 
    icon: Settings, 
    href: "/super-admin/settings",
    description: "Sistem ayarları"
  },
];

export function AdminNav() {
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
        <ChevronLeft className="h-6 w-6" />
      </Button>

      <nav
        className={cn(
          "min-h-screen bg-background border-r flex flex-col transition-all duration-300 relative",
          isCollapsed ? "w-16" : "w-64", // Genişliği azalttık
          "fixed md:relative",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          "z-40"
        )}
      >
        <div className="sticky top-0 p-4 flex flex-col h-screen"> {/* Padding'i azalttık */}
          <div className="flex items-center justify-between mb-6"> {/* Margin'i azalttık */}
            <div className={cn("flex items-center gap-2", isCollapsed && "justify-center")}> {/* Gap'i azalttık */}
              <Music2 className="h-6 w-6 text-primary" /> {/* Icon boyutunu küçülttük */}
              {!isCollapsed && (
                <h1 className="text-lg font-semibold tracking-tight"> {/* Font boyutunu küçülttük */}
                  Music
                </h1>
              )}
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute right-[-12px] top-6 bg-background border rounded-full hover:bg-accent transition-colors shadow-md hidden md:flex"
          >
            <ChevronLeft
              className={cn(
                "h-4 w-4 transition-transform",
                isCollapsed && "rotate-180"
              )}
            />
          </Button>

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
                    "flex items-center gap-2 px-2 py-2 rounded-lg text-sm font-medium transition-all relative group", // Padding'i azalttık
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                    isCollapsed ? "justify-center" : "justify-start"
                  )}
                >
                  <Icon className={cn("h-4 w-4 shrink-0")} /> {/* Icon boyutunu küçülttük */}
                  {!isCollapsed && (
                    <span>{item.title}</span>
                  )}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 p-2 bg-popover text-popover-foreground rounded-md invisible opacity-0 translate-x-1 group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                      <p className="font-medium">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.description}</p>
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}