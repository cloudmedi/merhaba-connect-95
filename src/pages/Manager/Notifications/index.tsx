import { NotificationsContent } from "./components/NotificationsContent";
import { DashboardLayout } from "@/components/DashboardLayout";

export default function Notifications() {
  return (
    <DashboardLayout 
      title="Notifications" 
      description="View and manage your notifications"
    >
      <NotificationsContent />
    </DashboardLayout>
  );
}