export interface Song {
  id: string;
  title: string;
  artist?: string;
  duration?: number;
  file_url?: string;
  artwork_url?: string;
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  artwork_url?: string;
  is_public: boolean;
  is_hero: boolean;
  created_by: string;
  songs: Song[];
  genre_id?: string;
  mood_id?: string;
  created_at: string;
  updated_at: string;
}

export interface PlaylistCreateInput {
  name: string;
  description?: string;
  artwork_url?: string;
  is_public?: boolean;
  is_hero?: boolean;
  genre_id?: string;
  mood_id?: string;
  songs?: string[];
}

export interface PlaylistUpdateInput extends Partial<PlaylistCreateInput> {}