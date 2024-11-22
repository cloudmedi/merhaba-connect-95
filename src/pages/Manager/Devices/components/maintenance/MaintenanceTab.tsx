import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MaintenanceSchedule } from "./MaintenanceSchedule";
import { UpdateHistory } from "./UpdateHistory";
import { SystemLogs } from "./SystemLogs";
import { DiagnosticTools } from "./DiagnosticTools";

export function MaintenanceTab() {
  return (
    <Tabs defaultValue="schedule" className="w-full">
      <TabsList className="grid grid-cols-4 w-full">
        <TabsTrigger value="schedule">Schedule</TabsTrigger>
        <TabsTrigger value="history">Update History</TabsTrigger>
        <TabsTrigger value="logs">System Logs</TabsTrigger>
        <TabsTrigger value="diagnostics">Diagnostics</TabsTrigger>
      </TabsList>

      <TabsContent value="schedule">
        <MaintenanceSchedule />
      </TabsContent>

      <TabsContent value="history">
        <UpdateHistory />
      </TabsContent>

      <TabsContent value="logs">
        <SystemLogs />
      </TabsContent>

      <TabsContent value="diagnostics">
        <DiagnosticTools />
      </TabsContent>
    </Tabs>
  );
}