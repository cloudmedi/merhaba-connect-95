import { Button } from "@/components/ui/button";
import { ArrowLeft, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PlaylistHeaderProps {
  onBack: () => void;
  artworkUrl?: string;
  name: string;
  genreName?: string;
  moodName?: string;
  songCount: number;
  duration: string;
  onPlay: () => void;
  onPush: () => void;
}

export function PlaylistHeader({
  onBack,
  artworkUrl,
  name,
  genreName = "Various",
  moodName = "Various",
  songCount,
  duration,
  onPlay,
  onPush,
}: PlaylistHeaderProps) {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2 text-gray-500">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 hover:text-gray-900 transition-colors text-sm group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Media Library
        </button>
      </div>

      <div className="flex items-start gap-8">
        <div className="relative group">
          <img 
            src={artworkUrl || "/placeholder.svg"} 
            alt={name}
            className="w-48 h-48 rounded-lg object-cover shadow-lg group-hover:shadow-xl transition-all duration-300"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 rounded-lg flex items-center justify-center">
            <Button
              size="icon"
              variant="ghost"
              onClick={onPlay}
              className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300"
            >
              <Play className="w-6 h-6" />
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{name}</h1>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <span>{genreName}</span>
              <span>•</span>
              <span>{moodName}</span>
              <span>•</span>
              <span>{songCount} songs</span>
              <span>•</span>
              <span>{duration}</span>
            </div>
          </div>

          <Button 
            onClick={onPush}
            className="bg-purple-600 text-white hover:bg-purple-700 rounded-full px-8"
          >
            Push
          </Button>
        </div>
      </div>
    </div>
  );
}