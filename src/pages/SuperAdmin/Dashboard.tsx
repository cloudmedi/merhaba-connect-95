import { DashboardLayout } from "@/components/DashboardLayout";
import { SystemStats } from "@/components/dashboard/SystemStats";
import { MetricsChart } from "@/components/dashboard/charts/MetricsChart";
import { ActivityChart } from "@/components/dashboard/charts/ActivityChart";

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <SystemStats />
        <div className="grid gap-6 md:grid-cols-2">
          <MetricsChart />
          <ActivityChart />
        </div>
      </div>
    </DashboardLayout>
  );
}