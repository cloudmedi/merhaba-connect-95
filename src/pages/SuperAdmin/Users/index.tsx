import { UsersHeader } from "./components/UsersHeader";
import { UsersTable } from "./components/UsersTable";
import { UsersFilters } from "./components/UsersFilters";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useState } from "react";
import { User } from "./types";

export default function Users() {
  const [users] = useState<User[]>([]);
  const [currentPage] = useState(1);
  const [totalPages] = useState(1);
  const [totalCount] = useState(0);
  const itemsPerPage = 10;

  const handlePageChange = (page: number) => {
    // Handle page change
  };

  const handleStatusChange = () => {
    // Handle status change
  };

  const handleDelete = (id: string) => {
    // Handle delete
  };

  return (
    <DashboardLayout title="Users">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <UsersFilters />
          <UsersHeader />
        </div>
        <UsersTable 
          users={users}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
          totalCount={totalCount}
          itemsPerPage={itemsPerPage}
        />
      </div>
    </DashboardLayout>
  );
}