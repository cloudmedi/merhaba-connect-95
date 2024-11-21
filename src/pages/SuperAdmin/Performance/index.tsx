import { DashboardLayout } from "@/components/DashboardLayout";
import { ServerStatus } from "./components/ServerStatus";
import { ResourceUsage } from "./components/ResourceUsage";
import { ApiPerformance } from "./components/ApiPerformance";

export default function Performance() {
  return (
    <DashboardLayout
      title="System Performance"
      description="Monitor system health, resource usage, and API performance metrics in real-time"
    >
      <div className="space-y-8">
        <ServerStatus />
        <ResourceUsage />
        <ApiPerformance />
      </div>
    </DashboardLayout>
  );
}