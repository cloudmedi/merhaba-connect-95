import { Routes, Route } from "react-router-dom";
import { DataTable } from "./components/UsersTable";

export default function Users() {
  return (
    <main className="p-8 bg-[#F8F9FC]">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          <p className="text-sm text-gray-500">Manage system users</p>
        </div>

        <DataTable />
      </div>
    </main>
  );
}