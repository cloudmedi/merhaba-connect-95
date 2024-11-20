import { ManagerLayout } from "@/components/layouts/ManagerLayout";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

export default function Schedule() {
  return (
    <ManagerLayout
      title="Schedule"
      description="Manage your schedules"
    >
      <div className="space-y-6">
        <Button className="gap-2">
          <Calendar className="h-4 w-4" />
          New Schedule
        </Button>
        <div className="rounded-lg bg-gray-100 p-8 text-center text-gray-500">
          Schedule feature coming soon
        </div>
      </div>
    </ManagerLayout>
  );
}