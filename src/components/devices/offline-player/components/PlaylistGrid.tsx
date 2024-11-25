import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface OfflinePlaylist {
  id: string;
  playlist: {
    id: string;
    name: string;
    artwork_url: string;
    songs: any[];
  };
  sync_status: string;
  last_synced_at: string;
}

interface PlaylistGridProps {
  playlists: OfflinePlaylist[];
  onPlayPlaylist: (playlist: any) => void;
}

export function PlaylistGrid({ playlists, onPlayPlaylist }: PlaylistGridProps) {
  return (
    <Card>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {playlists.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="relative aspect-square">
                  <img
                    src={item.playlist.artwork_url || "/placeholder.svg"}
                    alt={item.playlist.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-all duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm text-white hover:scale-110 hover:bg-white/30 transition-all duration-300"
                      onClick={() => onPlayPlaylist(item.playlist)}
                    >
                      <Play className="w-6 h-6" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-medium truncate">{item.playlist.name}</h3>
                  <div className="flex items-center justify-between mt-2 text-sm text-gray-500">
                    <span>Last synced: {new Date(item.last_synced_at).toLocaleDateString()}</span>
                    <span className="capitalize">{item.sync_status}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}