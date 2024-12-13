import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus, Search } from "lucide-react";
import { useState } from "react";
import { CreateUserDialog } from "./CreateUserDialog";

interface UsersHeaderProps {
  onSearch: (value: string) => void;
  onRoleFilter: (value: string) => void;
  onStatusFilter: (value: string) => void;
  onLicenseFilter: (value: string) => void;
}

export function UsersHeader({ onSearch, onRoleFilter, onStatusFilter, onLicenseFilter }: UsersHeaderProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Users</h2>
          <p className="text-muted-foreground">
            Manage system users and their permissions
          </p>
        </div>
        <Button 
          onClick={() => setShowCreateDialog(true)}
          className="bg-[#9b87f5] hover:bg-[#7E69AB]"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative w-[400px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input 
            placeholder="Search users by name, email or company..." 
            className="pl-10"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
        
        <Select onValueChange={onRoleFilter} defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="super_admin">Super Admin</SelectItem>
            <SelectItem value="manager">Manager</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={onStatusFilter} defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="blocked">Blocked</SelectItem>
          </SelectContent>
        </Select>

        <Select onValueChange={onLicenseFilter} defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Licenses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Licenses</SelectItem>
            <SelectItem value="trial">Trial</SelectItem>
            <SelectItem value="premium">Premium</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <CreateUserDialog 
        open={showCreateDialog} 
        onOpenChange={setShowCreateDialog}
      />
    </div>
  );
}