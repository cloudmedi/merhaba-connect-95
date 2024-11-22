import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { LicenseRenewalDialog } from "./LicenseRenewalDialog";
import { ViewUserDialog } from "./ViewUserDialog";
import { EditUserDialog } from "./EditUserDialog";
import { UserHistoryDialog } from "./UserHistoryDialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services/users";
import { toast } from "sonner";
import { User } from "@/types/auth";

interface UserActionsProps {
  user: User;
}

export function UserActions({ user }: UserActionsProps) {
  const [showRenewDialog, setShowRenewDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const queryClient = useQueryClient();

  const deleteUserMutation = useMutation({
    mutationFn: () => userService.deleteUser(user.id),
    onSuccess: () => {
      toast.success("Kullanıcı başarıyla silindi");
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setShowDeleteDialog(false);
    },
    onError: (error: Error) => {
      toast.error("Kullanıcı silinirken hata oluştu: " + error.message);
    },
  });

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setShowViewDialog(true)}>
            Görüntüle
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
            Düzenle
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowRenewDialog(true)}>
            Lisansı Yenile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowHistoryDialog(true)}>
            Geçmiş
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="text-red-600"
            onClick={() => setShowDeleteDialog(true)}
          >
            Sil
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <LicenseRenewalDialog
        user={user}
        open={showRenewDialog}
        onOpenChange={setShowRenewDialog}
      />

      <ViewUserDialog
        user={user}
        open={showViewDialog}
        onOpenChange={setShowViewDialog}
      />

      <EditUserDialog
        user={user}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
      />

      <UserHistoryDialog
        user={user}
        open={showHistoryDialog}
        onOpenChange={setShowHistoryDialog}
      />

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Kullanıcıyı Sil</AlertDialogTitle>
            <AlertDialogDescription>
              Bu işlem geri alınamaz. Kullanıcı ve ilişkili tüm veriler kalıcı olarak silinecektir.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteUserMutation.mutate()}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteUserMutation.isPending ? "Siliniyor..." : "Sil"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}