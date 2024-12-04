import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Music2, Play } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useRef, useCallback } from "react";
import { PushPlaylistDialog } from "./PushPlaylistDialog";
import { MusicPlayer } from "@/components/MusicPlayer";
import { useInfiniteQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function PlaylistDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isPushDialogOpen, setIsPushDialogOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

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

      // Fetch playlist details
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

      // Fetch paginated songs
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

  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    const threshold = 100; // pixels from bottom
    
    if (scrollHeight - scrollTop <= clientHeight + threshold) {
      if (hasNextPage && !isFetchingNextPage) {
        console.log('Loading next page of songs...');
        fetchNextPage();
      }
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

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

  const handleSongSelect = (song: any) => {
    const index = allSongs.findIndex(s => s.id === song.id);
    if (index !== -1) {
      setCurrentSongIndex(index);
      setIsPlaying(true);
      toast.success("Playing selected song");
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
      <div className="p-6 space-y-8">
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
              src={playlist.artwork_url || "/placeholder.svg"} 
              alt={playlist.name}
              className="w-32 h-32 rounded-lg object-cover"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 rounded-lg flex items-center justify-center">
              <button
                onClick={handlePlayClick}
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

          <ScrollArea 
            ref={scrollRef}
            className="h-[calc(100vh-400px)]" 
            onScrollCapture={handleScroll}
          >
            <div className="space-y-1">
              {allSongs.map((song, index) => (
                <div 
                  key={`${song.id}-${index}`}
                  onClick={() => handleSongSelect(song)}
                  className="grid grid-cols-12 py-4 text-sm hover:bg-gray-50/50 transition-colors items-center border-b border-gray-100 cursor-pointer"
                >
                  <div className="col-span-1 text-gray-400">{index + 1}</div>
                  <div className="col-span-5 font-medium text-gray-900 flex items-center gap-2">
                    <Music2 className="w-4 h-4 text-gray-400" />
                    {song.title}
                  </div>
                  <div className="col-span-4 text-gray-500">{song.artist || 'Unknown Artist'}</div>
                  <div className="col-span-2 text-right text-gray-500">
                    {song.duration ? `${Math.floor(song.duration / 60)}:${(song.duration % 60).toString().padStart(2, '0')}` : '0:00'}
                  </div>
                </div>
              ))}

              {isFetchingNextPage && (
                <div className="py-4 text-center text-gray-500">
                  <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  Loading more songs...
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
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