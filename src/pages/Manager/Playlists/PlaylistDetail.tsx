import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Music2, Play } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect } from "react";
import { PushPlaylistDialog } from "./PushPlaylistDialog";
import { MusicPlayer } from "@/components/MusicPlayer";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useInView } from "react-intersection-observer";
import { PlaylistSong, Playlist } from "@/components/playlists/types/playlist";
import { toast } from "sonner";

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
      return data as Playlist;
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
      return data as PlaylistSong[];
    },
    initialPageParam: 0,
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
        <div className="flex items-center gap-2 text-gray-500">
          <button 
            onClick={() => navigate("/manager")}
            className="flex items-center gap-2 hover:text-gray-900 transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Media Library
          </button>
        </div>

        <div className="flex items-start gap-8">
          <div className="relative group">
            <img 
              src={playlist.artwork_url || '/placeholder.svg'} 
              alt={playlist.name}
              className="w-32 h-32 rounded-lg object-cover"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 rounded-lg flex items-center justify-center">
              <button
                onClick={() => setIsPlaying(true)}
                className="opacity-0 group-hover:opacity-100 transition-all duration-300 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm text-white flex items-center justify-center hover:scale-110 transform"
              >
                <Play className="w-6 h-6" />
              </button>
            </div>
          </div>
          <div className="space-y-3">
            <h1 className="text-2xl font-semibold text-gray-900">{playlist.name}</h1>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>{playlist.genres?.name}</span>
              <span>•</span>
              <span>{playlist.moods?.name}</span>
              <span>•</span>
              <span>{allSongs.length} songs</span>
              <span>•</span>
              <span>{calculateTotalDuration()}</span>
            </div>
            <Button 
              onClick={() => setIsPushDialogOpen(true)}
              className="bg-[#6366F1] text-white hover:bg-[#5558DD] rounded-full px-8"
            >
              Push
            </Button>
          </div>
        </div>

        <div className="mt-12">
          <div className="grid grid-cols-12 text-xs text-gray-500 uppercase tracking-wider pb-4 border-b">
            <div className="col-span-1">#</div>
            <div className="col-span-5">TITLE</div>
            <div className="col-span-4">ARTIST</div>
            <div className="col-span-2 text-right">DURATION</div>
          </div>

          <ScrollArea className="h-[calc(100vh-300px)]">
            {allSongs.map((song, index) => (
              <div 
                key={song.song_id}
                className="grid grid-cols-12 py-4 text-sm hover:bg-gray-50/50 transition-colors items-center border-b border-gray-100"
              >
                <div className="col-span-1 text-gray-400">{index + 1}</div>
                <div className="col-span-5 font-medium text-gray-900 flex items-center gap-2">
                  <Music2 className="w-4 h-4 text-gray-400" />
                  {song.title}
                </div>
                <div className="col-span-4 text-gray-500">{song.artist}</div>
                <div className="col-span-2 text-right text-gray-500">
                  {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            <div ref={ref} className="py-4 text-center">
              {isFetchingNextPage ? (
                <div className="animate-pulse text-gray-500">Loading more songs...</div>
              ) : hasNextPage ? (
                <div className="text-gray-400">Scroll for more</div>
              ) : null}
            </div>
          </ScrollArea>
        </div>

        {isPlaying && allSongs && (
          <MusicPlayer
            playlist={{
              title: playlist.name,
              artwork: playlist.artwork_url || "/placeholder.svg",
              songs: allSongs.map(song => ({
                id: song.song_id,
                title: song.title,
                artist: song.artist,
                duration: song.duration,
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