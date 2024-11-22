import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Eye, History, RefreshCw, UserCheck, Trash2, ArrowRightLeft } from "lucide-react";
import { User } from "@/types/auth";
import { useUserActions } from "./hooks/useUserActions";

interface UserActionsProps {
  user: User;
}

export function UserActions({ user }: UserActionsProps) {
  const {
    setIsEditDialogOpen,
    setIsViewDialogOpen,
    setIsHistoryDialogOpen,
    setIsRenewalDialogOpen,
    toggleStatusMutation,
    deleteUserMutation,
    handleNavigateToManager,
  } = useUserActions(user);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {user.role === 'manager' && (
          <DropdownMenuItem onClick={handleNavigateToManager}>
            <ArrowRightLeft className="mr-2 h-4 w-4" />
            Switch to Account
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={() => setIsViewDialogOpen(true)}>
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setIsHistoryDialogOpen(true)}>
          <History className="mr-2 h-4 w-4" />
          History
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setIsRenewalDialogOpen(true)}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Renew License
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => toggleStatusMutation.mutate()}>
          <UserCheck className="mr-2 h-4 w-4" />
          Toggle Status
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => deleteUserMutation.mutate()}
          className="text-red-600"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}