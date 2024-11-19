import { AdminNav } from "@/components/AdminNav";
import { SystemStats } from "@/components/dashboard/SystemStats";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RecentActivities } from "@/components/dashboard/RecentActivities";

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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <RecentActivities />
            </div>
            <QuickActions />
          </div>
        </div>
      </main>
    </div>
  );
}