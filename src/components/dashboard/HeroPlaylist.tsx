import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface HeroPlaylistProps {
  playlist?: {
    id: string;
    name: string;
    artwork_url: string;
    genre_id: { name: string };
    mood_id: { name: string };
  };
  isLoading?: boolean;
}

export function HeroPlaylist({ playlist, isLoading }: HeroPlaylistProps) {
  if (isLoading) {
    return <Skeleton className="w-full h-[400px] rounded-xl" />;
  }

  if (!playlist) return null;

  return (
    <div className="relative w-full h-[400px] rounded-xl overflow-hidden group">
      <img
        src={playlist.artwork_url}
        alt={playlist.name}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
      <div className="absolute inset-0 flex flex-col justify-end p-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-white/80">
            <span>{playlist.genre_id?.name || "Various"}</span>
            <span>•</span>
            <span>{playlist.mood_id?.name || "Various"}</span>
          </div>
          <h1 className="text-4xl font-bold text-white">{playlist.name}</h1>
          <Button 
            size="lg" 
            className="bg-white hover:bg-white/90 text-black gap-2 rounded-full px-8 transition-transform hover:scale-105"
          >
            <Play className="w-5 h-5" />
            Play Now
          </Button>
        </div>
      </div>
    </div>
  );
}