import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BulkNotifications } from "./components/BulkNotifications";
import { NotificationTemplates } from "./components/NotificationTemplates";
import { AutomationRules } from "./components/AutomationRules";
import { NotificationHistory } from "./components/NotificationHistory";

export function NotificationsContent() {
  return (
    <Tabs defaultValue="bulk" className="space-y-4">
      <TabsList className="grid w-full grid-cols-1 md:grid-cols-4 gap-4">
        <TabsTrigger value="bulk">Bulk Notifications</TabsTrigger>
        <TabsTrigger value="templates">Templates</TabsTrigger>
        <TabsTrigger value="automation">Automation Rules</TabsTrigger>
        <TabsTrigger value="history">History</TabsTrigger>
      </TabsList>

      <TabsContent value="bulk">
        <BulkNotifications />
      </TabsContent>

      <TabsContent value="templates">
        <NotificationTemplates />
      </TabsContent>

      <TabsContent value="automation">
        <AutomationRules />
      </TabsContent>

      <TabsContent value="history">
        <NotificationHistory />
      </TabsContent>
    </Tabs>
  );
}