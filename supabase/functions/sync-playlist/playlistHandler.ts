import { createClient } from 'jsr:@supabase/supabase-js@2';
import { DeviceManager } from './deviceManager.ts';
import { WebSocketMessage } from './types.ts';

export class PlaylistHandler {
  private supabase: ReturnType<typeof createClient>;
  private deviceManager: DeviceManager;

  constructor(supabase: ReturnType<typeof createClient>, deviceManager: DeviceManager) {
    this.supabase = supabase;
    this.deviceManager = deviceManager;
  }

  async handlePlaylistSync(data: WebSocketMessage, senderToken: string) {
    try {
      const { playlistId, devices } = data.payload;
      
      if (!playlistId || !devices) {
        throw new Error('Invalid playlist data');
      }

      // Playlist verilerini getir
      const { data: playlist, error: playlistError } = await this.supabase
        .from('playlists')
        .select(`
          *,
          playlist_songs (
            position,
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

      if (playlistError || !playlist) {
        throw new Error('Playlist not found');
      }

      // Playlist verilerini düzenle
      const formattedPlaylist = {
        id: playlist.id,
        name: playlist.name,
        songs: playlist.playlist_songs
          .sort((a: any, b: any) => a.position - b.position)
          .map((ps: any) => ({
            ...ps.songs,
            file_url: ps.songs.bunny_id 
              ? `https://cloud-media.b-cdn.net/${ps.songs.bunny_id}`
              : ps.songs.file_url
          }))
      };

      // Her hedef cihaza gönder
      for (const deviceToken of devices) {
        const targetSocket = this.deviceManager.getDeviceSocket(deviceToken);
        if (targetSocket) {
          console.log('Sending playlist to device:', deviceToken);
          targetSocket.send(JSON.stringify({
            type: 'sync_playlist',
            payload: {
              playlist: formattedPlaylist
            }
          }));
        }
      }

      return {
        type: 'sync_success',
        payload: {
          message: 'Playlist successfully synced',
          deviceCount: devices.length
        }
      };
    } catch (error) {
      console.error('Error processing playlist:', error);
      return {
        type: 'error',
        payload: {
          message: error instanceof Error ? error.message : 'Unknown error occurred'
        }
      };
    }
  }
}