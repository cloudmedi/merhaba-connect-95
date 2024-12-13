import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { User, UserRole } from "@/types/auth";
import { UserActions } from "./UserActions";
import { UserStatus } from "./UserStatus";
import { UserAvatar } from "./UserAvatar";

interface UsersTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
  onViewHistory: (userId: string) => void;
}

export function UsersTable({ users, onEdit, onDelete, onViewHistory }: UsersTableProps) {
  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'super_admin':
        return 'text-purple-600 bg-purple-50';
      case 'manager':
        return 'text-blue-600 bg-blue-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">User</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>
              <UserAvatar user={user} />
            </TableCell>
            <TableCell>
              {user.firstName} {user.lastName}
            </TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                {user.role === 'super_admin' ? 'Super Admin' : 'Manager'}
              </span>
            </TableCell>
            <TableCell>
              <UserStatus isActive={user.isActive} />
            </TableCell>
            <TableCell className="text-right">
              <UserActions
                user={user}
                onEdit={() => onEdit(user)}
                onDelete={() => onDelete(user.id)}
                onViewHistory={() => onViewHistory(user.id)}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}