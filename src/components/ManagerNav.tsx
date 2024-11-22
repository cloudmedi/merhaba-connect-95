import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  LayoutDashboard,
  Monitor,
  Calendar,
  Settings,
  Volume2
} from "lucide-react";

export function ManagerNav() {
  const { t } = useTranslation();

  const navItems = [
    {
      title: t('navigation.dashboard'),
      icon: LayoutDashboard,
      href: "/manager",
    },
    {
      title: t('navigation.devices'),
      icon: Monitor,
      href: "/manager/devices",
    },
    {
      title: t('navigation.schedule'),
      icon: Calendar,
      href: "/manager/schedule",
    },
    {
      title: t('navigation.announcements'),
      icon: Volume2,
      href: "/manager/announcements",
    },
    {
      title: t('navigation.settings'),
      icon: Settings,
      href: "/manager/settings",
    },
  ];

  return (
    <nav className="w-[240px] bg-[#1C1C28] min-h-screen p-4 flex flex-col gap-2">
      <div className="flex items-center gap-2 px-2 py-4">
        <span className="text-lg font-semibold text-white">{t('navigation.managerPanel')}</span>
      </div>
      {navItems.map((item) => (
        <NavLink
          key={item.href}
          to={item.href}
          className={({ isActive }) =>
            `flex items-center gap-3 px-2 py-2 rounded-lg transition-colors ${
              isActive
                ? "bg-[#6E59A5] text-white"
                : "text-gray-400 hover:text-white hover:bg-[#6E59A5]/10"
            }`
          }
        >
          <item.icon className="w-5 h-5" />
          <span>{item.title}</span>
        </NavLink>
      ))}
    </nav>
  );
}