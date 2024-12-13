import { SystemHealthReport } from "./components/SystemHealthReport";
import { PlaylistHistoryReport } from "./components/PlaylistHistoryReport";
import { ManagerActivityReport } from "./components/ManagerActivityReport";

export default function Reports() {
  return (
    <main className="p-8 bg-[#F8F9FC]">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
          <p className="text-sm text-gray-500">System analytics and reports</p>
        </div>

        <div className="grid gap-8">
          <SystemHealthReport />
          <PlaylistHistoryReport />
          <ManagerActivityReport />
        </div>
      </div>
    </main>
  );
}