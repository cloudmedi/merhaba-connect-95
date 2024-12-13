import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { EditUserDialog } from "./EditUserDialog";
import { ViewUserDialog } from "./ViewUserDialog";
import { UserHistoryDialog } from "./UserHistoryDialog";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types/auth";
import { UserTableRow } from "./UserTableRow";

export function UsersTable({ users, isLoading }: { users: User[], isLoading: boolean }) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  const queryClient = useQueryClient();

  const handleDelete = async (user: User) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id);

      if (error) throw error;
      toast.success('User deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    } catch (error: any) {
      toast.error('Failed to delete user: ' + error.message);
    }
  };

  const handleSaveUser = async (userData: Partial<User>) => {
    try {
      if (!selectedUser?.id) return;

      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: userData.firstName,
          last_name: userData.lastName,
          email: userData.email,
          role: userData.role,
        })
        .eq('id', selectedUser.id);

      if (error) throw error;

      toast.success('User updated successfully');
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setShowEditDialog(false);
    } catch (error: any) {
      toast.error('Failed to update user: ' + error.message);
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
            onSave={handleSaveUser}
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