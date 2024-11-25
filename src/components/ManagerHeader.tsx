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
    <div className="bg-gradient-to-r from-[#1A1F2C] to-[#2C3444] px-4 md:px-8 py-4 border-b border-gray-800/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="text-white">
            <h1 className="text-sm font-medium text-gray-300">Welcome back,</h1>
            <p className="text-xl font-semibold">{firstName}</p>
          </div>
          <nav className="hidden md:block">
            <div className="flex items-center gap-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  end={item.exact}
                  className={({ isActive }) =>
                    `px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? "text-white bg-white/10"
                        : "text-gray-300 hover:text-white hover:bg-white/5"
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
                className="relative text-gray-300 hover:text-white hover:bg-white/5"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-[#9b87f5] text-[11px] font-medium text-white flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-[400px] p-0 bg-[#1A1F2C] border-l border-gray-800/20">
              <div className="flex flex-col h-full">
                <div className="p-4 border-b border-gray-800/20">
                  <h3 className="font-semibold text-lg text-white">Notifications</h3>
                </div>
                <ScrollArea className="flex-1">
                  <div className="p-2">
                    {notifications.length === 0 ? (
                      <p className="text-sm text-gray-400 text-center py-4">
                        No notifications
                      </p>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 transition-colors cursor-pointer ${
                            notification.status === "unread"
                              ? "bg-[#9b87f5]/10 hover:bg-[#9b87f5]/20"
                              : "hover:bg-white/5"
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
                              <p className={`font-medium text-white ${
                                notification.status === "unread" ? "font-semibold" : ""
                              }`}>
                                {notification.title}
                              </p>
                              <p className="text-gray-300 text-sm mt-1">{notification.message}</p>
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
              <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0 overflow-hidden">
                <div className="h-full w-full rounded-full bg-[#9b87f5] flex items-center justify-center ring-2 ring-white/10">
                  <span className="text-sm font-medium text-white">
                    {firstName.charAt(0)}
                  </span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-[#1A1F2C] border-gray-800/20">
              <DropdownMenuItem asChild>
                <NavLink to="/manager/settings/profile" className="flex items-center text-gray-300 hover:text-white focus:text-white">
                  <User className="mr-2 h-4 w-4" />
                  <span className="font-medium">Profile</span>
                </NavLink>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <NavLink to="/manager/settings" className="flex items-center text-gray-300 hover:text-white focus:text-white">
                  <Settings className="mr-2 h-4 w-4" />
                  <span className="font-medium">Settings</span>
                </NavLink>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-800/20" />
              <DropdownMenuItem onClick={logout} className="text-red-400 hover:text-red-300 focus:text-red-300">
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