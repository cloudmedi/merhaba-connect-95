import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { GridPlaylist } from "./types";
import { Play } from "lucide-react";
import { useState } from "react";
import { MusicPlayer } from "@/components/MusicPlayer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PlaylistGridProps {
  title: string;
  description?: string;
  playlists: GridPlaylist[];
  isLoading?: boolean;
}

export function PlaylistGrid({ title, description, playlists, isLoading }: PlaylistGridProps) {
  const navigate = useNavigate();
  const [currentPlaylist, setCurrentPlaylist] = useState<GridPlaylist | null>(null);

  const { data: playlistSongs } = useQuery({
    queryKey: ['playlist-songs', currentPlaylist?.id],
    queryFn: async () => {
      if (!currentPlaylist?.id) return null;
      
      const { data: songs, error } = await supabase
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
        toast.error("Playlist şarkıları yüklenirken bir hata oluştu");
        throw error;
      }

      if (!songs || songs.length === 0) {
        toast.error("Bu playlist'te çalınacak şarkı bulunmuyor.");
        return null;
      }

      return songs;
    },
    enabled: !!currentPlaylist?.id
  });

  const getArtworkUrl = (url: string | null | undefined) => {
    if (!url) return "/placeholder.svg";
    
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    return `https://cloud-media.b-cdn.net/${url}`;
  };

  const handlePlayClick = async (e: React.MouseEvent, playlist: GridPlaylist) => {
    e.stopPropagation(); // Prevent navigation when clicking play button
    setCurrentPlaylist(playlist);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          {description && <p className="text-sm text-gray-500">{description}</p>}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
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
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {playlists.map((playlist) => (
          <Card
            key={playlist.id}
            className="group cursor-pointer overflow-hidden"
            onClick={() => navigate(`/manager/playlists/${playlist.id}`)}
          >
            <div className="aspect-square relative overflow-hidden rounded-t-lg">
              <img
                src={getArtworkUrl(playlist.artwork_url)}
                alt={playlist.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  img.src = "/placeholder.svg";
                }}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-200" />
              <Button
                size="icon"
                variant="ghost"
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/20 backdrop-blur-sm hover:bg-white/30"
                onClick={(e) => handlePlayClick(e, playlist)}
              >
                <Play className="w-5 h-5 text-white" />
              </Button>
            </div>
            <div className="p-3">
              <h3 className="font-medium text-gray-900 truncate">{playlist.title}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>{playlist.genre}</span>
                <span>•</span>
                <span>{playlist.mood}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {currentPlaylist && playlistSongs && (
        <MusicPlayer
          playlist={{
            title: currentPlaylist.title,
            artwork: getArtworkUrl(currentPlaylist.artwork_url),
            songs: playlistSongs.map(ps => ({
              id: ps.songs.id,
              title: ps.songs.title,
              artist: ps.songs.artist || "Unknown Artist",
              duration: ps.songs.duration?.toString() || "0:00",
              file_url: ps.songs.file_url.startsWith('http') 
                ? ps.songs.file_url 
                : `https://cloud-media.b-cdn.net/${ps.songs.file_url}`
            }))
          }}
          onClose={() => setCurrentPlaylist(null)}
        />
      )}
    </div>
  );
}