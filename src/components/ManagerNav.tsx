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
    <nav className="w-[280px] bg-gradient-to-b from-[#1A1F2C] to-[#2C3444] min-h-screen py-6 px-4 flex flex-col shadow-xl">
      {/* Logo & Title */}
      <div className="flex items-center gap-3 px-4 mb-8">
        <Music2 className="h-8 w-8 text-[#9b87f5]" />
        <span className="text-xl font-semibold tracking-tight text-white">
          Merhaba Music
        </span>
      </div>

      {/* Navigation Links */}
      <div className="space-y-1.5">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-[#9b87f5]/20 text-[#9b87f5]"
                  : "text-gray-300 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            <item.icon className={`h-5 w-5 transition-colors`} />
            <span>{item.title}</span>
          </NavLink>
        ))}
      </div>

      {/* Bottom Section - Can be used for user profile or additional info */}
      <div className="mt-auto pt-6 px-4 border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#9b87f5]/20 flex items-center justify-center">
            <span className="text-sm font-medium text-[#9b87f5]">M</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-white">Manager Panel</span>
            <span className="text-xs text-gray-400">v1.0.0</span>
          </div>
        </div>
      </div>
    </nav>
  );
}