import { ManagerLayout } from "@/components/layouts/ManagerLayout";
import { Button } from "@/components/ui/button";
import { Smartphone } from "lucide-react";

export default function Devices() {
  return (
    <ManagerLayout
      title="Devices"
      description="Manage connected devices"
    >
      <div className="space-y-6">
        <Button className="gap-2">
          <Smartphone className="h-4 w-4" />
          Add Device
        </Button>
        <div className="rounded-lg bg-gray-100 p-8 text-center text-gray-500">
          Devices feature coming soon
        </div>
      </div>
    </ManagerLayout>
  );
}