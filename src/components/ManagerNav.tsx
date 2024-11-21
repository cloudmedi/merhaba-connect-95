import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Bell,
  Monitor,
  Calendar,
  FolderTree,
} from "lucide-react";

const navItems = [
  {
    title: "Dashboard",
    href: "/manager",
    icon: LayoutDashboard,
  },
  {
    title: "Announcements",
    href: "/manager/announcements",
    icon: Bell,
  },
  {
    title: "Devices",
    href: "/manager/devices",
    icon: Monitor,
  },
  {
    title: "Schedule",
    href: "/manager/schedule",
    icon: Calendar,
  },
  {
    title: "Categories",
    href: "/manager/categories",
    icon: FolderTree,
  },
];

export function ManagerNav() {
  const location = useLocation();

  return (
    <nav className="grid items-start gap-2">
      {navItems.map((item, index) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.href;

        return (
          <Link
            key={index}
            to={item.href}
            className={cn(
              "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              isActive ? "bg-accent" : "transparent",
            )}
          >
            <Icon className="mr-2 h-4 w-4" />
            <span>{item.title}</span>
          </Link>
        );
      })}
    </nav>
  );
}