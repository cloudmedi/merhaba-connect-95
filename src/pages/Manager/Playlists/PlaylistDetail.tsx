import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MusicPlayer } from "@/components/MusicPlayer";
import { PushPlaylistDialog } from "./PushPlaylistDialog";
import { PlaylistDetailHeader } from "@/components/playlists/PlaylistDetailHeader";
import { SongList } from "@/components/playlists/SongList";
import { toast } from "sonner";

const SONGS_PER_PAGE = 50;

interface PlaylistSong {
  song_id: string;
  title: string;
  artist: string;
  duration: number;
  file_url: string;
  bunny_id?: string;
  position: number;
  playlist_id: string;
  artwork_url?: string;
}

export function PlaylistDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isPushDialogOpen, setIsPushDialogOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);

  // Fetch playlist details
  const { data: playlist, isLoading: isPlaylistLoading } = useQuery({
    queryKey: ['playlist', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('playlists')
        .select(`
          *,
          genres (name),
          moods (name)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    }
  });

  // Fetch paginated songs with infinite scroll
  const {
    data: songPages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isSongsLoading
  } = useInfiniteQuery({
    queryKey: ['playlist-songs', id],
    queryFn: async ({ pageParam = 0 }) => {
      const { data, error } = await supabase
        .from('paginated_playlist_songs')
        .select('*')
        .eq('playlist_id', id)
        .range(pageParam * SONGS_PER_PAGE, (pageParam + 1) * SONGS_PER_PAGE - 1)
        .order('position');

      if (error) throw error;
      return data as PlaylistSong[];
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === SONGS_PER_PAGE ? allPages.length : undefined;
    }
  });

  const isLoading = isPlaylistLoading || isSongsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">Playlist not found</h2>
          <button 
            onClick={() => navigate("/manager")}
            className="text-purple-600 hover:text-purple-700 font-medium"
          >
            Back to Media Library
          </button>
        </div>
      </div>
    );
  }

  // Flatten all songs from all pages
  const allSongs = songPages?.pages.flat() || [];

  const handleSongSelect = (song: PlaylistSong) => {
    const index = allSongs.findIndex(s => s.song_id === song.song_id);
    if (index !== -1) {
      setCurrentSongIndex(index);
      setIsPlaying(true);
    }
  };

  const handlePlayClick = () => {
    if (allSongs && allSongs.length > 0) {
      setCurrentSongIndex(0);
      setIsPlaying(true);
      toast.success("Playing playlist");
    }
  };

  const calculateTotalDuration = () => {
    if (!allSongs || allSongs.length === 0) return "0 min";
    
    const totalSeconds = allSongs.reduce((acc, song) => {
      return acc + (song.duration || 0);
    }, 0);
    
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes} min`;
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="p-6 space-y-8 max-w-[1400px] mx-auto">
        <PlaylistDetailHeader
          onBack={() => navigate("/manager")}
          artworkUrl={playlist.artwork_url}
          name={playlist.name}
          genreName={playlist.genres?.name}
          moodName={playlist.moods?.name}
          songCount={allSongs.length}
          duration={calculateTotalDuration()}
          onPlay={handlePlayClick}
          onPush={() => setIsPushDialogOpen(true)}
        />

        <SongList 
          songs={allSongs}
          onSongSelect={handleSongSelect}
          currentSongIndex={isPlaying ? currentSongIndex : undefined}
          onCurrentSongIndexChange={setCurrentSongIndex}
          isPlaying={isPlaying}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
        />

        {isPlaying && allSongs && (
          <MusicPlayer
            playlist={{
              title: playlist.name,
              artwork: playlist.artwork_url || "/placeholder.svg",
              songs: allSongs.map(song => ({
                id: song.song_id,
                title: song.title,
                artist: song.artist || "Unknown Artist",
                duration: song.duration?.toString() || "0:00",
                file_url: song.file_url,
                bunny_id: song.bunny_id
              }))
            }}
            onClose={() => setIsPlaying(false)}
            initialSongIndex={currentSongIndex}
            onSongChange={setCurrentSongIndex}
            autoPlay={true}
          />
        )}

        <PushPlaylistDialog
          isOpen={isPushDialogOpen}
          onClose={() => setIsPushDialogOpen(false)}
          playlistTitle={playlist.name}
        />
      </div>
    </div>
  );
}