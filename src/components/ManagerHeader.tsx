import { Button } from "@/components/ui/button";
import { ArrowLeft, LogOut, Settings, User, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { Avatar } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Günaydın";
  if (hour >= 12 && hour < 17) return "İyi Günler";
  return "İyi Akşamlar";
};

const getUserDisplayName = (user: any) => {
  if (!user) return '';
  if (user.firstName) return user.firstName;
  if (user.email) return user.email.split('@')[0];
  return '';
};

export function ManagerHeader() {
  const navigate = useNavigate();
  const { user, logout, isLoading } = useAuth();
  const managerView = localStorage.getItem('managerView');
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    if (user) {
      setUserData(user);
    }
  }, [user]);

  const displayName = getUserDisplayName(userData);
  const baseGreeting = getGreeting();
  const greeting = displayName ? `${baseGreeting}, ${displayName}` : baseGreeting;

  const handleReturnToSuperAdmin = () => {
    localStorage.removeItem('managerView');
    navigate('/super-admin/users');
    toast.success("Super Admin paneline geri dönüldü");
  };

  if (isLoading) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-white">
        <div className="flex h-16 items-center gap-4 px-6">
          <div className="h-6 w-48 animate-pulse bg-gray-200 rounded"></div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="flex h-16 items-center gap-4 px-6">
        {/* Left Section */}
        <div className="flex flex-1 items-center gap-4">
          <h1 className="text-lg font-semibold text-gray-900">
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
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
          </Button>

          {/* Profile Dropdown */}
          {userData && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-9 w-9 rounded-full p-0">
                  <Avatar className="h-9 w-9">
                    <div className="flex h-full w-full items-center justify-center bg-[#9b87f5] text-white">
                      {userData?.firstName?.[0] || userData?.email?.[0]?.toUpperCase()}
                    </div>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="flex flex-col">
                  <span className="font-medium">
                    {userData?.firstName && userData?.lastName
                      ? `${userData.firstName} ${userData.lastName}`
                      : userData?.email}
                  </span>
                  <span className="mt-0.5 text-xs font-normal text-gray-500">
                    {userData?.role}
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
          )}
        </div>
      </div>
    </header>
  );
}