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
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-[11px] font-medium text-white flex items-center justify-center">
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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <div className="h-8 w-8 rounded-full bg-[#9b87f5] flex items-center justify-center text-white">
                  <User className="h-4 w-4" />
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
  );
}
