export interface Song {
  id: number;
  title: string;
  artist: string;
  album: string;
  genres: string[];
  duration: string;
  file: File;
  artwork?: string;
  uploadDate: Date;
  playlists?: string[];
  mood?: string;
  uploader?: string;
}

export interface Filters {
  artists: string[];
  albums: string[];
  uploaders: string[];
  genre: string;
  mood: string;
}