import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { PlaylistGrid } from "@/components/dashboard/PlaylistGrid";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Playlist } from "@/types/api";
import type { GridPlaylist } from "@/components/dashboard/types";
import { MusicPlayer } from "@/components/MusicPlayer";

export function PlaylistsContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPlaylist, setCurrentPlaylist] = useState<GridPlaylist | null>(null);
  const navigate = useNavigate();

  const { data: playlists, isLoading } = useQuery({
    queryKey: ['playlists'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('playlists')
        .select(`
          *,
          company:company_id(name),
          profiles:created_by(first_name, last_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as unknown as Playlist[];
    }
  });

  const { data: playlistSongs } = useQuery({
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

      return data;
    },
    enabled: !!currentPlaylist?.id
  });

  const filteredPlaylists = playlists?.filter(playlist =>
    playlist.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const transformPlaylistForGrid = (playlist: Playlist): GridPlaylist => {
    const defaultArtwork = "/placeholder.svg";
    const artworkUrl = playlist.artwork_url || defaultArtwork;
    
    return {
      id: playlist.id,
      title: playlist.name,
      artwork_url: artworkUrl,
      genre: "Various",
      mood: "Various",
    };
  };

  const businessPlaylists = filteredPlaylists
    .filter(p => !p.is_public)
    .map(transformPlaylistForGrid);

  const publicPlaylists = filteredPlaylists
    .filter(p => p.is_public)
    .map(transformPlaylistForGrid);

  const getFullUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    if (url.startsWith('cloud-media/')) {
      return url.replace('cloud-media/', 'https://cloud-media.b-cdn.net/');
    }
    return `${window.location.origin}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="relative flex-1 w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="search"
            placeholder="Search playlists..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button 
          onClick={() => navigate("create")}
          className="bg-[#6366F1] text-white hover:bg-[#5558DD] w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" /> Create New Playlist
        </Button>
      </div>

      <div className="space-y-12">
        <PlaylistGrid 
          title="Business Playlists" 
          description="Private playlists for business use"
          playlists={businessPlaylists}
          isLoading={isLoading}
        />
        
        <PlaylistGrid 
          title="Public Playlists" 
          description="Playlists available to all users"
          playlists={publicPlaylists}
          isLoading={isLoading}
        />
      </div>

      {currentPlaylist && playlistSongs && playlistSongs.length > 0 && (
        <MusicPlayer
          playlist={{
            title: currentPlaylist.title,
            artwork: currentPlaylist.artwork_url,
            songs: playlistSongs.map(ps => ({
              id: ps.songs.id,
              title: ps.songs.title,
              artist: ps.songs.artist || "Unknown Artist",
              duration: ps.songs.duration?.toString() || "0:00",
              file_url: getFullUrl(ps.songs.file_url)
            }))
          }}
          onClose={() => setCurrentPlaylist(null)}
        />
      )}
    </div>
  );
}