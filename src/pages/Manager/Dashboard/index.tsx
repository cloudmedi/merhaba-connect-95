import { ManagerLayout } from "@/components/layouts/ManagerLayout";
import { RecentActivities } from "@/components/dashboard/RecentActivities";

export default function Dashboard() {
  return (
    <ManagerLayout
      title="Dashboard"
      description="Overview of your media system"
    >
      <div className="grid gap-6">
        <RecentActivities />
      </div>
    </ManagerLayout>
  );
}