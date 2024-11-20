import { ManagerLayout } from "@/components/layouts/ManagerLayout";

export default function Music() {
  return (
    <ManagerLayout
      title="Music"
      description="Manage your music library"
    >
      <div className="space-y-6">
        <div className="rounded-lg bg-gray-100 p-8 text-center text-gray-500">
          Music management coming soon
        </div>
      </div>
    </ManagerLayout>
  );
}