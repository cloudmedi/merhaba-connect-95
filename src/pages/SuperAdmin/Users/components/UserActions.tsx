import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Eye, Pencil, History, Lock, Users, RotateCcw, Trash } from "lucide-react";
import { User } from "@/types/auth";
import { toast } from "sonner";
import { useState } from "react";
import { EditUserDialog } from "./EditUserDialog";

interface UserActionsProps {
  user: User;
}

export function UserActions({ user }: UserActionsProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleViewUser = () => {
    toast.info("View user details coming soon");
  };

  const handleViewHistory = () => {
    toast.info("View history coming soon");
  };

  const handleToggleBlock = () => {
    toast.info(`User ${user.isActive ? 'blocked' : 'unblocked'} coming soon`);
  };

  const handleNavigateToManager = () => {
    toast.info("Navigate to manager coming soon");
  };

  const handleRenewLicense = () => {
    toast.info("Renew license coming soon");
  };

  const handleDeleteUser = () => {
    toast.info("Delete user coming soon");
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
              className="h-8 w-8 text-gray-500 hover:text-[#9b87f5]"
              onClick={handleToggleBlock}
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

        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-red-500 hover:text-red-700"
              onClick={handleDeleteUser}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete User</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <EditUserDialog 
        user={user}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />
    </>
  );
}