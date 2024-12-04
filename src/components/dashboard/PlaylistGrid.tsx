import { useNavigate } from "react-router-dom";
import { GridPlaylist } from "./types";
import CatalogLoader from "@/components/loaders/CatalogLoader";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import ContentLoader from 'react-content-loader';
import { PlaylistCard } from "./grid/PlaylistCard";
import { PlaylistGridHeader } from "./grid/PlaylistGridHeader";

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

  const handlePlayClick = async (playlist: GridPlaylist) => {
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
      <PlaylistGridHeader 
        title={title}
        description={description}
        onViewAll={handleViewAll}
        categoryId={categoryId}
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {playlists.map((playlist) => (
          <PlaylistCard
            key={playlist.id}
            playlist={playlist}
            onPlay={handlePlayClick}
            currentPlayingId={currentPlayingId}
            isPlaying={isPlaying}
          />
        ))}
      </div>
    </div>
  );
}