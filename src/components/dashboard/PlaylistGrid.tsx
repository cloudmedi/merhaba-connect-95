import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import ContentLoader from 'react-content-loader';
import { GridPlaylist } from "./types";
import CatalogLoader from "@/components/loaders/CatalogLoader";
import { PlaylistCard } from "./components/PlaylistCard";
import { PlaylistGridHeader } from "./components/PlaylistGridHeader";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

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
  const [selectedGenre, setSelectedGenre] = useState<string>("all");

  const { data: genres } = useQuery({
    queryKey: ['genres'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('genres')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });

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
    if (playlist.id === currentPlayingId) {
      onPlay?.(playlist);
      return;
    }

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

  const filteredPlaylists = selectedGenre === "all" 
    ? playlists 
    : playlists.filter(playlist => playlist.genre === selectedGenre);

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
        <PlaylistGridHeader
          title={title}
          description={description}
          categoryId={categoryId}
          onViewAll={handleViewAll}
        />
        <div className="w-[200px]">
          <Select
            value={selectedGenre}
            onValueChange={setSelectedGenre}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by genre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Genres</SelectItem>
              {genres?.map((genre) => (
                <SelectItem key={genre.id} value={genre.name}>
                  {genre.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {filteredPlaylists.map((playlist) => (
          <PlaylistCard
            key={playlist.id}
            playlist={playlist}
            isPlaying={isPlaying && currentPlayingId === playlist.id}
            currentPlayingId={currentPlayingId}
            onPlay={handlePlayClick}
            onClick={handleCardClick}
          />
        ))}
      </div>
    </div>
  );
}