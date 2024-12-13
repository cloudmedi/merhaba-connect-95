import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { User } from "@/types/auth";
import { UserTableRow } from "./UserTableRow";
import { useState } from "react";
import { EditUserDialog } from "./EditUserDialog";
import { ViewUserDialog } from "./ViewUserDialog";
import { UserHistoryDialog } from "./UserHistoryDialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export interface UsersTableProps {
  users: User[];
  isLoading: boolean;
}

export function UsersTable({ users, isLoading }: UsersTableProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);

  const handleDelete = async (user: User) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id);

      if (error) throw error;
      toast.success('User deleted successfully');
    } catch (error: any) {
      toast.error('Failed to delete user: ' + error.message);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">User</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>License</TableHead>
              <TableHead>Expiry</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <UserTableRow
                key={user.id}
                user={user}
                onEdit={() => {
                  setSelectedUser(user);
                  setShowEditDialog(true);
                }}
                onDelete={() => handleDelete(user)}
                onViewHistory={() => {
                  setSelectedUser(user);
                  setShowHistoryDialog(true);
                }}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedUser && (
        <>
          <EditUserDialog
            user={selectedUser}
            open={showEditDialog}
            onOpenChange={setShowEditDialog}
          />
          <ViewUserDialog
            user={selectedUser}
            open={showViewDialog}
            onOpenChange={setShowViewDialog}
          />
          <UserHistoryDialog
            user={selectedUser}
            open={showHistoryDialog}
            onOpenChange={setShowHistoryDialog}
          />
        </>
      )}
    </>
  );
}