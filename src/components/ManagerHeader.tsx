import { Button } from "@/components/ui/button";
import { ArrowLeft, LogOut, Settings, User, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { Avatar } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface OnlineUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  lastSeen: string;
}

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
  const managerView = localStorage.getItem('managerView');
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);

  useEffect(() => {
    if (!user) return;

    // Presence kanalını oluştur
    const channel = supabase.channel('online-users', {
      config: {
        presence: {
          key: user.id,
        },
      },
    });

    // Kullanıcı durumunu izle
    channel
      .on('presence', { event: 'sync' }, () => {
        const presenceState = channel.presenceState();
        const users = Object.values(presenceState).flat().map((p: any) => ({
          id: p.user_id,
          email: p.email,
          firstName: p.firstName,
          lastName: p.lastName,
          lastSeen: new Date().toISOString(),
        }));
        setOnlineUsers(users);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            user_id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            online_at: new Date().toISOString(),
          });
        }
      });

    return () => {
      channel.unsubscribe();
    };
  }, [user]);

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
          {/* Online Users */}
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <div className="flex -space-x-2">
                  {onlineUsers.slice(0, 3).map((onlineUser) => (
                    <Avatar key={onlineUser.id} className="h-6 w-6 border-2 border-white">
                      <div className="flex h-full w-full items-center justify-center bg-[#9b87f5] text-white text-xs">
                        {onlineUser.firstName?.[0] || onlineUser.email[0].toUpperCase()}
                      </div>
                    </Avatar>
                  ))}
                </div>
                {onlineUsers.length > 3 && (
                  <span className="absolute -right-1 -top-1 h-5 w-5 rounded-full bg-[#9b87f5] text-xs text-white flex items-center justify-center">
                    +{onlineUsers.length - 3}
                  </span>
                )}
              </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-64">
              <div className="space-y-2">
                <h4 className="text-sm font-semibold">Çevrimiçi Yöneticiler</h4>
                <div className="space-y-1">
                  {onlineUsers.map((onlineUser) => (
                    <div key={onlineUser.id} className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <div className="flex h-full w-full items-center justify-center bg-[#9b87f5] text-white text-xs">
                          {onlineUser.firstName?.[0] || onlineUser.email[0].toUpperCase()}
                        </div>
                      </Avatar>
                      <span className="text-sm">
                        {onlineUser.firstName && onlineUser.lastName
                          ? `${onlineUser.firstName} ${onlineUser.lastName}`
                          : onlineUser.email}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
          </Button>

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