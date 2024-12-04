import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";
import { GridPlaylist } from "./types";
import CatalogLoader from "@/components/loaders/CatalogLoader";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import ContentLoader from 'react-content-loader';

interface PlaylistGridProps {
  title: string;
  description?: string;
  playlists: GridPlaylist[];
  isLoading?: boolean;
  onPlay?: (playlist: GridPlaylist & { songs?: any[] }) => void;
  categoryId?: string;
  currentPlayingId?: string;
  isPlaying?: boolean;
}

// Title loader component
const TitleLoader = () => (
  <ContentLoader
    speed={2}
    width={300}
    height={80}
    viewBox="0 0 300 80"
    backgroundColor="#f3f4f6"
    foregroundColor="#e5e7eb"
  >
    <rect x="0" y="0" rx="4" ry="4" width="200" height="24" />
    <rect x="0" y="35" rx="3" ry="3" width="150" height="16" />
  </ContentLoader>
);

export function PlaylistGrid({
  title,
  description,
  playlists = [],
  isLoading,
  onPlay,
  categoryId,
  currentPlayingId,
  isPlaying = false,
}: PlaylistGridProps) {
  const navigate = useNavigate();

  const { data: playlistSongs } = useQuery({
    queryKey: ['playlist-songs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('playlist_songs')
        .select(`
          playlist_id,
          position,
          songs (
            id,
            title,
            artist,
            duration,
            file_url,
            bunny_id
          )
        `)
        .order('position');

      if (error) throw error;
      return data;
    }
  });

  const handleViewAll = () => {
    if (categoryId) {
      navigate(`/manager/playlists/category/${categoryId}`);
    }
  };

  const handlePlayClick = async (e: React.MouseEvent, playlist: GridPlaylist) => {
    e.stopPropagation();
    
    const playlistWithSongs = {
      ...playlist,
      songs: playlistSongs
        ?.filter(ps => ps.playlist_id === playlist.id)
        ?.map(ps => ({
          id: ps.songs.id,
          title: ps.songs.title,
          artist: ps.songs.artist || "Unknown Artist",
          duration: ps.songs.duration?.toString() || "0:00",
          file_url: ps.songs.file_url,
          bunny_id: ps.songs.bunny_id
        })) || []
    };

    onPlay?.(playlistWithSongs);
  };

  const handleCardClick = (playlist: GridPlaylist) => {
    navigate(`/manager/playlists/${playlist.id}`);
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <TitleLoader />
        <CatalogLoader count={6} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
          {description && (
            <p className="text-sm text-gray-500">{description}</p>
          )}
        </div>
        {categoryId && (
          <Button 
            variant="ghost" 
            className="text-sm text-gray-500 hover:text-gray-900"
            onClick={handleViewAll}
          >
            View All
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {playlists.map((playlist) => (
          <Card
            key={playlist.id}
            className="group cursor-pointer overflow-hidden bg-gray-50 border-none hover:bg-gray-100 transition-colors"
            onClick={() => handleCardClick(playlist)}
          >
            <div className="aspect-square relative overflow-hidden">
              <img
                src={playlist.artwork_url}
                alt={playlist.title}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
              />
              {onPlay && (
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="w-10 h-10 rounded-full bg-white/30 hover:bg-white/40 transition-all duration-300"
                    onClick={(e) => handlePlayClick(e, playlist)}
                  >
                    {currentPlayingId === playlist.id && isPlaying ? (
                      <Pause className="w-4 h-4 text-white" />
                    ) : (
                      <Play className="w-4 h-4 ml-0.5 text-white" />
                    )}
                  </Button>
                </div>
              )}
              {currentPlayingId === playlist.id && isPlaying && (
                <div className="absolute bottom-2 right-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/80 animate-pulse shadow-sm" />
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
