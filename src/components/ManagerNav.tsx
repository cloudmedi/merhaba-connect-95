import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Monitor,
  Calendar,
  Settings,
  Volume2,
  Music2
} from "lucide-react";

const navItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/manager",
    exact: true
  },
  {
    title: "Devices",
    icon: Monitor,
    href: "/manager/devices",
  },
  {
    title: "Schedule",
    icon: Calendar,
    href: "/manager/schedule",
  },
  {
    title: "Announcements",
    icon: Volume2,
    href: "/manager/announcements",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/manager/settings",
  },
];

export function ManagerNav() {
  return (
    <nav className="w-full bg-[#1A1F2C] py-3 px-4 flex items-center justify-between border-b border-gray-800">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3">
          <Music2 className="h-8 w-8 text-[#9b87f5]" />
          <span className="text-xl font-semibold tracking-tight text-white">
            Merhaba Music
          </span>
        </div>

        <div className="flex items-center gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.exact}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#9b87f5]/20 text-[#9b87f5]"
                    : "text-gray-300 hover:bg-white/10 hover:text-white"
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