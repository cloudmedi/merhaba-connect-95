import { ManagerLayout } from "@/components/layouts/ManagerLayout";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

export default function Settings() {
  return (
    <ManagerLayout
      title="Settings"
      description="Manage system settings"
    >
      <div className="space-y-6">
        <Button className="gap-2">
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
        <div className="rounded-lg bg-gray-100 p-8 text-center text-gray-500">
          Settings feature coming soon
        </div>
      </div>
    </ManagerLayout>
  );
}