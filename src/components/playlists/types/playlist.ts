export interface PlaylistSong {
  song_id: string;
  title: string;
  artist: string;
  duration: number;
  file_url: string;
  bunny_id?: string;
  position: number;
  playlist_id: string;
  artwork_url?: string;
}

export interface Playlist {
  id: string;
  name: string;
  artwork_url: string | null;
  genre_id: string | null;
  mood_id: string | null;
  genres?: {
    name: string;
  };
  moods?: {
    name: string;
  };
}