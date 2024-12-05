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
    console.log('PlaylistCard - Play clicked:', {
      playlistId: playlist.id,
      currentPlayingId,
      isPlaying,
      isCurrentlyPlaying: currentPlayingId === playlist.id && isPlaying
    });
    onPlay?.(playlist);
  };

  const isCurrentlyPlaying = currentPlayingId === playlist.id && isPlaying;

  return (
    <div
      className="group cursor-pointer overflow-hidden bg-white hover:bg-gray-50 transition-all duration-300 rounded-xl shadow-sm hover:shadow-md border border-gray-100"
      onClick={() => onClick?.(playlist)}
    >
      <div className="aspect-square relative overflow-hidden">
        <img
          src={playlist.artwork_url}
          alt={playlist.title}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Button
            size="icon"
            variant="ghost"
            className="w-14 h-14 rounded-full bg-white hover:bg-white/90 transition-all duration-300 opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 hover:scale-105"
            onClick={handlePlayClick}
          >
            {isCurrentlyPlaying ? (
              <Pause className="w-6 h-6 text-black" />
            ) : (
              <Play className="w-6 h-6 ml-1 text-black" />
            )}
          </Button>
        </div>
        {isCurrentlyPlaying && (
          <div className="absolute bottom-3 right-3">
            <div className="w-2 h-2 rounded-full bg-white animate-pulse shadow-lg" />
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 truncate group-hover:text-purple-600 transition-colors">
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