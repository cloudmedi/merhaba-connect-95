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
  type: 'sync_playlist' | 'sync_success' | 'error';
  payload: {
    playlist?: PlaylistData;
    playlistId?: string;
    devices?: string[];
    message?: string;
  };
}