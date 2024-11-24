import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { PushPlaylistDialog } from "./PushPlaylistDialog";
import { MusicPlayer } from "@/components/MusicPlayer";
import { SongList } from "@/components/playlists/SongList";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useMusic } from "@/pages/Manager/Dashboard";

export function PlaylistDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isPushDialogOpen, setIsPushDialogOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const { toast } = useToast();
  const { currentPlaylist, setCurrentPlaylist } = useMusic();

  const { data: playlist, isLoading } = useQuery({
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
            genre
          )
        `)
        .eq('playlist_id', id)
        .order('position');

      if (songsError) throw songsError;

      return {
        ...playlist,
        songs: playlistSongs.map(ps => ps.songs)
      };
    }
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!playlist) {
    return <div>Playlist not found</div>;
  }

  const handleSongSelect = (song: any) => {
    const index = playlist.songs.findIndex((s: any) => s.id === song.id);
    if (index !== -1) {
      setCurrentSongIndex(index);
      setIsPlaying(true);
    }
  };

  const handlePlayClick = () => {
    if (playlist.songs && playlist.songs.length > 0) {
      setCurrentSongIndex(0);
      setIsPlaying(true);
    }
  };

  const calculateTotalDuration = () => {
    if (!playlist.songs || playlist.songs.length === 0) return "0 min";
    
    const totalSeconds = playlist.songs.reduce((acc: number, song: any) => {
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
    <div className="min-h-screen bg-white rounded-lg shadow-sm">
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
              <span>{playlist.genres?.name || "Various"}</span>
              <span>•</span>
              <span>{playlist.moods?.name || "Various"}</span>
              <span>•</span>
              <span>{playlist.songs?.length || 0} songs</span>
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

        <SongList 
          songs={playlist.songs}
          onSongSelect={handleSongSelect}
          currentSongIndex={isPlaying ? currentSongIndex : undefined}
          onCurrentSongIndexChange={setCurrentSongIndex}
          isPlaying={isPlaying}
        />
      </div>

      <PushPlaylistDialog
        isOpen={isPushDialogOpen}
        onClose={() => setIsPushDialogOpen(false)}
        playlistTitle={playlist.name}
      />

      {isPlaying && playlist.songs && (
        <MusicPlayer
          playlist={{
            title: playlist.name,
            artwork: playlist.artwork_url || "/placeholder.svg",
            songs: playlist.songs.map(song => ({
              id: song.id,
              title: song.title,
              artist: song.artist || "Unknown Artist",
              duration: song.duration?.toString() || "0:00",
              file_url: song.file_url
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