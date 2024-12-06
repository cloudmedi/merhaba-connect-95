export interface PlaylistData {
  id: string;
  name: string;
  songs: Array<{
    id: string;
    title: string;
    artist?: string;
    file_url: string;
    bunny_id?: string;
  }>;
}

export interface WebSocketMessage {
  type: 'sync_playlist' | 'sync_success' | 'sync_error' | 'presence_update';
  payload: {
    playlist?: PlaylistData;
    playlistId?: string;
    devices?: string[];
    status?: 'online' | 'offline';
    message?: string;
  };
}