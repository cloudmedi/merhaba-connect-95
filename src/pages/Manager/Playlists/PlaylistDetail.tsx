import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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

  const { data: playlist, isLoading } = useQuery({
    queryKey: ['playlist', id],
    queryFn: async () => {
      console.log('Fetching playlist data...');
      const { data: playlist, error: playlistError } = await supabase
        .from('playlists')
        .select(`
          *,
          genres (name),
          moods (name)
        `)
        .eq('id', id)
        .single();

      if (playlistError) {
        console.error('Error fetching playlist:', playlistError);
        throw playlistError;
      }

      console.log('Fetching playlist songs...');
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
        .order('position');

      if (songsError) {
        console.error('Error fetching songs:', songsError);
        throw songsError;
      }

      console.log(`Found ${playlistSongs.length} songs`);

      return {
        ...playlist,
        songs: playlistSongs.map(ps => ps.songs)
      };
    }
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
      toast.success("Playing selected song");
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
      <div className="p-6 space-y-8">
        <PlaylistDetailHeader
          onBack={() => navigate("/manager")}
          artworkUrl={playlist.artwork_url}
          name={playlist.name}
          genreName={playlist.genres?.name}
          moodName={playlist.moods?.name}
          songCount={playlist.songs?.length}
          duration={calculateTotalDuration()}
          onPlay={handlePlayClick}
          onPush={() => setIsPushDialogOpen(true)}
          isHero={playlist.is_hero}
          id={playlist.id}
        />

        <PlaylistSongList 
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