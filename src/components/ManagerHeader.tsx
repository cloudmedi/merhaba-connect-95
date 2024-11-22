import { Button } from "@/components/ui/button";
import { ArrowLeft, LogOut } from "lucide-react";
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
    <header className="bg-white border-b p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800">Manager Panel</h1>
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 h-auto p-2 hover:bg-gray-50">
                <Avatar className="h-8 w-8">
                  <div className="bg-purple-100 text-purple-600 h-full w-full flex items-center justify-center font-medium">
                    {user?.firstName?.[0] || user?.email?.[0].toUpperCase()}
                  </div>
                </Avatar>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium">
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
              className="flex items-center gap-2 text-purple-600 border-purple-200 hover:bg-purple-50"
            >
              <ArrowLeft className="w-4 h-4" />
              Super Admin'e Geri Dön
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}