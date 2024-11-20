import { ManagerLayout } from "@/components/layouts/ManagerLayout";

export default function Moods() {
  return (
    <ManagerLayout
      title="Moods"
      description="Manage music moods"
    >
      <div className="space-y-6">
        <div className="rounded-lg bg-gray-100 p-8 text-center text-gray-500">
          Mood management coming soon
        </div>
      </div>
    </ManagerLayout>
  );
}