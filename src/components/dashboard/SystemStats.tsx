import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Activity, Signal, Clock, AlertTriangle } from "lucide-react";

interface PlayerStatus {
  id: string;
  storeName: string;
  status: "online" | "offline";
  lastSeen: string;
  version: string;
  health: "healthy" | "warning" | "critical";
}

const mockPlayerStatuses: PlayerStatus[] = [
  {
    id: "1",
    storeName: "Store 1",
    status: "online",
    lastSeen: "Active now",
    version: "1.2.0",
    health: "healthy",
  },
  {
    id: "2",
    storeName: "Store 2",
    status: "offline",
    lastSeen: "2 hours ago",
    version: "1.2.0",
    health: "warning",
  },
  // ... more mock data
];

export function SystemStats() {
  const totalPlayers = mockPlayerStatuses.length;
  const onlinePlayers = mockPlayerStatuses.filter(p => p.status === "online").length;
  const healthyPlayers = mockPlayerStatuses.filter(p => p.health === "healthy").length;
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow bg-white border-none shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Online Players</p>
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
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow bg-white border-none shadow-sm">
          <CardContent className="p-6">
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
              <div className="p-3 bg-blue-100 rounded-full">
                <Activity className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow bg-white border-none shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">System Version</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">v1.2.0</h3>
                <p className="text-xs text-emerald-600 mt-2">Up to date</p>
              </div>
              <div className="p-3 bg-violet-100 rounded-full">
                <Clock className="h-6 w-6 text-violet-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="hover:shadow-lg transition-shadow bg-white border-none shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Player Status</h3>
          </div>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {mockPlayerStatuses.map((player) => (
                <div
                  key={player.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-white hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`h-3 w-3 rounded-full ${
                        player.status === "online"
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    />
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        {player.storeName}
                      </h4>
                      <p className="text-sm text-gray-500">
                        Version: {player.version}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">{player.lastSeen}</span>
                    {player.health !== "healthy" && (
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}