import { ApiPerformance } from "./components/ApiPerformance";
import { ResourceUsage } from "./components/ResourceUsage";
import { ServerStatus } from "./components/ServerStatus";

export default function Performance() {
  return (
    <main className="p-8 bg-[#F8F9FC]">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Performance</h1>
          <p className="text-sm text-gray-500">System performance metrics</p>
        </div>

        <div className="grid gap-8">
          <ServerStatus />
          <ApiPerformance />
          <ResourceUsage />
        </div>
      </div>
    </main>
  );
}