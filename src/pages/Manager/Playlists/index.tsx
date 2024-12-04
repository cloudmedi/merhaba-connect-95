import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { PlaylistGrid } from "@/components/dashboard/PlaylistGrid";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { GridPlaylist } from "@/components/dashboard/types";
import { MusicPlayer } from "@/components/MusicPlayer";
import { toast } from "sonner";

export default function Playlists() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPlaylist, setCurrentPlaylist] = useState<GridPlaylist | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const { data: playlists, isLoading } = useQuery({
    queryKey: ['manager-playlists'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      // Get user's company_id
      const { data: profile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', user.id)
        .single();

      if (!profile?.company_id) throw new Error('No company associated with user');

      // Fetch public playlists and company's private playlists
      const { data, error } = await supabase
        .from('playlists')
        .select(`
          id,
          name,
          artwork_url,
          genres (name),
          moods (name)
        `)
        .or(`is_public.eq.true,company_id.eq.${profile.company_id}`);

      if (error) throw error;
      return data;
    }
  });

  const handlePlayPlaylist = async (playlist: GridPlaylist) => {
    try {
      // If clicking the same playlist that's currently playing
      if (currentPlaylist?.id === playlist.id) {
        setIsPlaying(!isPlaying);
        return;
      }

      // Fetch songs for this playlist
      const { data: playlistSongs, error } = await supabase
        .from('playlist_songs')
        .select(`
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
        .eq('playlist_id', playlist.id)
        .order('position');

      if (error) throw error;

      if (!playlistSongs || playlistSongs.length === 0) {
        toast.error("No songs found in this playlist");
        return;
      }

      // Transform the playlist data
      const playlistWithSongs = {
        id: playlist.id,
        title: playlist.title,
        artwork: playlist.artwork_url,
        songs: playlistSongs.map(ps => ({
          id: ps.songs.id,
          title: ps.songs.title,
          artist: ps.songs.artist || "Unknown Artist",
          duration: ps.songs.duration?.toString() || "0:00",
          file_url: ps.songs.file_url,
          bunny_id: ps.songs.bunny_id
        }))
      };

      setCurrentPlaylist(playlistWithSongs);
      setIsPlaying(true);
    } catch (error) {
      console.error('Error playing playlist:', error);
      toast.error("Failed to play playlist");
    }
  };

  const filteredPlaylists = playlists?.filter(playlist =>
    playlist.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const transformedPlaylists: GridPlaylist[] = filteredPlaylists.map(playlist => ({
    id: playlist.id,
    title: playlist.name,
    artwork_url: playlist.artwork_url || "/placeholder.svg",
    genre: playlist.genres?.name || "Various",
    mood: playlist.moods?.name || "Various"
  }));

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Media Library</h1>
          <p className="text-sm text-gray-500">Browse and manage your playlists</p>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="search"
            placeholder="Search playlists..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <PlaylistGrid
        title="All Playlists"
        playlists={transformedPlaylists}
        isLoading={isLoading}
        onPlay={handlePlayPlaylist}
        currentPlayingId={currentPlaylist?.id}
        isPlaying={isPlaying}
      />

      {currentPlaylist && (
        <MusicPlayer
          key={currentPlaylist.id}
          playlist={currentPlaylist}
          onClose={() => {
            setCurrentPlaylist(null);
            setIsPlaying(false);
          }}
          onPlayStateChange={setIsPlaying}
          autoPlay={true}
        />
      )}
    </div>
  );
}