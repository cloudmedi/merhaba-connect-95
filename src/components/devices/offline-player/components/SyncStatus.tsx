import { Card, CardContent } from "@/components/ui/card";
import { Download, Music } from "lucide-react";

interface SyncStatusProps {
  syncStatus: string;
  playlistCount: number;
}

export function SyncStatus({ syncStatus, playlistCount }: SyncStatusProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Music className="w-4 h-4 text-gray-500" />
            <span>Playlists</span>
          </div>
          <p className="text-2xl font-bold mt-2">{playlistCount}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Download className="w-4 h-4 text-gray-500" />
            <span>Sync Status</span>
          </div>
          <p className="text-2xl font-bold mt-2 capitalize">{syncStatus}</p>
        </CardContent>
      </Card>
    </div>
  );
}