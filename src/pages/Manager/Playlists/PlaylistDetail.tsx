import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SongList } from "@/components/playlists/SongList";
import { MusicPlayer } from "@/components/MusicPlayer";
import { PushPlaylistDialog } from "@/components/playlists/PushPlaylistDialog";
import { PlaylistDetailLoader } from "@/components/loaders/PlaylistDetailLoader";
import { PlaylistHeader } from "@/components/playlists/PlaylistHeader";
import { toast } from "sonner";

interface PlaylistSong {
  id: string;
  title: string;
  artist: string | null;
  album: string | null;
  duration: number | null;
  artwork_url: string | null;
  file_url: string;
  genre: string[] | null;
  bunny_id: string | null;
}

interface PlaylistData {
  id: string;
  name: string;
  description: string | null;
  artwork_url: string | null;
  genres: { name: string } | null;
  moods: { name: string } | null;
  songs: PlaylistSong[];
}

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

      console.log('Fetched songs:', playlistSongs.length);

      return {
        ...playlist,
        songs: playlistSongs.map(ps => ps.songs),
        nextPage: playlistSongs.length === 50 ? pageParam + 1 : undefined
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0
  });

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight * 1.5) {
      if (hasNextPage && !isFetchingNextPage) {
        console.log('Loading next page...');
        fetchNextPage();
      }
    }
  };

  if (isLoading) {
    return <PlaylistDetailLoader />;
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

  const handleSongSelect = (song: PlaylistSong) => {
    const index = allSongs.findIndex((s: any) => s.id === song.id);
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

        <div onScroll={handleScroll} style={{ maxHeight: 'calc(100vh - 300px)', overflowY: 'auto' }}>
          <SongList 
            songs={allSongs}
            onSongSelect={handleSongSelect}
            currentSongIndex={isPlaying ? currentSongIndex : undefined}
            onCurrentSongIndexChange={setCurrentSongIndex}
            isPlaying={isPlaying}
          />
          
          {isFetchingNextPage && (
            <div className="py-4 text-center text-gray-500">
              Loading more songs...
            </div>
          )}
        </div>

        {isPlaying && allSongs && (
          <MusicPlayer
            playlist={{
              title: playlist.name,
              artwork: playlist.artwork_url || "/placeholder.svg",
              songs: allSongs.map((song: any) => ({
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

        <PushPlaylistDialog
          isOpen={isPushDialogOpen}
          onClose={() => setIsPushDialogOpen(false)}
          playlistTitle={playlist.name}
        />
      </div>
    </div>
  );
}