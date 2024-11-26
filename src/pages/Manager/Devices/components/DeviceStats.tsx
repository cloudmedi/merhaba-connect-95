import { Card } from "@/components/ui/card";
import { Activity, Signal, AlertTriangle, HardDrive } from "lucide-react";
import { useDevices } from "../hooks/useDevices";
import { Device, DeviceSystemInfo } from "../hooks/types";

export function DeviceStats() {
  const { devices } = useDevices();
  
  const stats = {
    total: devices.length,
    online: devices.filter(d => d.status === 'online').length,
    offline: devices.filter(d => d.status === 'offline').length,
    warning: devices.filter(d => (d.system_info as DeviceSystemInfo).health === 'warning').length
  };

  const healthPercentage = ((stats.online / stats.total) * 100) || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="p-6 hover:shadow-md transition-all duration-200 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Total Devices</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</h3>
          </div>
          <div className="p-3 bg-purple-50 rounded-full">
            <HardDrive className="h-6 w-6 text-[#6E59A5]" />
          </div>
        </div>
      </Card>

      <Card className="p-6 hover:shadow-md transition-all duration-200 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Online Devices</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.online}</h3>
            <p className="text-xs text-emerald-600 mt-1">
              {Math.round(healthPercentage)}% operational
            </p>
          </div>
          <div className="p-3 bg-emerald-50 rounded-full">
            <Signal className="h-6 w-6 text-emerald-600" />
          </div>
        </div>
      </Card>

      <Card className="p-6 hover:shadow-md transition-all duration-200 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Offline Devices</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.offline}</h3>
          </div>
          <div className="p-3 bg-gray-50 rounded-full">
            <Activity className="h-6 w-6 text-gray-600" />
          </div>
        </div>
      </Card>

      <Card className="p-6 hover:shadow-md transition-all duration-200 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Warnings</p>
            <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.warning}</h3>
          </div>
          <div className="p-3 bg-amber-50 rounded-full">
            <AlertTriangle className="h-6 w-6 text-amber-600" />
          </div>
        </div>
      </Card>
    </div>
  );
}