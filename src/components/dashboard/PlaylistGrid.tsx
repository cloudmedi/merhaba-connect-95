import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayIcon } from "lucide-react";
import { GridPlaylist } from "./types";
import CatalogLoader from "@/components/loaders/CatalogLoader";

interface PlaylistGridProps {
  title: string;
  description?: string;
  playlists: GridPlaylist[];
  isLoading?: boolean;
  onPlay?: (playlist: GridPlaylist) => void;
  categoryId?: string;
}

export function PlaylistGrid({
  title,
  description,
  playlists = [],
  isLoading,
  onPlay,
  categoryId,
}: PlaylistGridProps) {
  const navigate = useNavigate();

  if (isLoading) {
    return <CatalogLoader />;
  }

  const handleViewAll = () => {
    if (categoryId) {
      navigate(`/manager/playlists/category/${categoryId}`);
    } else {
      navigate('/manager/playlists');
    }
  };

  const handleCardClick = (e: React.MouseEvent, playlist: GridPlaylist) => {
    // If clicked element is the play button or its container, trigger play
    const target = e.target as HTMLElement;
    if (target.closest('.play-button-overlay')) {
      e.stopPropagation();
      onPlay?.(playlist);
      return;
    }
    
    // Diğer durumlarda playlist detay sayfasına yönlendir
    navigate(`/manager/playlists/${playlist.id}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
          {description && (
            <p className="text-sm text-gray-500">{description}</p>
          )}
        </div>
        <Button 
          variant="ghost" 
          className="text-sm text-gray-500 hover:text-gray-900"
          onClick={handleViewAll}
        >
          View All
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {playlists.map((playlist) => (
          <Card
            key={playlist.id}
            className="group cursor-pointer overflow-hidden bg-gray-50 border-none hover:bg-gray-100 transition-colors"
            onClick={(e) => handleCardClick(e, playlist)}
          >
            <div className="aspect-square relative overflow-hidden">
              {playlist.artwork_url ? (
                <img
                  src={playlist.artwork_url}
                  alt={playlist.title}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400">No Artwork</span>
                </div>
              )}
              {onPlay && (
                <div className="play-button-overlay absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm text-white hover:scale-110 hover:bg-white/30 transition-all duration-300"
                  >
                    <PlayIcon className="w-6 h-6" />
                  </Button>
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <h3 className="font-medium text-gray-900 truncate">
                {playlist.title}
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>{playlist.genre || "Various"}</span>
                <span>•</span>
                <span>{playlist.mood || "Various"}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}