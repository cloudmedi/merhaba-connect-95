export interface Song {
  id: string | number;
  title: string;
  artist: string;
  duration: string | number;
  file_url: string;
  bunny_id?: string;
}

export interface Playlist {
  title: string;
  artwork: string;
  songs?: Song[];
}

export interface MusicPlayerProps {
  playlist: Playlist;
  onClose: () => void;
  initialSongIndex?: number;
  autoPlay?: boolean;
  onSongChange?: (index: number) => void;
  onPlayStateChange?: (isPlaying: boolean) => void;
  currentSongId?: string | number;
}