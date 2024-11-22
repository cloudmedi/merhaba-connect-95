import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MusicPlayer } from "@/components/MusicPlayer";
import { PlaylistDetailHeader } from "@/components/playlists/PlaylistDetailHeader";
import { SongList } from "@/components/playlists/SongList";
import { PushPlaylistDialog } from "./PushPlaylistDialog";

export function PlaylistDetail() {
  const { id } = useParams();
  const [isPushDialogOpen, setIsPushDialogOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);

  const { data: playlist, isLoading } = useQuery({
    queryKey: ['playlist', id],
    queryFn: async () => {
      const { data: playlistData, error: playlistError } = await supabase
        .from('playlists')
        .select(`
          id,
          name,
          genre:genres(name),
          mood:moods(name),
          artwork_url,
          songs:playlist_songs(
            position,
            songs(
              id,
              title,
              artist,
              duration,
              file_url,
              bunny_id
            )
          )
        `)
        .eq('id', id)
        .single();

      if (playlistError) throw playlistError;

      // Transform the songs data structure and handle Bunny CDN URLs
      const transformedSongs = playlistData.songs
        .sort((a: any, b: any) => a.position - b.position)
        .map((item: any) => {
          let fileUrl = item.songs.file_url;
          
          // If we have a bunny_id, construct the full CDN URL
          if (item.songs.bunny_id) {
            fileUrl = `https://cloud-media.b-cdn.net/${item.songs.bunny_id}`;
          } else if (!fileUrl.startsWith('http')) {
            // If it's a relative URL, make it absolute
            fileUrl = `https://cloud-media.b-cdn.net/${fileUrl}`;
          }

          return {
            id: item.songs.id,
            title: item.songs.title,
            artist: item.songs.artist || "Unknown Artist",
            duration: item.songs.duration,
            file_url: fileUrl
          };
        });

      return {
        ...playlistData,
        songs: transformedSongs
      };
    },
    meta: {
      onError: (error: Error) => {
        console.error('Error loading playlist:', error);
        toast.error("Failed to load playlist");
      }
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 w-1/4 rounded"></div>
          <div className="h-32 bg-gray-200 w-32 rounded-lg"></div>
          <div className="h-8 bg-gray-200 w-1/2 rounded"></div>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="min-h-screen bg-white rounded-lg shadow-sm p-6">
        <div className="text-center text-gray-500">
          Playlist not found
        </div>
      </div>
    );
  }

  const handleSongSelect = (song: any) => {
    const songIndex = playlist.songs.findIndex((s: any) => s.id === song.id);
    setCurrentSongIndex(songIndex);
    setIsPlaying(true);
  };

  return (
    <div className="min-h-screen bg-white rounded-lg shadow-sm">
      <div className="p-6 space-y-8">
        <PlaylistDetailHeader 
          playlist={playlist}
          onPlay={() => setIsPlaying(true)}
          onPush={() => setIsPushDialogOpen(true)}
        />

        <SongList 
          songs={playlist.songs}
          onSongSelect={handleSongSelect}
          currentSongId={isPlaying ? playlist.songs[currentSongIndex]?.id : undefined}
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
            songs: playlist.songs
          }}
          onClose={() => setIsPlaying(false)}
          initialSongIndex={currentSongIndex}
        />
      )}
    </div>
  );
}