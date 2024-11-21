import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Music2, 
  Radio, 
  Calendar, 
  Bell,
  Settings
} from "lucide-react";

const navItems = [
  {
    title: "Dashboard",
    href: "/manager",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    title: "Playlists",
    href: "/manager/playlists",
    icon: Music2,
  },
  {
    title: "Devices",
    href: "/manager/devices",
    icon: Radio,
  },
  {
    title: "Schedule",
    href: "/manager/schedule",
    icon: Calendar,
  },
  {
    title: "Announcements",
    href: "/manager/announcements",
    icon: Bell,
  },
  {
    title: "Settings",
    href: "/manager/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  return (
    <div className="hidden border-r bg-white lg:block lg:w-64">
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center border-b px-6">
          <h1 className="text-xl font-semibold">Lovable</h1>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-6">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.exact}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-[#9b87f5]/20 text-[#9b87f5]"
                    : "text-gray-600 hover:bg-gray-100"
                )
              }
            >
              <item.icon className="h-5 w-5" />
              {item.title}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}