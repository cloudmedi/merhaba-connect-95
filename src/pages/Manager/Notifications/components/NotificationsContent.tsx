import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NotificationsList } from "./NotificationsList";
import { NotificationSettings } from "./NotificationSettings";

export function NotificationsContent() {
  return (
    <Tabs defaultValue="all" className="space-y-4">
      <TabsList className="grid w-full grid-cols-1 md:grid-cols-2 gap-4">
        <TabsTrigger value="all">All Notifications</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>

      <TabsContent value="all" className="mt-6">
        <NotificationsList />
      </TabsContent>

      <TabsContent value="settings" className="mt-6">
        <NotificationSettings />
      </TabsContent>
    </Tabs>
  );
}