import { Button } from "@/components/ui/button";
import { ArrowLeft, LogOut, Settings, User, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useNotifications } from "@/hooks/useNotifications";
import { Avatar } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Günaydın";
  if (hour >= 12 && hour < 17) return "İyi Günler";
  return "İyi Akşamlar";
};

const getUserDisplayName = (user: any) => {
  if (user?.firstName) return user.firstName;
  if (user?.email) return user.email.split('@')[0];
  return '';
};

export function ManagerHeader() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const managerView = localStorage.getItem('managerView');

  const handleReturnToSuperAdmin = () => {
    localStorage.removeItem('managerView');
    navigate('/super-admin/users');
    toast.success("Super Admin paneline geri dönüldü");
  };

  const greeting = `${getGreeting()}, ${getUserDisplayName(user)}`;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="flex h-16 items-center gap-4 px-6">
        {/* Left Section */}
        <div className="flex flex-1 items-center gap-4">
          <h1 className="text-lg font-semibold text-gray-900 animate-fade-in">
            {greeting}
          </h1>
          {managerView && (
            <Button 
              variant="outline" 
              onClick={handleReturnToSuperAdmin}
              className="flex items-center gap-2 text-[#9b87f5] border-[#9b87f5] hover:bg-[#9b87f5]/5"
            >
              <ArrowLeft className="h-4 w-4" />
              Super Admin'e Geri Dön
            </Button>
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5 text-gray-600" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-[10px] font-medium flex items-center justify-center text-white">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[400px] sm:w-[540px]">
              <SheetHeader className="space-y-4 pb-4 border-b">
                <SheetTitle className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-[#9b87f5]" />
                    <span>Bildirimler</span>
                    {unreadCount > 0 && (
                      <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full">
                        {unreadCount} yeni
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={markAllAsRead}
                      className="text-[#9b87f5] hover:text-[#9b87f5] hover:bg-[#9b87f5]/5"
                    >
                      Tümünü Okundu İşaretle
                    </Button>
                  )}
                </SheetTitle>
              </SheetHeader>
              <ScrollArea className="h-[calc(100vh-8rem)] mt-4 pr-4">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-40 text-gray-500">
                    <Bell className="h-8 w-8 mb-2 text-gray-400" />
                    <p>Henüz bildirim bulunmuyor</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 rounded-lg border transition-colors cursor-pointer hover:bg-gray-50 ${
                          notification.status === 'unread'
                            ? 'bg-[#9b87f5]/5 border-[#9b87f5]/20'
                            : 'bg-white'
                        }`}
                        onClick={() => {
                          markAsRead(notification.id);
                          if (notification.type === 'playlist_assignment' && notification.metadata?.playlist_id) {
                            navigate(`/manager/playlists/${notification.metadata.playlist_id}`);
                          }
                        }}
                      >
                        <div className="flex gap-3">
                          {notification.type === 'playlist_assignment' && (
                            <div className="flex-shrink-0 w-12 h-12 rounded overflow-hidden">
                              <img
                                src={notification.metadata?.artwork_url || "/placeholder.svg"}
                                alt="Playlist artwork"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className={`font-medium ${notification.status === 'unread' ? 'text-[#9b87f5]' : ''}`}>
                                {notification.title}
                              </h4>
                              {notification.status === 'unread' && (
                                <span className="flex-shrink-0 h-2 w-2 rounded-full bg-[#9b87f5]" />
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                            <span className="text-xs text-gray-400 mt-2 block">
                              {format(new Date(notification.created_at), 'dd MMM yyyy HH:mm')}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </SheetContent>
          </Sheet>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-9 w-9 rounded-full p-0">
                <Avatar className="h-9 w-9">
                  <div className="flex h-full w-full items-center justify-center bg-[#9b87f5] text-white">
                    {user?.firstName?.[0] || user?.email?.[0]?.toUpperCase()}
                  </div>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="flex flex-col">
                <span className="font-medium">
                  {user?.firstName && user?.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : user?.email}
                </span>
                <span className="mt-0.5 text-xs font-normal text-gray-500">
                  {user?.role}
                </span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/manager/settings/profile')} className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                Profil
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/manager/settings')} className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                Ayarlar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                Çıkış Yap
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}