import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Settings, 
  Key, 
  FileText, 
  Globe, 
  Building2, 
  Mail, 
  Shield, 
  Bell,
  Wallet,
  Database,
  History
} from "lucide-react";

const navItems = [
  {
    title: "App Settings",
    href: "/super-admin/settings",
    icon: Settings,
    exact: true,
  },
  {
    title: "Company Settings",
    href: "/super-admin/settings/company",
    icon: Building2,
  },
  {
    title: "Localization",
    href: "/super-admin/settings/localization",
    icon: Globe,
  },
  {
    title: "Billing & Licensing",
    href: "/super-admin/settings/billing",
    icon: Wallet,
  },
  {
    title: "Email Settings",
    href: "/super-admin/settings/email",
    icon: Mail,
  },
  {
    title: "Security",
    href: "/super-admin/settings/security",
    icon: Shield,
  },
  {
    title: "Notifications",
    href: "/super-admin/settings/notifications",
    icon: Bell,
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
  {
    title: "Audit Logs",
    href: "/super-admin/settings/audit-logs",
    icon: History,
  },
  {
    title: "Backup & Restore",
    href: "/super-admin/settings/backup",
    icon: Database,
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