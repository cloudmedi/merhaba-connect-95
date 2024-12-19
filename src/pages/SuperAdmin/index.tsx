import { Outlet } from "react-router-dom";
import { AdminNav } from "@/components/AdminNav";
import { AdminHeader } from "@/components/AdminHeader";

export default function SuperAdmin() {
  return (
    <div className="flex min-h-screen bg-[#F8F9FC]">
      <AdminNav />
      <main className="flex-1 overflow-auto w-full md:w-[calc(100%-16rem)] ml-0 md:ml-64">
        <AdminHeader />
        <div className="p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}