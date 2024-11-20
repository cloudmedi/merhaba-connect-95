import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Eye, Pencil, History, Lock, Users, RotateCcw, Trash } from "lucide-react";
import { User } from "@/types/auth";
import { toast } from "sonner";
import { useState } from "react";
import { EditUserDialog } from "./EditUserDialog";
import { userService } from "@/services/users";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";

interface UserActionsProps {
  user: User;
}

export function UserActions({ user }: UserActionsProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const toggleStatusMutation = useMutation({
    mutationFn: () => userService.toggleUserStatus(user.id, !user.isActive),
    onSuccess: () => {
      toast.success(`Kullanıcı ${user.isActive ? 'pasif' : 'aktif'} duruma getirildi`);
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error) => {
      toast.error("Kullanıcı durumu güncellenirken hata oluştu: " + error);
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: () => userService.deleteUser(user.id),
    onSuccess: () => {
      toast.success("Kullanıcı başarıyla silindi");
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error) => {
      toast.error("Kullanıcı silinirken hata oluştu: " + error);
    },
  });

  const handleViewUser = () => {
    toast.info("View user details coming soon");
  };

  const handleViewHistory = () => {
    toast.info("View history coming soon");
  };

  const handleToggleBlock = () => {
    toggleStatusMutation.mutate();
  };

  const handleNavigateToManager = () => {
    if (user.role !== 'manager') {
      toast.error("Bu kullanıcı bir yönetici değil");
      return;
    }

    // Simulate login as manager
    localStorage.setItem('managerView', JSON.stringify({
      id: user.id,
      email: user.email,
      companyId: user.companyId
    }));

    navigate(`/manager`);
    toast.success("Yönetici paneline yönlendiriliyorsunuz");
  };

  const handleRenewLicense = () => {
    toast.info("Renew license coming soon");
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-gray-500 hover:text-[#9b87f5]"
              onClick={handleViewUser}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>View Details</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-gray-500 hover:text-[#9b87f5]"
              onClick={() => setIsEditDialogOpen(true)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Edit User</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-gray-500 hover:text-[#9b87f5]"
              onClick={handleViewHistory}
            >
              <History className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>View History</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className={`h-8 w-8 ${toggleStatusMutation.isPending ? 'opacity-50 cursor-not-allowed' : 'text-gray-500 hover:text-[#9b87f5]'}`}
              onClick={handleToggleBlock}
              disabled={toggleStatusMutation.isPending}
            >
              <Lock className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{user.isActive ? 'Block User' : 'Unblock User'}</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-gray-500 hover:text-[#9b87f5]"
              onClick={handleNavigateToManager}
              disabled={user.role !== 'manager'}
            >
              <Users className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Go to Manager Page</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-gray-500 hover:text-[#9b87f5]"
              onClick={handleRenewLicense}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Renew License</p>
          </TooltipContent>
        </Tooltip>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-red-500 hover:text-red-700"
              disabled={deleteUserMutation.isPending}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Kullanıcıyı Sil</AlertDialogTitle>
              <AlertDialogDescription>
                Bu işlem geri alınamaz. Kullanıcıyı silmek istediğinizden emin misiniz?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>İptal</AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => deleteUserMutation.mutate()}
                className="bg-red-500 hover:bg-red-600"
              >
                {deleteUserMutation.isPending ? "Siliniyor..." : "Sil"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </TooltipProvider>

      <EditUserDialog 
        user={user}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />
    </>
  );
}