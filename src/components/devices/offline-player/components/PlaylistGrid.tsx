import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

interface PlaylistGridProps {
  playlists: any[];
  onPlayPlaylist: (playlist: any) => void;
}

export function PlaylistGrid({ playlists, onPlayPlaylist }: PlaylistGridProps) {
  if (playlists.length === 0) {
    return (
      <div className="text-center p-8 text-muted-foreground">
        No playlists available. Wait for manager to assign playlists.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {playlists.map((item) => (
        <Card key={item.id}>
          <CardHeader>
            <CardTitle className="text-lg">{item.playlist.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-square rounded-md bg-muted mb-4">
              {item.playlist.artwork_url && (
                <img
                  src={item.playlist.artwork_url}
                  alt={item.playlist.name}
                  className="w-full h-full object-cover rounded-md"
                />
              )}
            </div>
            <Button 
              className="w-full" 
              onClick={() => onPlayPlaylist(item.playlist)}
            >
              <Play className="w-4 h-4 mr-2" />
              Play
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}