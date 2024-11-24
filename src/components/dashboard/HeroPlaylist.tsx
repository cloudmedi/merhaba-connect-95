import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SpotifyLoader } from "@/components/loaders/SpotifyLoader";
import { extractDominantColor } from "@/utils/colorExtraction";

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
    return <SpotifyLoader />;
  }

  if (!playlist) {
    return null;
  }

  return (
    <div 
      className="relative mb-12 rounded-lg overflow-hidden h-[300px] group transition-all duration-500"
      style={{
        backgroundColor: dominantColor,
      }}
    >
      <div className="absolute inset-0 bg-black/40" />
      
      <div className="absolute inset-0 flex items-center justify-between p-8">
        <div className="text-white space-y-4 z-10 max-w-lg">
          <h2 className="text-4xl font-bold">Featured Playlist</h2>
          <p className="text-2xl opacity-90">{playlist.name}</p>
          <Button 
            onClick={() => navigate(`/manager/playlists/${playlist.id}`)}
            className="mt-4 bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all border border-white/30"
          >
            Go to Playlist
          </Button>
        </div>
        <div className="w-64 h-64 relative z-10 transition-transform duration-300 group-hover:scale-105">
          <img
            src={playlist.artwork_url}
            alt="Hero Playlist"
            className="absolute inset-0 w-full h-full object-cover rounded-lg shadow-2xl"
          />
        </div>
      </div>
    </div>
  );
}