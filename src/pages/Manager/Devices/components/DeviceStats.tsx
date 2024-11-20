import { Card } from "@/components/ui/card";
import { Signal, AlertTriangle, Clock, Activity } from "lucide-react";

interface DeviceStatsProps {
  totalDevices: number;
  onlineDevices: number;
  offlineDevices: number;
  lastUpdated: string;
}

export function DeviceStats({ totalDevices, onlineDevices, offlineDevices, lastUpdated }: DeviceStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card className="bg-white shadow-sm">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Devices</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{totalDevices}</h3>
              <p className="text-xs text-gray-500 mt-2">Last updated: {lastUpdated}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
      </Card>

      <Card className="bg-white shadow-sm">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Online Devices</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{onlineDevices}</h3>
              <p className="text-xs text-emerald-600 mt-2">
                {Math.round((onlineDevices / totalDevices) * 100)}% connected
              </p>
            </div>
            <div className="p-3 bg-emerald-100 rounded-full">
              <Signal className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </div>
      </Card>

      <Card className="bg-white shadow-sm">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Offline Devices</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{offlineDevices}</h3>
              <p className="text-xs text-red-600 mt-2">
                {Math.round((offlineDevices / totalDevices) * 100)}% disconnected
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </Card>

      <Card className="bg-white shadow-sm">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Health Status</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">
                {Math.round((onlineDevices / totalDevices) * 100)}%
              </h3>
              <p className="text-xs text-emerald-600 mt-2">System health score</p>
            </div>
            <div className="p-3 bg-violet-100 rounded-full">
              <Activity className="h-6 w-6 text-violet-600" />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
