import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SongList } from "@/components/playlists/SongList";
import { MusicPlayer } from "@/components/MusicPlayer";
import { PushPlaylistDialog } from "@/components/playlists/PushPlaylistDialog";
import { PlaylistDetailLoader } from "@/components/loaders/PlaylistDetailLoader";
import { PlaylistHeader } from "@/components/playlists/PlaylistHeader";
import { toast } from "sonner";
import { useInView } from "react-intersection-observer";

const SONGS_PER_PAGE = 50;

export function PlaylistDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isPushDialogOpen, setIsPushDialogOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const { ref, inView } = useInView();

  // Fetch playlist details
  const { data: playlist, isLoading: isPlaylistLoading } = useQuery({
    queryKey: ['playlist', id],
    queryFn: async () => {
      const { data: playlist, error: playlistError } = await supabase
        .from('playlists')
        .select(`
          *,
          genres (name),
          moods (name)
        `)
        .eq('id', id)
        .single();

      if (playlistError) throw playlistError;
      return playlist;
    }
  });

  // Fetch paginated songs
  const {
    data: songPages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isSongsLoading
  } = useInfiniteQuery({
    queryKey: ['playlist-songs', id],
    queryFn: async ({ pageParam = 0 }) => {
      const from = pageParam * SONGS_PER_PAGE;
      const to = from + SONGS_PER_PAGE - 1;

      const { data, error } = await supabase
        .from('paginated_playlist_songs')
        .select('*')
        .eq('playlist_id', id)
        .range(from, to)
        .order('position');

      if (error) throw error;
      return data;
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === SONGS_PER_PAGE ? allPages.length : undefined;
    },
  });

  // Load more songs when scrolling to the bottom
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const isLoading = isPlaylistLoading || isSongsLoading;

  if (isLoading) {
    return <PlaylistDetailLoader />;
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

  const handleSongSelect = (song: any) => {
    const index = allSongs.findIndex((s: any) => s.song_id === song.song_id);
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
    
    const totalSeconds = allSongs.reduce((acc: number, song: any) => {
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
        <PlaylistHeader
          onBack={() => navigate("/manager")}
          artworkUrl={playlist.artwork_url}
          name={playlist.name}
          genreName={playlist.genres?.name}
          moodName={playlist.moods?.name}
          songCount={allSongs?.length || 0}
          duration={calculateTotalDuration()}
          onPlay={handlePlayClick}
          onPush={() => setIsPushDialogOpen(true)}
        />

        <SongList 
          songs={allSongs.map(s => ({
            id: s.song_id,
            title: s.title,
            artist: s.artist || "Unknown Artist",
            duration: s.duration?.toString() || "0:00",
            file_url: s.file_url,
            bunny_id: s.bunny_id
          }))}
          onSongSelect={handleSongSelect}
          currentSongIndex={isPlaying ? currentSongIndex : undefined}
          onCurrentSongIndexChange={setCurrentSongIndex}
          isPlaying={isPlaying}
        />

        {/* Loading indicator */}
        <div ref={ref} className="py-4 text-center">
          {isFetchingNextPage ? (
            <div className="animate-pulse text-gray-500">Loading more songs...</div>
          ) : hasNextPage ? (
            <div className="text-gray-400">Scroll for more</div>
          ) : null}
        </div>

        {isPlaying && allSongs && (
          <MusicPlayer
            playlist={{
              title: playlist.name,
              artwork_url: playlist.artwork_url || "/placeholder.svg",
              songs: allSongs.map((song: any) => ({
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