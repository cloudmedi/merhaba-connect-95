import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SongList } from "@/components/playlists/SongList";
import { MusicPlayer } from "@/components/MusicPlayer";
import { PushPlaylistDialog } from "@/components/playlists/PushPlaylistDialog";
import { PlaylistDetailLoader } from "@/components/loaders/PlaylistDetailLoader";
import { PlaylistHeader } from "@/components/playlists/PlaylistHeader";
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
    <div className="min-h-screen bg-white">
      <div className="p-6 space-y-8 max-w-[1400px] mx-auto">
        <PlaylistHeader
          onBack={() => navigate("/manager")}
          artworkUrl={playlist.artwork_url}
          name={playlist.name}
          genreName={playlist.genres?.name}
          moodName={playlist.moods?.name}
          songCount={playlist.songs?.length || 0}
          duration={calculateTotalDuration()}
          onPlay={handlePlayClick}
          onPush={() => setIsPushDialogOpen(true)}
        />

        <SongList 
          songs={playlist.songs}
          onSongSelect={handleSongSelect}
          currentSongIndex={isPlaying ? currentSongIndex : undefined}
          onCurrentSongIndexChange={setCurrentSongIndex}
          isPlaying={isPlaying}
        />

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

        <PushPlaylistDialog
          isOpen={isPushDialogOpen}
          onClose={() => setIsPushDialogOpen(false)}
          playlistTitle={playlist.name}
          playlistId={playlist.id}
        />
      </div>
    </div>
  );
}
