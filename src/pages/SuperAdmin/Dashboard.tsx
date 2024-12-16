import { AdminNav } from "@/components/AdminNav";
import { SystemStats } from "@/components/dashboard/SystemStats";

export default function Dashboard() {
  return (
    <div className="flex">
      <AdminNav />
      <main className="flex-1 p-8 bg-[#F8F9FC]">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500">Welcome back, Admin</p>
          </div>

          <SystemStats />
        </div>
      </main>
    </div>
  );
}