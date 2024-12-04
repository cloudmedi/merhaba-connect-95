import { Button } from "@/components/ui/button";
import { ArrowLeft, Play } from "lucide-react";

interface PlaylistDetailHeaderProps {
  artwork_url?: string;
  name: string;
  genreName?: string;
  moodName?: string;
  songCount: number;
  duration: string;
  onBack: () => void;
  onPlay: () => void;
  onPush: () => void;
  isHero?: boolean;
  id?: string;
}

export function PlaylistDetailHeader({
  artwork_url,
  name,
  genreName = "Various",
  moodName = "Various",
  songCount,
  duration,
  onBack,
  onPlay,
  onPush,
  isHero,
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
            src={artwork_url || "/placeholder.svg"} 
            alt={name}
            className="w-32 h-32 rounded-lg object-cover"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 rounded-lg flex items-center justify-center">
            <button
              onClick={onPlay}
              className="opacity-0 group-hover:opacity-100 transition-all duration-300 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center hover:scale-110 transform"
            >
              <Play className="w-6 h-6" />
            </button>
          </div>
        </div>
        <div className="space-y-3">
          <h1 className="text-2xl font-semibold text-gray-900">{name}</h1>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>{genreName}</span>
            <span>•</span>
            <span>{moodName}</span>
            <span>•</span>
            <span>{songCount} songs</span>
            <span>•</span>
            <span>{duration}</span>
            {isHero && (
              <>
                <span>•</span>
                <span className="text-purple-600">Featured</span>
              </>
            )}
          </div>
          <Button 
            onClick={onPush}
            className="bg-[#6366F1] text-white hover:bg-[#5558DD] rounded-full px-8"
          >
            Push
          </Button>
        </div>
      </div>
    </>
  );
}