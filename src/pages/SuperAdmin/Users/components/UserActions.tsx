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
import { useNavigate } from "react-router-dom";

interface UserActionsProps {
  user: User;
}

export function UserActions({ user }: UserActionsProps) {
  const [showRenewDialog, setShowRenewDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showBlockDialog, setShowBlockDialog] = useState(false);
  
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const toggleBlockMutation = useMutation({
    mutationFn: () => userService.toggleUserStatus(user.id, !user.isActive),
    onSuccess: () => {
      toast.success(`User has been ${user.isActive ? 'blocked' : 'unblocked'}`);
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setShowBlockDialog(false);
    },
    onError: (error: Error) => {
      toast.error("Failed to update user status: " + error.message);
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: () => userService.deleteUser(user.id),
    onSuccess: () => {
      toast.success("User deleted successfully");
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setShowDeleteDialog(false);
    },
    onError: (error: Error) => {
      toast.error("Failed to delete user: " + error.message);
    },
  });

  const handleSwitchToManager = () => {
    if (user.role !== 'manager') {
      toast.error("This user is not a manager");
      return;
    }

    localStorage.setItem('managerView', JSON.stringify({
      id: user.id,
      email: user.email,
      companyId: user.companyId
    }));

    navigate(`/manager`);
    toast.success("Redirecting to manager panel");
  };

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
            View
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowRenewDialog(true)}>
            Renew License
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowHistoryDialog(true)}>
            History
          </DropdownMenuItem>
          {user.role === 'manager' && (
            <DropdownMenuItem onClick={handleSwitchToManager}>
              Switch to Manager Account
            </DropdownMenuItem>
          )}
          <DropdownMenuItem 
            className={user.isActive ? "text-red-600" : "text-green-600"}
            onClick={() => setShowBlockDialog(true)}
          >
            {user.isActive ? 'Block User' : 'Unblock User'}
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="text-red-600"
            onClick={() => setShowDeleteDialog(true)}
          >
            Delete
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

      <AlertDialog open={showBlockDialog} onOpenChange={setShowBlockDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {user.isActive ? 'Block User' : 'Unblock User'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {user.isActive 
                ? 'This action will prevent the user from accessing the system. They will be logged out and unable to log back in until unblocked.'
                : 'This action will restore the user\'s access to the system.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => toggleBlockMutation.mutate()}
              className={user.isActive ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
            >
              {toggleBlockMutation.isPending 
                ? "Processing..." 
                : user.isActive 
                  ? "Block User" 
                  : "Unblock User"
              }
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The user and all associated data will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteUserMutation.mutate()}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteUserMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}