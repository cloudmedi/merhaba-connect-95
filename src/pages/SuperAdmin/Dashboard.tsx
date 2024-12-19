import { DashboardLayout } from "@/components/DashboardLayout";
import { SystemStats } from "@/components/dashboard/SystemStats";

export default function Dashboard() {
  return (
    <DashboardLayout>
      <SystemStats />
    </DashboardLayout>
  );
}