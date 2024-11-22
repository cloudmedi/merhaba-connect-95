import { Button } from "@/components/ui/button";
import { ArrowLeft, LogOut, Settings, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { Avatar } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ManagerHeader() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const managerView = localStorage.getItem('managerView');

  const handleReturnToSuperAdmin = () => {
    localStorage.removeItem('managerView');
    navigate('/super-admin/users');
    toast.success("Super Admin paneline geri dönüldü");
  };

  return (
    <header className="bg-white border-b">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex items-center justify-end h-14">
          <div className="flex items-center gap-6">
            {managerView && (
              <Button 
                variant="outline" 
                onClick={handleReturnToSuperAdmin}
                className="flex items-center gap-2 text-[#9b87f5] border-[#9b87f5] hover:bg-[#9b87f5]/5"
              >
                <ArrowLeft className="w-4 h-4" />
                Super Admin'e Geri Dön
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-9 w-9 p-0 rounded-full">
                  <Avatar className="h-9 w-9">
                    <div className="bg-[#9b87f5] text-white h-full w-full flex items-center justify-center">
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
                  <span className="text-xs text-gray-500 font-normal mt-0.5">{user?.role}</span>
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
                <DropdownMenuItem onClick={logout} className="text-red-600 cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Çıkış Yap
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}