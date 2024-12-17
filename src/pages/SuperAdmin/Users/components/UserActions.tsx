import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditUserDialog } from "./EditUserDialog";
import { ViewUserDialog } from "./ViewUserDialog";
import { LicenseRenewalDialog } from "./LicenseRenewalDialog";
import { UserHistoryDialog } from "./UserHistoryDialog";
import { useUserActions } from "./hooks/useUserActions";
import { User } from "../types";
import { toast } from "sonner";

interface UserActionsProps {
  user: User;
  onStatusChange: () => void;
  onDelete?: (userId: string) => void;
}

export function UserActions({ user, onStatusChange, onDelete }: UserActionsProps) {
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isRenewalOpen, setIsRenewalOpen] = useState(false);

  const { handleStatusToggle, handleLicenseRenewal } = useUserActions();

  const handleToggleStatus = async () => {
    try {
      await handleStatusToggle(user.id, !user.isActive);
      onStatusChange();
      toast.success(`User ${user.isActive ? 'deactivated' : 'activated'} successfully`);
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  const handleRenewLicense = async (data: { startDate: string; endDate: string }) => {
    try {
      await handleLicenseRenewal(user.id, data);
      setIsRenewalOpen(false);
      onStatusChange();
      toast.success('License renewed successfully');
    } catch (error) {
      toast.error('Failed to renew license');
    }
  };

  const handleUpdate = () => {
    onStatusChange();
    setIsEditOpen(false);
  };

  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setIsViewOpen(true)}>
            View Details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsRenewalOpen(true)}>
            Renew License
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsHistoryOpen(true)}>
            View History
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleToggleStatus}>
            {user.isActive ? 'Deactivate' : 'Activate'}
          </DropdownMenuItem>
          {onDelete && (
            <DropdownMenuItem 
              onClick={() => onDelete(user.id)}
              className="text-red-600 hover:text-red-700"
            >
              Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <ViewUserDialog
        user={user}
        open={isViewOpen}
        onOpenChange={setIsViewOpen}
      />

      <EditUserDialog
        user={user}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onUpdate={handleUpdate}
      />

      <LicenseRenewalDialog
        user={user}
        open={isRenewalOpen}
        onOpenChange={setIsRenewalOpen}
        onSubmit={handleRenewLicense}
      />

      <UserHistoryDialog
        user={user}
        open={isHistoryOpen}
        onOpenChange={setIsHistoryOpen}
      />
    </div>
  );
}