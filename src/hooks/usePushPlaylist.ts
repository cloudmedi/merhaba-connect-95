import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PLAYLIST_SYNC_EVENT } from "@/integrations/supabase/presence/types";

export function usePushPlaylist(playlistId: string, playlistTitle: string, onClose: () => void) {
  const [isSyncing, setIsSyncing] = useState(false);

  const handlePush = async (deviceTokens: string[]) => {
    if (deviceTokens.length === 0) {
      return { success: false, error: "Lütfen en az bir cihaz seçin" };
    }

    try {
      setIsSyncing(true);
      console.log('Starting playlist sync for device tokens:', deviceTokens);

      const { data: playlist, error: playlistError } = await supabase
        .from('playlists')
        .select(`
          *,
          playlist_songs (
            songs (
              id,
              title,
              artist,
              file_url,
              bunny_id
            )
          )
        `)
        .eq('id', playlistId)
        .single();

      if (playlistError) throw playlistError;

      const songs = playlist.playlist_songs.map((ps: any) => ({
        id: ps.songs.id,
        title: ps.songs.title,
        artist: ps.songs.artist || '',
        file_url: ps.songs.bunny_id 
          ? `https://cloud-media.b-cdn.net/${ps.songs.bunny_id}`
          : ps.songs.file_url,
        bunny_id: ps.songs.bunny_id
      }));

      // Her cihaz için broadcast mesajı gönder
      for (const token of deviceTokens) {
        if (!token) continue;

        const channelName = `realtime:device_${token}`;
        console.log('Sending to channel:', channelName);
        
        const channel = supabase.channel(channelName);
        console.log('Channel created:', channel);
        
        await channel.subscribe(async (status) => {
          console.log('Channel subscription status:', status);
          
          if (status === 'SUBSCRIBED') {
            const message = {
              type: PLAYLIST_SYNC_EVENT,
              playlist: {
                id: playlist.id,
                name: playlist.name,
                songs: songs
              }
            };

            console.log('Sending message:', JSON.stringify(message, null, 2));
            
            await channel.send({
              type: 'broadcast',
              event: 'broadcast',
              payload: message
            });

            console.log('Playlist sent successfully to device:', token);
          }
        });
      }

      return { success: true };
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