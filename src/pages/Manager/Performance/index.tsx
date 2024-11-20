import { ManagerLayout } from "@/components/layouts/ManagerLayout";

export default function Performance() {
  return (
    <ManagerLayout
      title="Performance"
      description="View system performance metrics"
    >
      <div className="space-y-6">
        <div className="rounded-lg bg-gray-100 p-8 text-center text-gray-500">
          Performance metrics coming soon
        </div>
      </div>
    </ManagerLayout>
  );
}