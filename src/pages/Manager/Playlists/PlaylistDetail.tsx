import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { MusicPlayer } from "@/components/MusicPlayer";
import { PushPlaylistDialog } from "./PushPlaylistDialog";
import { PlaylistDetailHeader } from "@/components/playlists/detail/PlaylistDetailHeader";
import { PlaylistSongList } from "@/components/playlists/detail/PlaylistSongList";

export function PlaylistDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isPushDialogOpen, setIsPushDialogOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);

  const {
    data: playlistData,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ['playlist', id],
    queryFn: async ({ pageParam = 0 }) => {
      console.log('Fetching page:', pageParam);
      const from = pageParam * 50;
      const to = from + 49;

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

      const { data: playlistSongs, error: songsError } = await supabase
        .from('playlist_songs')
        .select(`
          position,
          songs (
            id,
            title,
            artist,
            album,
            duration,
            artwork_url,
            file_url,
            genre,
            bunny_id
          )
        `)
        .eq('playlist_id', id)
        .order('position')
        .range(from, to);

      if (songsError) throw songsError;

      console.log(`Fetched ${playlistSongs.length} songs for page ${pageParam}`);

      return {
        ...playlist,
        songs: playlistSongs.map(ps => ps.songs),
        nextPage: playlistSongs.length === 50 ? pageParam + 1 : undefined
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600">Loading playlist...</p>
        </div>
      </div>
    );
  }

  if (!playlistData?.pages[0]) {
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

  const playlist = playlistData.pages[0];
  const allSongs = playlistData.pages.flatMap(page => page.songs);

  const handleSongSelect = (song: any, index: number) => {
    setCurrentSongIndex(index);
    setIsPlaying(true);
    toast.success("Playing selected song");
  };

  const handlePlayClick = () => {
    if (allSongs && allSongs.length > 0) {
      setCurrentSongIndex(0);
      setIsPlaying(true);
      toast.success("Playing playlist");
    }
  };

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    const threshold = 100; // pixels from bottom
    
    if (scrollHeight - scrollTop <= clientHeight + threshold) {
      if (hasNextPage && !isFetchingNextPage) {
        console.log('Loading next page of songs...');
        fetchNextPage();
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="p-6 space-y-8">
        <PlaylistDetailHeader
          playlist={playlist}
          onBack={() => navigate("/manager")}
          onPlayClick={handlePlayClick}
          onPushClick={() => setIsPushDialogOpen(true)}
        />

        <PlaylistSongList
          songs={allSongs}
          onSongSelect={handleSongSelect}
          currentSongIndex={isPlaying ? currentSongIndex : undefined}
          isPlaying={isPlaying}
          onScroll={handleScroll}
          isFetchingNextPage={isFetchingNextPage}
        />
      </div>

      <PushPlaylistDialog
        isOpen={isPushDialogOpen}
        onClose={() => setIsPushDialogOpen(false)}
        playlistTitle={playlist.name}
      />

      {isPlaying && allSongs && (
        <MusicPlayer
          playlist={{
            title: playlist.name,
            artwork: playlist.artwork_url || "/placeholder.svg",
            songs: allSongs.map(song => ({
              id: song.id,
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
    </div>
  );
}