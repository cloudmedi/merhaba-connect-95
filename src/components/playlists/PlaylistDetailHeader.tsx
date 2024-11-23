import { ArrowLeft, Play, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PlaylistDetailHeaderProps {
  playlist: {
    id: string;
    name: string;
    artwork_url?: string;
    genre?: { name: string; id?: string };
    mood?: { name: string; id?: string };
    songs?: {
      duration: number;
    }[];
    is_hero?: boolean;
  };
  onPlay: () => void;
  onPush: () => void;
}

export function PlaylistDetailHeader({ playlist, onPlay, onPush }: PlaylistDetailHeaderProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  
  const calculateTotalDuration = () => {
    if (!playlist.songs || playlist.songs.length === 0) return "0 min";
    
    const totalSeconds = playlist.songs.reduce((acc, song) => {
      return acc + (song.duration || 0);
    }, 0);
    
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes} min`;
  };

  const handleGenreClick = () => {
    if (playlist.genre?.id) {
      navigate(`/manager/playlists/genre/${playlist.genre.id}`);
    }
  };

  const handleMoodClick = () => {
    if (playlist.mood?.id) {
      navigate(`/manager/playlists/mood/${playlist.mood.id}`);
    }
  };

  const handleHeroToggle = async () => {
    try {
      setIsUpdating(true);
      const { error } = await supabase
        .from('playlists')
        .update({ is_hero: !playlist.is_hero })
        .eq('id', playlist.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: playlist.is_hero 
          ? "Playlist removed from hero section" 
          : "Playlist set as hero",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

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
            src={playlist.artwork_url || "/placeholder.svg"}
            alt={playlist.name}
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
          <h1 className="text-2xl font-semibold text-gray-900">{playlist.name}</h1>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <button
              onClick={handleGenreClick}
              className={`hover:text-primary transition-colors ${playlist.genre?.id ? 'cursor-pointer' : 'cursor-default'}`}
            >
              {playlist.genre?.name || "Various"}
            </button>
            <span>•</span>
            <button
              onClick={handleMoodClick}
              className={`hover:text-primary transition-colors ${playlist.mood?.id ? 'cursor-pointer' : 'cursor-default'}`}
            >
              {playlist.mood?.name || "Various"}
            </button>
            <span>•</span>
            <span>{playlist.songs?.length || 0} songs</span>
            <span>•</span>
            <span>{calculateTotalDuration()}</span>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={onPush}
              className="bg-[#6366F1] text-white hover:bg-[#5558DD] rounded-full px-8"
            >
              Push
            </Button>
            <Button
              onClick={handleHeroToggle}
              variant="outline"
              className="rounded-full px-8 flex items-center gap-2"
              disabled={isUpdating}
            >
              <Star className={`w-4 h-4 ${playlist.is_hero ? 'fill-yellow-400 text-yellow-400' : ''}`} />
              {playlist.is_hero ? "Remove from Hero" : "Set as Hero"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}