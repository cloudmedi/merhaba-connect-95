import { DashboardLayout } from "@/components/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ServerStatus } from "./components/ServerStatus";
import { ResourceUsage } from "./components/ResourceUsage";
import { ApiPerformance } from "./components/ApiPerformance";

export default function Performance() {
  return (
    <DashboardLayout
      title="System Performance"
      description="Monitor system health, resource usage, and API performance"
    >
      <Tabs defaultValue="server-status" className="space-y-4">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 gap-4">
          <TabsTrigger value="server-status">Server Status</TabsTrigger>
          <TabsTrigger value="resource-usage">Resource Usage</TabsTrigger>
          <TabsTrigger value="api-performance">API Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="server-status">
          <ServerStatus />
        </TabsContent>

        <TabsContent value="resource-usage">
          <ResourceUsage />
        </TabsContent>

        <TabsContent value="api-performance">
          <ApiPerformance />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}