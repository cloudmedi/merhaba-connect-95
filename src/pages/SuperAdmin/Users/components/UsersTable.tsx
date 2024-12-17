import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserStatus } from "./UserStatus";
import { UserActions } from "./UserActions";
import { UserAvatar } from "./UserAvatar";
import { TablePagination } from "./TablePagination";
import { User } from "../types";

interface UsersTableProps {
  users: User[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onStatusChange: () => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
  totalCount: number;
  itemsPerPage: number;
}

export function UsersTable({
  users,
  currentPage,
  totalPages,
  onPageChange,
  onStatusChange,
  onDelete,
  isLoading,
  totalCount,
  itemsPerPage
}: UsersTableProps) {
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Pagination calculations
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalCount);

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <ScrollArea className="h-[calc(100vh-300px)]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>License</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-4">
                      <UserAvatar user={user} />
                      <div>
                        <div className="font-medium">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <UserStatus isActive={user.isActive} />
                  </TableCell>
                  <TableCell>
                    {user.license ? (
                      <div className="text-sm">
                        <div>Start: {new Date(user.license.startDate).toLocaleDateString()}</div>
                        <div>End: {new Date(user.license.endDate).toLocaleDateString()}</div>
                      </div>
                    ) : (
                      "No license"
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <UserActions
                      user={user}
                      onStatusChange={onStatusChange}
                      onDelete={onDelete}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>

      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        startIndex={startIndex}
        endIndex={endIndex}
        totalItems={totalCount}
      />
    </div>
  );
}