import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Eye, 
  Pencil, 
  History, 
  Lock, 
  Key, 
  RotateCcw, 
  Trash,
  Check,
  X 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface User {
  id: string;
  name: string;
  email: string;
  company: string;
  role: string;
  status: 'active' | 'blocked';
  license: 'trial' | 'premium';
  expiry: string;
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "Jane Smith",
    email: "jane@example.com",
    company: "Tech Solutions",
    role: "Member",
    status: "active",
    license: "trial",
    expiry: "15.03.2024"
  },
  {
    id: "2",
    name: "John Doe",
    email: "john@example.com",
    company: "Acme Corp",
    role: "Admin",
    status: "active",
    license: "premium",
    expiry: "31.12.2024"
  },
  {
    id: "3",
    name: "Mike Johnson",
    email: "mike@example.com",
    company: "Digital Labs",
    role: "Member",
    status: "blocked",
    license: "trial",
    expiry: "15.02.2024"
  }
];

export function UsersTable() {
  const { toast } = useToast();

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

  const handleResetPassword = (userId: string) => {
    toast({
      title: "Reset Password",
      description: `Password reset initiated for user ID: ${userId}`,
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
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>NAME</TableHead>
            <TableHead>EMAIL</TableHead>
            <TableHead>COMPANY</TableHead>
            <TableHead>ROLE</TableHead>
            <TableHead>STATUS</TableHead>
            <TableHead>LICENSE</TableHead>
            <TableHead>EXPIRY</TableHead>
            <TableHead className="text-right">ACTIONS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockUsers.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.company}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell>
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
              </TableCell>
              <TableCell>
                <Badge 
                  variant="secondary"
                  className="bg-[#9b87f5]/10 text-[#9b87f5] hover:bg-[#9b87f5]/20"
                >
                  {user.license}
                </Badge>
              </TableCell>
              <TableCell>{user.expiry}</TableCell>
              <TableCell className="text-right space-x-1">
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
                        onClick={() => handleResetPassword(user.id)}
                      >
                        <Key className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Reset Password</p>
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}