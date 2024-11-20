import { ManagerLayout } from "@/components/layouts/ManagerLayout";
import { RecentActivities } from "@/components/dashboard/RecentActivities";
import { QuickActions } from "@/components/dashboard/QuickActions";

export default function Dashboard() {
  return (
    <ManagerLayout
      title="Dashboard"
      description="Overview of your media system"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <QuickActions />
        <RecentActivities />
      </div>
    </ManagerLayout>
  );
}