import { ManagerLayout } from "@/components/layouts/ManagerLayout";

export default function Notifications() {
  return (
    <ManagerLayout
      title="Notifications"
      description="Manage system notifications"
    >
      <div className="space-y-6">
        <div className="rounded-lg bg-gray-100 p-8 text-center text-gray-500">
          Notifications management coming soon
        </div>
      </div>
    </ManagerLayout>
  );
}