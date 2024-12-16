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
    <div className="bg-[#F8F9FC] border-b border-gray-200">
      <div className="max-w-[1400px] mx-auto">
        <div className="px-4 md:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left side - Navigation */}
            <nav className="flex items-center space-x-8">
              {navItems.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  end={item.exact}
                  className={({ isActive }) =>
                    `text-sm font-medium transition-colors ${
                      isActive
                        ? "text-[#6E59A5] relative after:absolute after:bottom-[-18px] after:left-0 after:w-full after:h-[2px] after:bg-[#6E59A5]"
                        : "text-gray-600 hover:text-gray-900"
                    }`
                  }
                >
                  {item.title}
                </NavLink>
              ))}
            </nav>

            {/* Right side - User info and Actions */}
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-xs text-gray-500">Welcome back</p>
                <h1 className="text-sm font-medium text-gray-900">{firstName}</h1>
              </div>

              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[#6E59A5] text-[10px] font-medium text-white flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full sm:w-[400px] p-0 bg-white border-l border-gray-200">
                  <div className="flex flex-col h-full">
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="font-semibold text-lg text-gray-900">Notifications</h3>
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
                              className={`p-4 cursor-pointer transition-colors ${
                                notification.status === "unread"
                                  ? "bg-gray-50"
                                  : "bg-white"
                              } hover:bg-gray-50`}
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
                                  <p className={`text-gray-900 ${
                                    notification.status === "unread" ? "font-semibold" : ""
                                  }`}>
                                    {notification.title}
                                  </p>
                                  <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                                  <p className="text-xs text-gray-500 mt-2">
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
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0 overflow-hidden">
                    <div className="h-full w-full rounded-full bg-[#6E59A5] flex items-center justify-center">
                      <span className="text-sm font-medium text-white">
                        {firstName.charAt(0)}
                      </span>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-white border border-gray-200">
                  <DropdownMenuItem asChild>
                    <NavLink to="/manager/settings/profile" className="flex items-center text-gray-700">
                      <User className="mr-2 h-4 w-4" />
                      <span className="font-medium">Profile</span>
                    </NavLink>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <NavLink to="/manager/settings" className="flex items-center text-gray-700">
                      <Settings className="mr-2 h-4 w-4" />
                      <span className="font-medium">Settings</span>
                    </NavLink>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-200" />
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
    </div>
  );
}