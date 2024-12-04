import { Button } from "@/components/ui/button";
import { ArrowLeft, Play } from "lucide-react";
import { calculateTotalDuration } from "../utils/playlistUtils";

interface PlaylistDetailHeaderProps {
  playlist: {
    artwork_url?: string;
    name: string;
    genres?: { name: string };
    moods?: { name: string };
    songs: any[];
  };
  onBack: () => void;
  onPlayClick: () => void;
  onPushClick: () => void;
}

export function PlaylistDetailHeader({
  playlist,
  onBack,
  onPlayClick,
  onPushClick,
}: PlaylistDetailHeaderProps) {
  return (
    <>
      <div className="flex items-center gap-2 text-gray-500">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 hover:text-gray-900 transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Media Library
        </button>
      </div>

      <div className="flex items-start gap-8">
        <div className="relative group">
          <img 
            src={playlist.artwork_url || "/placeholder.svg"} 
            alt={playlist.name}
            className="w-32 h-32 rounded-lg object-cover"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 rounded-lg flex items-center justify-center">
            <button
              onClick={onPlayClick}
              className="opacity-0 group-hover:opacity-100 transition-all duration-300 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center hover:scale-110 transform"
            >
              <Play className="w-6 h-6" />
            </button>
          </div>
        </div>
        <div className="space-y-3">
          <h1 className="text-2xl font-semibold text-gray-900">{playlist.name}</h1>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>{playlist.genres?.name}</span>
            <span>•</span>
            <span>{playlist.moods?.name}</span>
            <span>•</span>
            <span>{playlist.songs.length} songs</span>
            <span>•</span>
            <span>{calculateTotalDuration(playlist.songs)}</span>
          </div>
          <Button 
            onClick={onPushClick}
            className="bg-[#6366F1] text-white hover:bg-[#5558DD] rounded-full px-8"
          >
            Push
          </Button>
        </div>
      </div>
    </>
  );
}