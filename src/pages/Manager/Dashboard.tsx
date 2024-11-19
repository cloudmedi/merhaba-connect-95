import { DashboardLayout } from "@/components/DashboardLayout";
import { RecentActivities } from "@/components/dashboard/RecentActivities";

export default function Dashboard() {
  return (
    <DashboardLayout
      title="Dashboard"
      description="Overview of your media system"
    >
      <div className="grid gap-6">
        <RecentActivities />
      </div>
    </DashboardLayout>
  );
}