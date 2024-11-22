import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GridPlaylist } from "./types";
import { Play, Music2 } from "lucide-react";

interface PlaylistGridProps {
  title: string;
  description?: string;
  playlists: GridPlaylist[];
  isLoading?: boolean;
}

export function PlaylistGrid({ title, description, playlists, isLoading }: PlaylistGridProps) {
  const navigate = useNavigate();

  const getArtworkUrl = (url: string | null | undefined) => {
    if (!url) return "/placeholder.svg";
    
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    if (!url.includes('://')) {
      return `https://cloud-media.b-cdn.net/${url}`;
    }
    
    return "/placeholder.svg";
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-square bg-gray-200 rounded-lg" />
              <div className="mt-2 h-4 bg-gray-200 rounded w-3/4" />
              <div className="mt-1 h-3 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
        </div>
        <Button 
          variant="ghost" 
          className="text-sm text-gray-500 hover:text-gray-900"
          onClick={() => navigate('/manager/playlists')}
        >
          View All
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {playlists.map((playlist) => (
          <Card
            key={playlist.id}
            className="group cursor-pointer overflow-hidden bg-gray-50 border-none hover:bg-gray-100 transition-colors"
            onClick={() => navigate(`/manager/playlists/${playlist.id}`)}
          >
            <div className="aspect-square relative overflow-hidden">
              {playlist.artwork_url ? (
                <img
                  src={getArtworkUrl(playlist.artwork_url)}
                  alt={playlist.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  onError={(e) => {
                    const img = e.target as HTMLImageElement;
                    img.src = "/placeholder.svg";
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <Music2 className="w-8 h-8 text-gray-400" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-200" />
              <Button
                size="icon"
                variant="ghost"
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/20 backdrop-blur-sm hover:bg-white/30"
              >
                <Play className="w-5 h-5 text-white" />
              </Button>
            </div>
            <div className="p-3">
              <h3 className="font-medium text-sm text-gray-900 truncate">{playlist.title}</h3>
              <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                <span className="truncate">{playlist.genre}</span>
                <span>•</span>
                <span className="truncate">{playlist.mood}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}