import { UsersHeader } from "./components/UsersHeader";
import { UsersTable } from "./components/UsersTable";
import { UsersFilters } from "./components/UsersFilters";
import { DashboardLayout } from "@/components/DashboardLayout";
import { BrowserRouter } from "react-router-dom";

export default function Users() {
  return (
    <DashboardLayout title="Users">
      <BrowserRouter>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <UsersFilters />
            <UsersHeader />
          </div>
          <UsersTable />
        </div>
      </BrowserRouter>
    </DashboardLayout>
  );
}