import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { HeroLoader } from "@/components/loaders/HeroLoader";
import { extractDominantColor } from "@/utils/colorExtraction";
import { Play } from "lucide-react";

interface HeroPlaylistProps {
  playlist: any;
  isLoading: boolean;
}

export function HeroPlaylist({ playlist, isLoading }: HeroPlaylistProps) {
  const navigate = useNavigate();
  const [dominantColor, setDominantColor] = useState('rgba(110, 89, 165, 1)');
  const [isColorLoading, setIsColorLoading] = useState(false);

  useEffect(() => {
    const loadDominantColor = async () => {
      if (playlist?.artwork_url) {
        setIsColorLoading(true);
        try {
          const { primary } = await extractDominantColor(playlist.artwork_url);
          const solidColor = primary.replace(/[\d.]+\)$/g, '1)');
          setDominantColor(solidColor);
        } catch (error) {
          console.error('Error loading dominant color:', error);
        } finally {
          setIsColorLoading(false);
        }
      }
    };

    loadDominantColor();
  }, [playlist?.artwork_url]);

  if (isLoading || isColorLoading) {
    return <HeroLoader />;
  }

  if (!playlist) {
    return null;
  }

  return (
    <div 
      className="relative mb-12 rounded-2xl overflow-hidden h-[400px] group transition-all duration-500"
      style={{
        background: `linear-gradient(135deg, ${dominantColor}, rgba(0,0,0,0.8))`,
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
      
      <div className="absolute inset-0 flex items-center justify-between p-12">
        <div className="text-white space-y-6 z-10 max-w-2xl">
          <span className="text-white/80 text-sm font-medium uppercase tracking-wider">Featured Playlist</span>
          <h2 className="text-5xl font-bold leading-tight">{playlist.name}</h2>
          <Button 
            onClick={() => navigate(`/manager/playlists/${playlist.id}`)}
            className="mt-8 bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all border border-white/30 flex items-center gap-2 rounded-full px-8 py-6"
          >
            <Play className="w-5 h-5" />
            Listen Now
          </Button>
        </div>
        <div className="w-[400px] h-[400px] relative z-10 transition-transform duration-500 group-hover:scale-105 group-hover:rotate-3">
          <img
            src={playlist.artwork_url}
            alt="Hero Playlist"
            className="absolute inset-0 w-full h-full object-cover rounded-xl shadow-2xl"
          />
        </div>
      </div>
    </div>
  );
}