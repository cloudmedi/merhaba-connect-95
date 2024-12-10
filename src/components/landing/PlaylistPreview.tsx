import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";

interface PlaylistPreviewProps {
  playlist: {
    id: string;
    name: string;
    artwork_url: string | null;
    description: string | null;
  };
  isPlaying: boolean;
  currentPlayingId: string | null;
  onPlay: (playlist: any) => void;
}

export function PlaylistPreview({
  playlist,
  isPlaying,
  currentPlayingId,
  onPlay
}: PlaylistPreviewProps) {
  const isCurrentlyPlaying = currentPlayingId === playlist.id && isPlaying;

  return (
    <Card className="group relative overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="aspect-square relative overflow-hidden">
        <img 
          src={playlist.artwork_url || "/placeholder.svg"} 
          alt={playlist.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Button
            variant="ghost"
            size="icon"
            className="w-12 h-12 rounded-full bg-white/30 hover:bg-white/40 transition-all duration-300 opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100"
            onClick={() => onPlay(playlist)}
          >
            {isCurrentlyPlaying ? (
              <Pause className="w-5 h-5 text-white" />
            ) : (
              <Play className="w-5 h-5 ml-0.5 text-white" />
            )}
          </Button>
        </div>
        {isCurrentlyPlaying && (
          <div className="absolute bottom-2 right-2">
            <div className="w-1.5 h-1.5 rounded-full bg-white/80 animate-pulse shadow-sm" />
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-medium truncate">{playlist.name}</h3>
        {playlist.description && (
          <p className="text-sm text-gray-600 line-clamp-2">{playlist.description}</p>
        )}
      </CardContent>
    </Card>
  );
}