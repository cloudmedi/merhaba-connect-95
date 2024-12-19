export interface Song {
  _id: string;
  id?: string;
  title: string;
  artist?: string;
  album?: string;
  duration?: number;
  fileUrl?: string;
  file_url?: string;
  artworkUrl?: string;
  artwork_url?: string;
  bunnyId?: string;
  genre?: string[];
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  artworkUrl?: string;
  isPublic: boolean;
  isHero: boolean;
  createdBy: string;
  songs: Song[];
  genreId?: string;
  moodId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlaylistCreateInput {
  name: string;
  description?: string;
  artworkUrl?: string;
  isPublic?: boolean;
  isHero?: boolean;
  genreId?: string;
  moodId?: string;
  songs?: string[];
}

export interface PlaylistUpdateInput extends Partial<PlaylistCreateInput> {}
