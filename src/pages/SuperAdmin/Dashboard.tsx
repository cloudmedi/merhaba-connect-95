import { AdminNav } from "@/components/AdminNav";
import { SystemStats } from "@/components/dashboard/SystemStats";
import { AdminHeader } from "@/components/AdminHeader";

export default function Dashboard() {
  return (
    <div className="flex">
      <AdminNav />
      <main className="flex-1 bg-[#F8F9FC]">
        <AdminHeader />
        <div className="p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            <SystemStats />
          </div>
        </div>
      </main>
    </div>
  );
}