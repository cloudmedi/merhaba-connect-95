import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Check, X, Eye, Pencil, History, Lock, Users, RotateCcw, Trash } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  name: string;
  email: string;
  company: string;
  role: string;
  status: 'active' | 'blocked';
  license: 'trial' | 'premium';
  expiry: string;
  avatar?: string;
}

interface UserTableRowProps {
  user: User;
}

export function UserTableRow({ user }: UserTableRowProps) {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleViewUser = (userId: string) => {
    toast({
      title: "View User Details",
      description: `Viewing details for user ID: ${userId}`,
    });
  };

  const handleEditUser = (userId: string) => {
    toast({
      title: "Edit User",
      description: `Editing user ID: ${userId}`,
    });
  };

  const handleViewHistory = (userId: string) => {
    toast({
      title: "View History",
      description: `Viewing history for user ID: ${userId}`,
    });
  };

  const handleToggleBlock = (userId: string, currentStatus: string) => {
    const action = currentStatus === 'active' ? 'blocked' : 'unblocked';
    toast({
      title: `User ${action}`,
      description: `User ID ${userId} has been ${action}`,
    });
  };

  const handleNavigateToManager = (userId: string) => {
    navigate(`/manager/${userId}`);
    toast({
      title: "Navigating to Manager",
      description: "Redirecting to admin manager page",
    });
  };

  const handleRenewLicense = (userId: string) => {
    toast({
      title: "Renew License",
      description: `License renewal initiated for user ID: ${userId}`,
    });
  };

  const handleDeleteUser = (userId: string) => {
    toast({
      title: "Delete User",
      description: `User ID ${userId} has been deleted`,
      variant: "destructive",
    });
  };

  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} />
            ) : (
              <div className="bg-purple-100 text-purple-600 h-full w-full flex items-center justify-center">
                {user.name.charAt(0)}
              </div>
            )}
          </Avatar>
          <div>
            <h4 className="text-sm font-medium">{user.name}</h4>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
      </td>
      <td className="p-4">{user.company}</td>
      <td className="p-4">{user.role}</td>
      <td className="p-4">
        <Badge 
          variant={user.status === 'active' ? 'default' : 'destructive'}
          className={user.status === 'active' 
            ? 'bg-green-100 text-green-800 hover:bg-green-100' 
            : 'bg-red-100 text-red-800 hover:bg-red-100'}
        >
          {user.status === 'active' ? (
            <Check className="mr-1 h-3 w-3" />
          ) : (
            <X className="mr-1 h-3 w-3" />
          )}
          {user.status}
        </Badge>
      </td>
      <td className="p-4">
        <Badge 
          variant="secondary"
          className="bg-[#9b87f5]/10 text-[#9b87f5] hover:bg-[#9b87f5]/20"
        >
          {user.license}
        </Badge>
      </td>
      <td className="p-4">{user.expiry}</td>
      <td className="p-4 text-right space-x-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-gray-500 hover:text-[#9b87f5]"
                onClick={() => handleViewUser(user.id)}
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
                onClick={() => handleEditUser(user.id)}
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
                onClick={() => handleViewHistory(user.id)}
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
                onClick={() => handleToggleBlock(user.id, user.status)}
              >
                <Lock className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{user.status === 'active' ? 'Block User' : 'Unblock User'}</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-gray-500 hover:text-[#9b87f5]"
                onClick={() => handleNavigateToManager(user.id)}
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
                onClick={() => handleRenewLicense(user.id)}
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
                onClick={() => handleDeleteUser(user.id)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete User</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </td>
    </tr>
  );
}