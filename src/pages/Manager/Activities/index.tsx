import { ManagerLayout } from "@/components/layouts/ManagerLayout";
import { RecentActivities } from "@/components/dashboard/RecentActivities";

export default function Activities() {
  return (
    <ManagerLayout
      title="Activities"
      description="Monitor system activities"
    >
      <div className="space-y-6">
        <RecentActivities />
      </div>
    </ManagerLayout>
  );
}