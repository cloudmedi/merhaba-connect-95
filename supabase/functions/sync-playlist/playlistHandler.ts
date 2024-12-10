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
      console.log('=== PlaylistHandler: Starting playlist sync ===');
      console.log('Received data:', JSON.stringify(data, null, 2));
      console.log('Sender token:', senderToken);
      
      if (!data.payload || !data.payload.devices) {
        console.error('Missing devices in payload');
        throw new Error('Missing devices in payload');
      }

      const { playlist, devices } = data.payload;
      console.log('Target device tokens:', devices);
      
      if (!playlist || !playlist.id || !Array.isArray(devices) || devices.length === 0) {
        console.error('Invalid playlist data structure:', playlist);
        throw new Error('Invalid playlist data structure');
      }

      // Get playlist data
      console.log('Fetching playlist data for ID:', playlist.id);
      const { data: playlistData, error: playlistError } = await this.supabase
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
        .eq('id', playlist.id)
        .single();

      if (playlistError || !playlistData) {
        console.error('Playlist fetch error:', playlistError);
        throw new Error('Playlist not found');
      }

      console.log('Playlist data fetched successfully');

      // Format playlist data
      const formattedPlaylist = {
        id: playlistData.id,
        name: playlistData.name,
        songs: playlistData.playlist_songs
          .sort((a: any, b: any) => a.position - b.position)
          .map((ps: any) => ({
            ...ps.songs,
            file_url: ps.songs.bunny_id 
              ? `https://cloud-media.b-cdn.net/${ps.songs.bunny_id}`
              : ps.songs.file_url
          }))
      };

      console.log('Formatted playlist:', JSON.stringify(formattedPlaylist, null, 2));

      // Send to each target device using device tokens
      let successCount = 0;
      let errorCount = 0;

      for (const deviceToken of devices) {
        console.log(`Attempting to send playlist to device with token: ${deviceToken}`);
        const targetSocket = this.deviceManager.getDeviceSocket(deviceToken);
        
        if (targetSocket) {
          console.log('Device socket found, sending playlist...');
          try {
            const message = JSON.stringify({
              type: 'sync_playlist',
              payload: {
                playlist: formattedPlaylist
              }
            });
            console.log('Sending message:', message);
            targetSocket.send(message);
            successCount++;
            console.log('Playlist sent successfully to device token:', deviceToken);
          } catch (error) {
            console.error('Error sending to device token:', deviceToken, error);
            errorCount++;
          }
        } else {
          console.warn('Device not connected:', deviceToken);
          errorCount++;
        }
      }

      console.log(`Sync complete. Success: ${successCount}, Errors: ${errorCount}`);

      return {
        type: 'sync_success',
        payload: {
          message: 'Playlist successfully synced',
          deviceCount: devices.length,
          successCount,
          errorCount
        }
      };
    } catch (error) {
      console.error('Error in handlePlaylistSync:', error);
      return {
        type: 'sync_error',
        payload: {
          message: error instanceof Error ? error.message : 'Unknown error occurred'
        }
      };
    }
  }
}