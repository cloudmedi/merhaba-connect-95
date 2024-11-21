import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PushPlaylistDialog } from "@/components/playlists/PushPlaylistDialog";
import { MusicPlayer } from "@/components/MusicPlayer";
import { PlaylistHeader } from "@/components/playlists/PlaylistHeader";
import { SongList } from "@/components/playlists/SongList";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface PlaylistData {
  id: string;
  name: string;
  artwork_url: string | null;
  genre: { name: string } | null;
  mood: { name: string } | null;
  songs: Array<{
    id: string;
    title: string;
    artist: string | null;
    duration: string;
    file_url: string;
    artwork_url: string | null;
  }>;
}

export function PlaylistDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isPushDialogOpen, setIsPushDialogOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const { data: playlist, isLoading } = useQuery({
    queryKey: ['playlist', id],
    queryFn: async () => {
      // Fetch playlist details
      const { data: playlist, error: playlistError } = await supabase
        .from('playlists')
        .select(`
          *,
          genre:genres!playlists_genre_id_fkey(name),
          mood:moods!playlists_mood_id_fkey(name)
        `)
        .eq('id', id)
        .single();

      if (playlistError) {
        toast.error("Playlist yüklenirken bir hata oluştu");
        throw playlistError;
      }

      // Fetch playlist songs
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
      } as PlaylistData;
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
        <PlaylistHeader
          onBack={() => navigate("/manager/playlists")}
          artworkUrl={playlist.artwork_url || undefined}
          name={playlist.name}
          genreName={playlist.genre?.name}
          moodName={playlist.mood?.name}
          songCount={playlist.songs?.length || 0}
          onPlay={() => setIsPlaying(true)}
          onPush={() => setIsPushDialogOpen(true)}
        />

        <SongList
          songs={playlist.songs || []}
          formatDuration={formatDuration}
        />
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