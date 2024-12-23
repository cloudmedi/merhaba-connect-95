export const REALTIME_CHANNEL_PREFIX = 'realtime:device_';
export const PLAYLIST_SYNC_EVENT = 'playlist_sync';
export const HEARTBEAT_EVENT = 'heartbeat';

export interface PlaylistSyncMessage {
  type: 'playlist_sync';
  payload: {
    playlist: {
      id: string;
      name: string;
      songs: Array<{
        id: string;
        title: string;
        artist?: string;
        file_url: string;
        bunny_id?: string;
      }>;
    };
  };
}

export interface HeartbeatMessage {
  type: 'heartbeat';
  payload: {
    timestamp: string;
    deviceToken: string;
  };
}

export type WebSocketMessage = PlaylistSyncMessage | HeartbeatMessage;