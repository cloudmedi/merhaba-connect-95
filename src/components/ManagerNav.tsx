import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Calendar, Home, Music, Radio, Settings, Users } from "lucide-react";

export function ManagerNav() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="grid items-start gap-2">
      <Link
        to="/manager"
        className={cn(
          "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
          isActive("/manager") && "bg-accent"
        )}
      >
        <Home className="mr-2 h-4 w-4" />
        <span>Dashboard</span>
      </Link>
      <Link
        to="/manager/playlists"
        className={cn(
          "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
          isActive("/manager/playlists") && "bg-accent"
        )}
      >
        <Music className="mr-2 h-4 w-4" />
        <span>Playlists</span>
      </Link>
      <Link
        to="/manager/announcements"
        className={cn(
          "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
          isActive("/manager/announcements") && "bg-accent"
        )}
      >
        <Radio className="mr-2 h-4 w-4" />
        <span>Announcements</span>
      </Link>
      <Link
        to="/manager/devices"
        className={cn(
          "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
          isActive("/manager/devices") && "bg-accent"
        )}
      >
        <Users className="mr-2 h-4 w-4" />
        <span>Devices</span>
      </Link>
      <Link
        to="/manager/settings"
        className={cn(
          "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
          isActive("/manager/settings") && "bg-accent"
        )}
      >
        <Settings className="mr-2 h-4 w-4" />
        <span>Settings</span>
      </Link>
    </nav>
  );
}