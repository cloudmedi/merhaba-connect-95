import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Monitor,
  Calendar,
  Settings,
  Volume2
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
    <nav className="w-[240px] bg-[#1C1C28] min-h-screen p-4 flex flex-col gap-2">
      <div className="flex items-center gap-2 px-2 py-4 mb-4">
        <span className="text-lg font-semibold text-white">Manager Panel</span>
      </div>
      {navItems.map((item) => (
        <NavLink
          key={item.href}
          to={item.href}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive
                ? "bg-[#6E59A5] text-white"
                : "text-gray-400 hover:text-white hover:bg-[#6E59A5]/10"
            }`
          }
        >
          <item.icon className="w-5 h-5" />
          <span className="font-medium">{item.title}</span>
        </NavLink>
      ))}
    </nav>
  );
}