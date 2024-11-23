import { Bell, LogOut, Settings, User } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "@/hooks/useAuth";
import { NavLink } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { ScrollArea } from "./ui/scroll-area";
import { useNotifications } from "@/hooks/useNotifications";
import { formatDistanceToNow } from "date-fns";

const navItems = [
  {
    title: "Dashboard",
    href: "/manager",
    exact: true,
  },
  {
    title: "Devices",
    href: "/manager/devices",
  },
  {
    title: "Schedule",
    href: "/manager/schedule",
  },
  {
    title: "Announcements",
    href: "/manager/announcements",
  },
  {
    title: "Settings",
    href: "/manager/settings",
  },
];

export function ManagerHeader() {
  const { user, signOut } = useAuth();
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const firstName = user?.firstName || 'User';

  return (
    <div className="bg-[#F5F5F5] px-4 md:px-8 py-3 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div>
            <h1 className="text-sm font-medium text-gray-500">Welcome back,</h1>
            <p className="text-xl font-semibold text-gray-900">{firstName}</p>
          </div>
          <nav className="flex items-center">
            <div className="flex items-center gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  end={item.exact}
                  className={({ isActive }) =>
                    `px-4 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "text-[#9b87f5]"
                        : "text-gray-600 hover:text-gray-900"
                    }`
                  }
                >
                  {item.title}
                </NavLink>
              ))}
            </div>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[#9b87f5] text-[10px] font-medium text-white flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <ScrollArea className="h-[300px]">
                <div className="p-2 space-y-2">
                  {notifications.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No notifications
                    </p>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-3 rounded-lg text-sm ${
                          notification.status === "unread"
                            ? "bg-gray-50"
                            : "bg-white"
                        }`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <p className="font-medium">{notification.title}</p>
                        <p className="text-gray-600">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatDistanceToNow(new Date(notification.created_at), {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <div className="h-8 w-8 rounded-full bg-[#9b87f5] flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {firstName.charAt(0)}
                  </span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <NavLink to="/manager/settings/profile" className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </NavLink>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <NavLink to="/manager/settings" className="flex items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </NavLink>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={signOut} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}