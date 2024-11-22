import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Notifications() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Notifications</h1>
        <p className="text-sm text-gray-500">Manage your notifications and preferences</p>
      </div>

      <Card className="p-6">
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="p-4">
            <div className="text-center text-gray-500 py-8">
              No notifications yet
            </div>
          </TabsContent>
          <TabsContent value="unread" className="p-4">
            <div className="text-center text-gray-500 py-8">
              No unread notifications
            </div>
          </TabsContent>
          <TabsContent value="system" className="p-4">
            <div className="text-center text-gray-500 py-8">
              No system notifications
            </div>
          </TabsContent>
          <TabsContent value="alerts" className="p-4">
            <div className="text-center text-gray-500 py-8">
              No alerts
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}