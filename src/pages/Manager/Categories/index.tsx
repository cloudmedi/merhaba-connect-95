import { ManagerLayout } from "@/components/layouts/ManagerLayout";

export default function Categories() {
  return (
    <ManagerLayout
      title="Categories"
      description="Manage music categories"
    >
      <div className="space-y-6">
        <div className="rounded-lg bg-gray-100 p-8 text-center text-gray-500">
          Category management coming soon
        </div>
      </div>
    </ManagerLayout>
  );
}