import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PlaylistHeader } from "@/components/playlists/PlaylistHeader";
import { SongList } from "@/components/playlists/SongList";
import { PushPlaylistDialog } from "@/components/playlists/PushPlaylistDialog";
import { MusicPlayer } from "@/components/MusicPlayer";

interface PlaylistSong {
  id: string;
  title: string;
  artist: string | null;
  duration: number | null;
  file_url: string;
  artwork_url?: string | null;
}

interface PlaylistData {
  id: string;
  name: string;
  description?: string;
  artwork_url?: string;
  genre: { name: string } | null;
  mood: { name: string } | null;
  songs: PlaylistSong[];
}

const formatDuration = (duration: number | null): string => {
  if (!duration) return "0:00";
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const calculateTotalDuration = (songs: PlaylistSong[]): string => {
  const totalSeconds = songs.reduce((acc, song) => acc + (song.duration || 0), 0);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
};

export function PlaylistDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isPushDialogOpen, setIsPushDialogOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const { data: playlist, isLoading } = useQuery({
    queryKey: ['playlist', id],
    queryFn: async () => {
      const { data: playlist, error: playlistError } = await supabase
        .from('playlists')
        .select(`
          *,
          genre:genres(name),
          mood:moods(name)
        `)
        .eq('id', id)
        .single();

      if (playlistError) {
        toast.error("Playlist yüklenirken bir hata oluştu");
        throw playlistError;
      }

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

      if (songsError) {
        toast.error("Şarkılar yüklenirken bir hata oluştu");
        throw songsError;
      }

      const songs = playlistSongs.map(ps => ({
        id: ps.songs.id,
        title: ps.songs.title,
        artist: ps.songs.artist || 'Unknown Artist',
        duration: ps.songs.duration,
        file_url: ps.songs.file_url,
        artwork_url: ps.songs.artwork_url
      }));

      return {
        ...playlist,
        songs
      } as PlaylistData;
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white rounded-lg shadow-sm">
        <div className="p-6 space-y-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 w-1/4 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 w-3/4 rounded"></div>
              <div className="h-4 bg-gray-200 w-1/2 rounded"></div>
            </div>
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

  return (
    <div className="min-h-screen bg-white rounded-lg shadow-sm">
      <div className="p-6 space-y-8">
        <PlaylistHeader 
          onBack={() => navigate("/manager/playlists")}
          artworkUrl={playlist.artwork_url}
          name={playlist.name}
          genreName={playlist.genre?.name}
          moodName={playlist.mood?.name}
          songCount={playlist.songs.length}
          duration={calculateTotalDuration(playlist.songs)}
          onPlay={() => setIsPlaying(true)}
          onPush={() => setIsPushDialogOpen(true)}
        />

        <SongList 
          songs={playlist.songs}
          formatDuration={formatDuration}
        />
      </div>

      <PushPlaylistDialog
        isOpen={isPushDialogOpen}
        onClose={() => setIsPushDialogOpen(false)}
        playlistTitle={playlist.name}
      />

      {isPlaying && (
        <MusicPlayer
          playlist={{
            title: playlist.name,
            artwork: playlist.artwork_url || "/placeholder.svg",
            songs: playlist.songs.map(song => ({
              id: song.id,
              title: song.title,
              artist: song.artist || 'Unknown Artist',
              duration: formatDuration(song.duration),
              file_url: song.file_url
            }))
          }}
          onClose={() => setIsPlaying(false)}
        />
      )}
    </div>
  );
}