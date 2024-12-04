import { Button } from "@/components/ui/button";
import { ArrowLeft, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PlaylistDetailHeaderProps {
  artwork?: string;
  title: string;
  genreName?: string;
  moodName?: string;
  songCount: number;
  duration: string;
  onPlay: () => void;
  onPush: () => void;
}

export function PlaylistDetailHeader({
  artwork,
  title,
  genreName = "Various",
  moodName = "Various",
  songCount,
  duration,
  onPlay,
  onPush,
}: PlaylistDetailHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2 text-gray-500">
        <button 
          onClick={() => navigate("/manager")}
          className="flex items-center gap-2 hover:text-gray-900 transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Media Library
        </button>
      </div>

      <div className="flex items-start gap-8">
        <div className="relative group">
          <img 
            src={artwork || "/placeholder.svg"} 
            alt={title}
            className="w-32 h-32 rounded-lg object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 rounded-lg flex items-center justify-center">
            <Button
              size="icon"
              variant="ghost"
              onClick={onPlay}
              className="w-12 h-12 rounded-full bg-white/30 hover:bg-white/40 transition-all duration-300 opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100"
            >
              <Play className="w-5 h-5 text-white" />
            </Button>
          </div>
        </div>
        <div className="space-y-3">
          <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>{genreName}</span>
            <span>•</span>
            <span>{moodName}</span>
            <span>•</span>
            <span>{songCount} songs</span>
            <span>•</span>
            <span>{duration}</span>
          </div>
          <Button 
            onClick={onPush}
            className="bg-[#6366F1] text-white hover:bg-[#5558DD] rounded-full px-8"
          >
            Push
          </Button>
        </div>
      </div>
    </div>
  );
}