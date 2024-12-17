import { useState } from "react";
import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { EditUserDialog } from "./EditUserDialog";
import { ViewUserDialog } from "./ViewUserDialog";
import { LicenseRenewalDialog } from "./LicenseRenewalDialog";
import { User } from "../types";
import { toast } from "sonner";

interface UserActionsProps {
  user: User;
  onStatusChange: () => void;
  onDelete: (id: string) => void;
}

export function UserActions({ user, onStatusChange, onDelete }: UserActionsProps) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showLicenseDialog, setShowLicenseDialog] = useState(false);

  const handleStatusToggle = async () => {
    try {
      // API call to toggle user status
      toast.success(`User ${user.isActive ? 'deactivated' : 'activated'} successfully`);
      onStatusChange();
    } catch (error) {
      toast.error("Failed to update user status");
    }
  };

  const handleDelete = async () => {
    try {
      await onDelete(user.id);
      toast.success("User deleted successfully");
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setShowViewDialog(true)}>
            View Details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowLicenseDialog(true)}>
            Renew License
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleStatusToggle}>
            {user.isActive ? "Deactivate" : "Activate"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleDelete}
            className="text-red-600 focus:text-red-600"
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ViewUserDialog
        user={{
          id: user.id,
          first_name: user.firstName,
          last_name: user.lastName,
          email: user.email,
          license: user.license
        }}
        open={showViewDialog}
        onOpenChange={setShowViewDialog}
      />

      <EditUserDialog
        user={user}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
      />

      <LicenseRenewalDialog
        user={{
          id: user.id,
          name: `${user.firstName} ${user.lastName}`,
          license: user.license
        }}
        open={showLicenseDialog}
        onOpenChange={setShowLicenseDialog}
      />
    </>
  );
}