import { useState } from "react";
import { MusicPlayer } from "@/components/MusicPlayer";
import { Play } from "lucide-react";
import CatalogLoader from "@/components/loaders/CatalogLoader";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { GridPlaylist } from "./types";

interface PlaylistSong {
  position: number;
  songs: {
    id: string;
    title: string;
    artist: string | null;
    duration: number | null;
    file_url: string;
  };
}

interface PlaylistGridProps {
  title: string;
  description?: string;
  playlists: GridPlaylist[];
  isLoading?: boolean;
}

export function PlaylistGrid({ title, description, playlists, isLoading = false }: PlaylistGridProps) {
  const [currentPlaylist, setCurrentPlaylist] = useState<GridPlaylist | null>(null);
  const navigate = useNavigate();

  const { data: playlistSongs } = useQuery<PlaylistSong[]>({
    queryKey: ['playlist-songs', currentPlaylist?.id],
    queryFn: async () => {
      if (!currentPlaylist?.id) return [];
      
      const { data, error } = await supabase
        .from('playlist_songs')
        .select(`
          position,
          songs (
            id,
            title,
            artist,
            duration,
            file_url
          )
        `)
        .eq('playlist_id', currentPlaylist.id)
        .order('position');

      if (error) {
        console.error('Error fetching playlist songs:', error);
        throw error;
      }

      return (data as PlaylistSong[]) || [];
    },
    enabled: !!currentPlaylist?.id
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
          {description && <p className="text-sm text-gray-500">{description}</p>}
        </div>
        <CatalogLoader foregroundColor="#e5e7eb" backgroundColor="#f3f4f6" />
      </div>
    );
  }

  const handlePlaylistClick = (playlist: GridPlaylist) => {
    navigate(`/manager/playlists/${playlist.id}`);
  };

  const defaultArtwork = "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b";

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {playlists.map((playlist) => (
          <div 
            key={playlist.id} 
            className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div 
              className="aspect-square relative overflow-hidden cursor-pointer"
              onClick={() => handlePlaylistClick(playlist)}
            >
              <img
                src={playlist.artwork || defaultArtwork}
                alt={playlist.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  img.src = defaultArtwork;
                }}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentPlaylist(playlist);
                    }}
                    className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center hover:scale-110 transform transition-all"
                  >
                    <Play className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-medium text-base text-gray-900">{playlist.title}</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                  {playlist.genre}
                </span>
                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                  {playlist.mood}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {currentPlaylist && playlistSongs && playlistSongs.length > 0 && (
        <MusicPlayer
          playlist={{
            title: currentPlaylist.title,
            artwork: currentPlaylist.artwork || defaultArtwork,
            songs: playlistSongs.map(ps => ({
              id: parseInt(ps.songs.id),
              title: ps.songs.title,
              artist: ps.songs.artist || "Unknown Artist",
              duration: ps.songs.duration?.toString() || "0:00",
              file_url: ps.songs.file_url
            }))
          }}
          onClose={() => setCurrentPlaylist(null)}
        />
      )}
    </div>
  );
}