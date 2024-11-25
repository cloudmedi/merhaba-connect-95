import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Cloud, Settings, RefreshCw } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { OfflinePlayer } from "@/types/offline-player";

interface OfflinePlayerCardProps {
  player: OfflinePlayer & {
    devices: {
      id: string;
      name: string;
      branch_id: string;
      status: string;
    };
  };
  onSync?: (playerId: string) => void;
  onSettings?: (player: OfflinePlayer) => void;
}

export function OfflinePlayerCard({ player, onSync, onSettings }: OfflinePlayerCardProps) {
  const lastSyncText = player.last_sync_at
    ? formatDistanceToNow(new Date(player.last_sync_at), { addSuffix: true })
    : 'Never';

  return (
    <Card className="hover:bg-gray-50 transition-colors">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {player.devices.name}
        </CardTitle>
        <Badge 
          variant={player.sync_status === 'completed' ? 'default' : 'secondary'}
          className="capitalize"
        >
          {player.sync_status}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="text-xs text-gray-500 space-y-2">
          <div className="flex items-center gap-2">
            <Cloud className="w-4 h-4" />
            Last synced: {lastSyncText}
          </div>
          {player.version && (
            <div>Version: {player.version}</div>
          )}
        </div>
        <div className="flex items-center gap-2 mt-4">
          <Button
            size="sm"
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => onSync?.(player.id)}
          >
            <RefreshCw className="w-4 h-4" />
            Sync Now
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="flex items-center gap-2"
            onClick={() => onSettings?.(player)}
          >
            <Settings className="w-4 h-4" />
            Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}