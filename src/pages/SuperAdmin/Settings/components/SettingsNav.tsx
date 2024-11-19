import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Settings, Key, FileText } from "lucide-react";

const navItems = [
  {
    title: "App Settings",
    href: "/super-admin/settings",
    icon: Settings,
    exact: true,
  },
  {
    title: "API Keys",
    href: "/super-admin/settings/api-keys",
    icon: Key,
  },
  {
    title: "System Logs",
    href: "/super-admin/settings/logs",
    icon: FileText,
  },
];

export function SettingsNav() {
  return (
    <nav className="space-y-1">
      {navItems.map((item) => (
        <NavLink
          key={item.href}
          to={item.href}
          end={item.exact}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
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
  );
}