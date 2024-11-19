import { DashboardLayout } from "@/components/DashboardLayout";
import { NotificationsContent } from "./NotificationsContent";

export default function Notifications() {
  return (
    <DashboardLayout 
      title="Notification Management" 
      description="Manage and send notifications to users, managers, and players"
    >
      <NotificationsContent />
    </DashboardLayout>
  );
}