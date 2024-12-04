import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { SongList } from "@/components/playlists/SongList";
import { PlaylistHeader } from "@/components/playlists/PlaylistHeader";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { MusicPlayer } from "@/components/MusicPlayer";
import { PushPlaylistDialog } from "@/components/playlists/PushPlaylistDialog";
import { PlaylistSong } from "@/components/playlists/types/playlist";

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

      // Map the songs to match PlaylistSong interface
      const mappedSongs: PlaylistSong[] = playlistSongs.map(ps => ({
        song_id: ps.songs.id,
        title: ps.songs.title,
        artist: ps.songs.artist || '',
        duration: ps.songs.duration || 0,
        file_url: ps.songs.file_url,
        bunny_id: undefined,
        position: ps.position,
        playlist_id: id || '',
        artwork_url: ps.songs.artwork_url
      }));

      return {
        ...playlist,
        songs: mappedSongs
      };
    }
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div>Loading...</div>
      </DashboardLayout>
    );
  }

  if (!playlist) {
    return (
      <DashboardLayout>
        <div>Playlist not found</div>
      </DashboardLayout>
    );
  }

  const handleSongSelect = (song: PlaylistSong) => {
    const index = playlist.songs.findIndex((s) => s.song_id === song.song_id);
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
    
    const totalSeconds = playlist.songs.reduce((acc, song) => {
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
    <DashboardLayout>
      <div className="space-y-8">
        <PlaylistHeader
          onBack={() => navigate("/super-admin/playlists")}
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
              songs: playlist.songs.map(song => ({
                id: song.song_id,
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
        />
      </div>
    </DashboardLayout>
  );
}