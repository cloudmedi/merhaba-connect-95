import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Music2, Play } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { PushPlaylistDialog } from "@/components/playlists/PushPlaylistDialog";
import { MusicPlayer } from "@/components/MusicPlayer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function PlaylistDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isPushDialogOpen, setIsPushDialogOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Fetch playlist details including songs
  const { data: playlist, isLoading } = useQuery({
    queryKey: ['playlist', id],
    queryFn: async () => {
      // First get the playlist details
      const { data: playlist, error: playlistError } = await supabase
        .from('playlists')
        .select(`
          *,
          genres:genre_id(name),
          moods:mood_id(name)
        `)
        .eq('id', id)
        .single();

      if (playlistError) throw playlistError;

      // Then get the songs for this playlist
      const { data: playlistSongs, error: songsError } = await supabase
        .from('playlist_songs')
        .select(`
          position,
          songs (
            id,
            title,
            artist,
            duration,
            file_url,
            artwork_url
          )
        `)
        .eq('playlist_id', id)
        .order('position');

      if (songsError) throw songsError;

      return {
        ...playlist,
        songs: playlistSongs.map(ps => ({
          id: ps.songs.id,
          title: ps.songs.title,
          artist: ps.songs.artist || 'Unknown Artist',
          duration: ps.songs.duration?.toString() || "0:00",
          file_url: ps.songs.file_url,
          artwork_url: ps.songs.artwork_url
        }))
      };
    },
    onError: (error: any) => {
      toast.error("Playlist yüklenirken bir hata oluştu", {
        description: error.message
      });
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 w-1/4 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 w-3/4 rounded"></div>
            <div className="h-4 bg-gray-200 w-1/2 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="min-h-screen bg-white rounded-lg shadow-sm p-6">
        <div className="text-center text-gray-500">
          Playlist bulunamadı
        </div>
      </div>
    );
  }

  const formatDuration = (duration: string) => {
    if (!duration) return "0:00";
    const minutes = Math.floor(Number(duration) / 60);
    const seconds = Math.floor(Number(duration) % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-white rounded-lg shadow-sm">
      <div className="p-6 space-y-8">
        <div className="flex items-center gap-2 text-gray-500">
          <button 
            onClick={() => navigate("/manager/playlists")}
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
              <span>{playlist.genres?.name || "Various"}</span>
              <span>•</span>
              <span>{playlist.moods?.name || "Various"}</span>
              <span>•</span>
              <span>{playlist.songs?.length || 0} songs</span>
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
            {playlist.songs && playlist.songs.length > 0 ? (
              playlist.songs.map((song, index) => (
                <div 
                  key={song.id}
                  className="grid grid-cols-12 py-4 text-sm hover:bg-gray-50/50 transition-colors items-center border-b border-gray-100"
                >
                  <div className="col-span-1 text-gray-400">{index + 1}</div>
                  <div className="col-span-5 font-medium text-gray-900 flex items-center gap-2">
                    <Music2 className="w-4 h-4 text-gray-400" />
                    {song.title}
                  </div>
                  <div className="col-span-4 text-gray-500">{song.artist}</div>
                  <div className="col-span-2 text-right text-gray-500">
                    {formatDuration(song.duration)}
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-gray-500">
                No songs in this playlist
              </div>
            )}
          </ScrollArea>
        </div>
      </div>

      <PushPlaylistDialog
        isOpen={isPushDialogOpen}
        onClose={() => setIsPushDialogOpen(false)}
        playlistTitle={playlist.name}
      />

      {isPlaying && playlist.songs && playlist.songs.length > 0 && (
        <MusicPlayer
          playlist={{
            title: playlist.name,
            artwork: playlist.artwork_url || "/placeholder.svg",
            songs: playlist.songs
          }}
          onClose={() => setIsPlaying(false)}
        />
      )}
    </div>
  );
}