import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Monitor,
  Calendar,
  Settings,
  Volume2,
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
    <nav className="w-[280px] bg-gradient-to-b from-[#1A1F2C] to-[#2C3444] min-h-screen py-6 px-4 flex flex-col shadow-xl">
      {/* Logo */}
      <div className="flex items-center justify-center px-4 mb-8">
        <img 
          src="/lovable-uploads/1626a041-d44e-4b38-a0e6-09414a3fa6d0.png" 
          alt="Veeq Logo" 
          className="h-12 object-contain"
        />
      </div>

      {/* Navigation Links */}
      <div className="space-y-1.5">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            end={item.exact}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-[#9b87f5]/20 text-[#9b87f5]"
                  : "text-gray-300 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            <item.icon className={`h-5 w-5`} />
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