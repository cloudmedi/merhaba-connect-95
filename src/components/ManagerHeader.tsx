import { Bell, LogOut, Settings, User } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "@/hooks/useAuth";
import { NavLink, useNavigate } from "react-router-dom";
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
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

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
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAsRead } = useNotifications();
  const navigate = useNavigate();
  const firstName = user?.firstName || 'User';

  const handleNotificationClick = async (notification: any) => {
    await markAsRead(notification.id);
    
    if (notification.metadata?.playlist_id) {
      navigate(`/manager/playlists/${notification.metadata.playlist_id}`);
    }
  };

  return (
    <div className="bg-white border-b border-gray-100">
      <div className="px-4 md:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Welcome message */}
          <div className="flex items-center space-x-8">
            <div>
              <p className="text-sm text-gray-500">Welcome back,</p>
              <h1 className="text-lg font-semibold text-gray-900">{firstName}</h1>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  end={item.exact}
                  className={({ isActive }) =>
                    `px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? "bg-[#9b87f5]/10 text-[#9b87f5]"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`
                  }
                >
                  {item.title}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-full"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-[#9b87f5] text-[11px] font-medium text-white flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-[400px] p-0">
                <div className="flex flex-col h-full">
                  <div className="p-4 border-b border-gray-100">
                    <h3 className="font-semibold text-lg">Notifications</h3>
                  </div>
                  <ScrollArea className="flex-1">
                    <div className="p-2">
                      {notifications.length === 0 ? (
                        <p className="text-sm text-gray-500 text-center py-4">
                          No notifications
                        </p>
                      ) : (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-4 transition-colors cursor-pointer ${
                              notification.status === "unread"
                                ? "bg-purple-50 hover:bg-purple-100"
                                : "bg-white hover:bg-gray-50"
                            }`}
                            onClick={() => handleNotificationClick(notification)}
                          >
                            <div className="flex gap-3">
                              {notification.metadata?.artwork_url && (
                                <img 
                                  src={notification.metadata.artwork_url} 
                                  alt=""
                                  className="w-12 h-12 rounded object-cover"
                                />
                              )}
                              <div className="flex-1">
                                <p className={`font-medium text-gray-900 ${
                                  notification.status === "unread" ? "font-semibold" : ""
                                }`}>
                                  {notification.title}
                                </p>
                                <p className="text-gray-600 text-sm mt-1">{notification.message}</p>
                                <p className="text-xs text-gray-400 mt-2">
                                  {formatDistanceToNow(new Date(notification.created_at), {
                                    addSuffix: true,
                                  })}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </SheetContent>
            </Sheet>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0 overflow-hidden">
                  <div className="h-full w-full rounded-full bg-[#9b87f5] flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {firstName.charAt(0)}
                    </span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <NavLink to="/manager/settings/profile" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span className="font-medium">Profile</span>
                  </NavLink>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <NavLink to="/manager/settings" className="flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    <span className="font-medium">Settings</span>
                  </NavLink>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span className="font-medium">Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}