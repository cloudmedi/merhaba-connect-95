export interface Song {
  id: string;
  title: string;
  artist?: string;
  duration?: number;
  fileUrl?: string;
  artworkUrl?: string;
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