import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";
import { GridPlaylist } from "../types";

interface PlaylistCardProps {
  playlist: GridPlaylist;
  isPlaying?: boolean;
  currentPlayingId?: string;
  onPlay?: (playlist: GridPlaylist) => void;
  onClick?: (playlist: GridPlaylist) => void;
}

export function PlaylistCard({
  playlist,
  isPlaying = false,
  currentPlayingId,
  onPlay,
  onClick,
}: PlaylistCardProps) {
  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPlay?.(playlist);
  };

  return (
    <div
      className="group cursor-pointer overflow-hidden bg-gray-50 border-none hover:bg-gray-100 transition-colors rounded-lg"
      onClick={() => onClick?.(playlist)}
    >
      <div className="aspect-square relative overflow-hidden">
        <img
          src={playlist.artwork_url}
          alt={playlist.title}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
          <Button
            size="icon"
            variant="ghost"
            className="w-12 h-12 rounded-full bg-white/30 hover:bg-white/40 transition-all duration-300"
            onClick={handlePlayClick}
          >
            {currentPlayingId === playlist.id && isPlaying ? (
              <Pause className="w-5 h-5 text-white" />
            ) : (
              <Play className="w-5 h-5 ml-0.5 text-white" />
            )}
          </Button>
        </div>
        {currentPlayingId === playlist.id && isPlaying && (
          <div className="absolute bottom-2 right-2">
            <div className="w-1.5 h-1.5 rounded-full bg-white/80 animate-pulse shadow-sm" />
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-medium text-gray-900 truncate">
          {playlist.title}
        </h3>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>{playlist.genre || "Various"}</span>
          <span>•</span>
          <span>{playlist.mood || "Various"}</span>
        </div>
      </div>
    </div>
  );
}