import { User } from '@/types/auth';

export interface UsersTableProps {
  users: User[];
  isLoading: boolean;
}

export function UsersTable({ users, isLoading }: UsersTableProps) {
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="rounded-md border">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="p-4 text-left">User</th>
            <th className="p-4 text-left">Role</th>
            <th className="p-4 text-left">Status</th>
            <th className="p-4 text-left">License</th>
            <th className="p-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b">
              <td className="p-4">
                <div className="flex items-center gap-3">
                  <div>
                    <p className="font-medium">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
              </td>
              <td className="p-4">{user.role}</td>
              <td className="p-4">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className="p-4">
                {user.license ? (
                  <div>
                    <p>{user.license.type}</p>
                    <p className="text-sm text-gray-500">
                      Expires: {new Date(user.license.end_date).toLocaleDateString()}
                    </p>
                  </div>
                ) : (
                  <span className="text-gray-500">No license</span>
                )}
              </td>
              <td className="p-4">
                {/* Add your action buttons here */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}