import { Card } from "@/components/ui/card";
import { Signal, AlertTriangle, Clock } from "lucide-react";

interface SystemHealthStatsProps {
  playerStatuses: any[];
}

export function SystemHealthStats({ playerStatuses }: SystemHealthStatsProps) {
  const totalPlayers = playerStatuses.length;
  const onlinePlayers = playerStatuses.filter((p) => p.status === "online").length;
  const healthyPlayers = playerStatuses.filter((p) => p.health === "healthy").length;
  const criticalPlayers = playerStatuses.filter((p) => p.health === "critical").length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="bg-white shadow-sm">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Online Status</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">
                {onlinePlayers}/{totalPlayers}
              </h3>
              <p className="text-xs text-emerald-600 mt-2">
                {Math.round((onlinePlayers / totalPlayers) * 100)}% connected
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
              <p className="text-sm font-medium text-gray-500">System Health</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">
                {healthyPlayers}/{totalPlayers}
              </h3>
              <p className="text-xs text-emerald-600 mt-2">
                {Math.round((healthyPlayers / totalPlayers) * 100)}% healthy
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
              <p className="text-sm font-medium text-gray-500">Critical Issues</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">
                {criticalPlayers}
              </h3>
              <p className="text-xs text-red-600 mt-2">
                Requires immediate attention
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <AlertTriangle className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </Card>

      <Card className="bg-white shadow-sm">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Average Uptime</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">99.9%</h3>
              <p className="text-xs text-emerald-600 mt-2">Last 30 days</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}