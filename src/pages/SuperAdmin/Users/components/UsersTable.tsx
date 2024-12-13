import { User } from '@/types/auth';
import { UserStatus } from './UserStatus';
import { UserActions } from './UserActions';

export interface UsersTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onViewHistory: (user: User) => void;
}

export function UsersTable({ users, onEdit, onDelete, onViewHistory }: UsersTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Name</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Email</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Role</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b border-gray-200">
              <td className="px-4 py-3">
                {user.firstName} {user.lastName}
              </td>
              <td className="px-4 py-3">{user.email}</td>
              <td className="px-4 py-3 capitalize">{user.role}</td>
              <td className="px-4 py-3">
                <UserStatus status={user.isActive} />
              </td>
              <td className="px-4 py-3">
                <UserActions 
                  user={user}
                  onEdit={() => onEdit(user)}
                  onDelete={() => onDelete(user)}
                  onViewHistory={() => onViewHistory(user)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}