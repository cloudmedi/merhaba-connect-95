import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AppSettings } from "./components/AppSettings";
import { SecuritySettings } from "./components/SecuritySettings";
import { EmailSettings } from "./components/EmailSettings";
import { NotificationSettings } from "./components/NotificationSettings";
import { BackupSettings } from "./components/BackupSettings";
import { ApiKeys } from "./components/ApiKeys";
import { SystemUpdates } from "./components/SystemUpdates";
import { AuditLogs } from "./components/AuditLogs";
import { SystemLogs } from "./components/SystemLogs";
import { DashboardLayout } from "@/components/DashboardLayout";

export default function Settings() {
  return (
    <DashboardLayout
      title="Settings"
      description="Manage your application settings and configurations"
    >
      <Tabs defaultValue="app" className="space-y-4">
        <TabsList>
          <TabsTrigger value="app">App</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="updates">System Updates</TabsTrigger>
          <TabsTrigger value="backup">Backup</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>
        <TabsContent value="app">
          <AppSettings />
        </TabsContent>
        <TabsContent value="security">
          <SecuritySettings />
        </TabsContent>
        <TabsContent value="email">
          <EmailSettings />
        </TabsContent>
        <TabsContent value="notifications">
          <NotificationSettings />
        </TabsContent>
        <TabsContent value="updates">
          <SystemUpdates />
        </TabsContent>
        <TabsContent value="backup">
          <BackupSettings />
        </TabsContent>
        <TabsContent value="api">
          <ApiKeys />
        </TabsContent>
        <TabsContent value="logs">
          <div className="grid gap-6">
            <AuditLogs />
            <SystemLogs />
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}