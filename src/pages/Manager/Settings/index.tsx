import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-sm text-gray-500">Manage your account and application settings</p>
      </div>

      <Card className="p-6">
        <Tabs defaultValue="account">
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
          </TabsList>
          <TabsContent value="account" className="p-4">
            <div className="text-gray-500">
              Account settings will be implemented here
            </div>
          </TabsContent>
          <TabsContent value="notifications" className="p-4">
            <div className="text-gray-500">
              Notification preferences will be implemented here
            </div>
          </TabsContent>
          <TabsContent value="appearance" className="p-4">
            <div className="text-gray-500">
              Appearance settings will be implemented here
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}