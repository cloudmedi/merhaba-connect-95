import { NavLink } from "react-router-dom";
import { Music2, ListMusic, Monitor, Calendar, Bell, Settings } from "lucide-react";

const navItems = [
  {
    title: "Dashboard",
    href: "/manager",
    icon: Music2,
    exact: true,
  },
  {
    title: "Playlists",
    href: "/manager/playlists",
    icon: ListMusic,
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

export function ManagerNav() {
  return (
    <nav className="w-full bg-[#121212] py-3 px-4 flex items-center justify-between border-b border-[#282828]">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3">
          <Music2 className="h-8 w-8 text-[#9b87f5]" />
          <span className="text-xl font-semibold tracking-tight text-white">
            Merhaba Music
          </span>
        </div>

        <div className="flex items-center gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.exact}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#282828] text-[#9b87f5]"
                    : "text-gray-400 hover:text-white hover:bg-[#282828]"
                }`
              }
            >
              <item.icon className="h-4 w-4" />
              <span>{item.title}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}