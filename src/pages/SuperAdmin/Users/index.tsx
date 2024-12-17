import { UsersHeader } from "./components/UsersHeader";
import { UsersTable } from "./components/UsersTable";
import { UsersFilters } from "./components/UsersFilters";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useState, useEffect } from "react";
import { User } from "./types";
import { userService } from "@/services/users";
import { toast } from "sonner";

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 10;

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await userService.getUsers();
      setUsers(response);
      setTotalCount(response.length);
      setTotalPages(Math.ceil(response.length / itemsPerPage));
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleStatusChange = async (userId: string) => {
    try {
      const user = users.find(u => u.id === userId);
      if (user) {
        await userService.toggleUserStatus(userId, !user.isActive);
        await fetchUsers();
        toast.success('User status updated successfully');
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Failed to update user status');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await userService.deleteUser(id);
      await fetchUsers();
      toast.success('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  const paginatedUsers = users.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <DashboardLayout title="Users">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <UsersFilters />
          <UsersHeader />
        </div>
        <UsersTable 
          users={paginatedUsers}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
          totalCount={totalCount}
          itemsPerPage={itemsPerPage}
          isLoading={isLoading}
        />
      </div>
    </DashboardLayout>
  );
}