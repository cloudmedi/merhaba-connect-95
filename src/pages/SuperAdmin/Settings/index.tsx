import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppSettings } from "./components/AppSettings";
import { SecuritySettings } from "./components/SecuritySettings";
import { NotificationSettings } from "./components/NotificationSettings";

export default function Settings() {
  return (
    <main className="p-8 bg-[#F8F9FC]">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-500">Manage system settings</p>
        </div>

        <Tabs defaultValue="app" className="space-y-6">
          <TabsList>
            <TabsTrigger value="app">App Settings</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          <TabsContent value="app">
            <AppSettings />
          </TabsContent>
          <TabsContent value="security">
            <SecuritySettings />
          </TabsContent>
          <TabsContent value="notifications">
            <NotificationSettings />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}