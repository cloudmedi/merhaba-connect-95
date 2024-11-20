import { ManagerLayout } from "@/components/layouts/ManagerLayout";

export default function Users() {
  return (
    <ManagerLayout
      title="Users"
      description="Manage system users"
    >
      <div className="space-y-6">
        <div className="rounded-lg bg-gray-100 p-8 text-center text-gray-500">
          Users management coming soon
        </div>
      </div>
    </ManagerLayout>
  );
}