import { Button } from "@/components/ui/button";
import { ArrowLeft, LogOut, UserRound } from "lucide-react";
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
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-semibold text-gray-900">Manager Panel</h1>
            <div className="h-6 w-[1px] bg-gray-200" />
            <span className="text-gray-600">
              Merhaba, <span className="font-medium">{user?.firstName || user?.email?.split('@')[0]}</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-3 h-auto py-2 px-3 hover:bg-gray-50 border rounded-full">
                  <Avatar className="h-8 w-8">
                    <div className="bg-[#9b87f5] text-white h-full w-full flex items-center justify-center">
                      <UserRound className="h-5 w-5" />
                    </div>
                  </Avatar>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium text-gray-700">
                      {user?.firstName && user?.lastName
                        ? `${user.firstName} ${user.lastName}`
                        : user?.email}
                    </span>
                    <span className="text-xs text-gray-500 capitalize">{user?.role}</span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Hesabım</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-red-600 cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Çıkış Yap
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

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
          </div>
        </div>
      </div>
    </header>
  );
}