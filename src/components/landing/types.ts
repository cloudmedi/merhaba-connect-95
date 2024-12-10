export interface PreviewSong {
  id: string;
  title: string;
  artist: string;
  file_url: string;
}

export interface PreviewPlaylist {
  id: string;
  name: string;
  artwork_url?: string;
  songs: PreviewSong[];
}