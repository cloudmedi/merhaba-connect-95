import { useState } from "react";
import api from "@/lib/api";
import { toast } from "sonner";
import { PLAYLIST_SYNC_EVENT } from "@/integrations/supabase/presence/types";

export function usePushPlaylist(playlistId: string) {
  const [isSyncing, setIsSyncing] = useState(false);

  const handlePush = async (deviceTokens: string[]) => {
    if (deviceTokens.length === 0) {
      return { success: false, error: "Lütfen en az bir cihaz seçin" };
    }

    try {
      setIsSyncing(true);
      console.log('Starting playlist sync for device tokens:', deviceTokens);

      const { data: playlist } = await api.get(`/admin/playlists/${playlistId}`);

      // Send sync request to API
      const { data } = await api.post('/admin/devices/sync-playlist', {
        playlistId,
        deviceTokens,
        playlist: {
          id: playlist.id,
          name: playlist.name,
          songs: playlist.songs.map((song: any) => ({
            id: song.id,
            title: song.title,
            artist: song.artist || '',
            file_url: song.bunny_id 
              ? `https://cloud-media.b-cdn.net/${song.bunny_id}`
              : song.file_url,
            bunny_id: song.bunny_id
          }))
        }
      });

      if (data.success) {
        return { success: true };
      } else {
        throw new Error(data.error || "Playlist sync failed");
      }

    } catch (error: any) {
      console.error('Error pushing playlist:', error);
      return { 
        success: false, 
        error: error.message || "Playlist gönderilirken bir hata oluştu" 
      };
    } finally {
      setIsSyncing(false);
    }
  };

  return {
    isSyncing,
    handlePush
  };
}