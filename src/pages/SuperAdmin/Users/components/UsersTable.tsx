import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserStatus } from "./UserStatus";
import { UserActions } from "./UserActions";
import { TablePagination } from "./TablePagination";
import { User } from "../types";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface UsersTableProps {
  users: User[];
  currentPage: number;
  totalPages: number;
  totalCount: number;
  itemsPerPage: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  onStatusChange: (userId: string) => void;
  onDelete: (userId: string) => void;
}

export function UsersTable({
  users,
  currentPage,
  totalPages,
  totalCount,
  itemsPerPage,
  isLoading,
  onPageChange,
  onStatusChange,
  onDelete
}: UsersTableProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (!users.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        No users found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>License</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  {user.firstName} {user.lastName}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <UserStatus isActive={user.isActive} />
                </TableCell>
                <TableCell>
                  {user.license ? (
                    <span className="text-sm text-gray-500">
                      {user.license.type} - Expires: {new Date(user.license.endDate).toLocaleDateString()}
                    </span>
                  ) : (
                    <span className="text-sm text-gray-500">No license</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <UserActions
                    user={user}
                    onStatusChange={() => onStatusChange(user.id)}
                    onDelete={() => onDelete(user.id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        totalItems={totalCount}
      />
    </div>
  );
}