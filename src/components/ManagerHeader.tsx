import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function ManagerHeader() {
  const navigate = useNavigate();
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
    </header>
  );
}