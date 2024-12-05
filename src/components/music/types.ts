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

export interface AudioPlayerState {
  isPlaying: boolean;
  progress: number;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AudioControls {
  play: () => Promise<void>;
  pause: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
}

export interface PlaybackConfig {
  autoPlay?: boolean;
  volume?: number;
  onPlayStateChange?: (isPlaying: boolean) => void;
  onTimeUpdate?: (currentTime: number) => void;
  onEnded?: () => void;
  onError?: (error: Error) => void;
}