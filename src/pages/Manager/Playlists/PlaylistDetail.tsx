import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SongList } from "@/components/playlists/SongList";
import { MusicPlayer } from "@/components/MusicPlayer";
import { PushPlaylistDialog } from "./PushPlaylistDialog";
import { PlaylistDetailLoader } from "@/components/loaders/PlaylistDetailLoader";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Music2, Play } from "lucide-react";
import { toast } from "sonner";

export function PlaylistDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isPushDialogOpen, setIsPushDialogOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);

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
    return <PlaylistDetailLoader />;
  }

  if (!playlist) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">Playlist not found</h2>
          <Button variant="outline" onClick={() => navigate("/manager")}>
            Back to Media Library
          </Button>
        </div>
      </div>
    );
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
      toast.success("Playing playlist");
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
    <div className="min-h-screen bg-white">
      <div className="p-6 space-y-8 max-w-[1400px] mx-auto">
        {/* Header Section */}
        <div className="flex items-center gap-2 text-gray-500">
          <button 
            onClick={() => navigate("/manager")}
            className="flex items-center gap-2 hover:text-gray-900 transition-colors text-sm group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Media Library
          </button>
        </div>

        {/* Playlist Info Section */}
        <div className="flex items-start gap-8">
          <div className="relative group">
            <img 
              src={playlist.artwork_url || "/placeholder.svg"} 
              alt={playlist.name}
              className="w-48 h-48 rounded-lg object-cover shadow-lg group-hover:shadow-xl transition-all duration-300"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 rounded-lg flex items-center justify-center">
              <Button
                size="icon"
                variant="ghost"
                onClick={handlePlayClick}
                className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300"
              >
                <Play className="w-6 h-6" />
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{playlist.name}</h1>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Music2 className="w-4 h-4" /> {playlist.songs?.length || 0} songs
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" /> {calculateTotalDuration()}
                </span>
                {playlist.genres?.name && (
                  <>
                    <span>•</span>
                    <span className="px-2 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-medium">
                      {playlist.genres.name}
                    </span>
                  </>
                )}
                {playlist.moods?.name && (
                  <span className="px-2 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium">
                    {playlist.moods.name}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button 
                onClick={() => setIsPushDialogOpen(true)}
                className="bg-purple-600 text-white hover:bg-purple-700 rounded-full px-8"
              >
                Push
              </Button>
            </div>
          </div>
        </div>

        {/* Songs List */}
        <div className="mt-8">
          <SongList 
            songs={playlist.songs}
            onSongSelect={handleSongSelect}
            currentSongIndex={isPlaying ? currentSongIndex : undefined}
            onCurrentSongIndexChange={setCurrentSongIndex}
            isPlaying={isPlaying}
          />
        </div>

        {/* Music Player */}
        {isPlaying && playlist.songs && (
          <MusicPlayer
            playlist={{
              title: playlist.name,
              artwork: playlist.artwork_url || "/placeholder.svg",
              songs: playlist.songs.map((song: any) => ({
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

        {/* Push Dialog */}
        <PushPlaylistDialog
          isOpen={isPushDialogOpen}
          onClose={() => setIsPushDialogOpen(false)}
          playlistTitle={playlist.name}
        />
      </div>
    </div>
  );
}

export default PlaylistDetail;