import { ManagerLayout } from "@/components/layouts/ManagerLayout";
import { Button } from "@/components/ui/button";
import { Megaphone } from "lucide-react";

export default function Announcements() {
  return (
    <ManagerLayout
      title="Announcements"
      description="Manage system announcements"
    >
      <div className="space-y-6">
        <Button className="gap-2">
          <Megaphone className="h-4 w-4" />
          New Announcement
        </Button>
        <div className="rounded-lg bg-gray-100 p-8 text-center text-gray-500">
          Announcements feature coming soon
        </div>
      </div>
    </ManagerLayout>
  );
}