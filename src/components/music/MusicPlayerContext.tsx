import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { Song, Playlist, AudioPlayerState } from './types';

interface MusicPlayerContextType {
  currentSong: Song | null;
  playlist: Playlist | null;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  progress: number;
  duration: number;
  currentTime: number;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  seekTo: (time: number) => void;
  playNext: () => void;
  playPrevious: () => void;
  setCurrentSongIndex: (index: number) => void;
  audioState: AudioPlayerState;
}

const MusicPlayerContext = createContext<MusicPlayerContextType | null>(null);

export function useMusicPlayer() {
  const context = useContext(MusicPlayerContext);
  if (!context) {
    throw new Error('useMusicPlayer must be used within a MusicPlayerProvider');
  }
  return context;
}

interface MusicPlayerProviderProps {
  children: React.ReactNode;
  initialPlaylist?: Playlist;
  initialSongIndex?: number;
}

export function MusicPlayerProvider({
  children,
  initialPlaylist,
  initialSongIndex = 0,
}: MusicPlayerProviderProps) {
  const [currentSongIndex, setCurrentSongIndex] = useState(initialSongIndex);
  const [playlist, setPlaylist] = useState<Playlist | null>(initialPlaylist || null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(75);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioState, setAudioState] = useState<AudioPlayerState>({
    isLoading: false,
    error: null,
    isPlaying: false,
    progress: 0,
    currentTime: 0,
    duration: 0,
    volume: 0.75,
    isMuted: false
  });

  const currentSong = playlist?.songs?.[currentSongIndex] || null;

  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
    setVolume(prev => (isMuted ? 75 : 0));
  }, [isMuted]);

  const seekTo = useCallback((time: number) => {
    setCurrentTime(time);
    setProgress((time / duration) * 100);
  }, [duration]);

  const playNext = useCallback(() => {
    if (playlist?.songs) {
      setCurrentSongIndex(prev => 
        prev === playlist.songs.length - 1 ? 0 : prev + 1
      );
    }
  }, [playlist?.songs]);

  const playPrevious = useCallback(() => {
    if (playlist?.songs) {
      setCurrentSongIndex(prev => 
        prev === 0 ? playlist.songs.length - 1 : prev - 1
      );
    }
  }, [playlist?.songs]);

  useEffect(() => {
    if (initialPlaylist) {
      setPlaylist(initialPlaylist);
    }
  }, [initialPlaylist]);

  useEffect(() => {
    setCurrentSongIndex(initialSongIndex);
  }, [initialSongIndex]);

  const value = {
    currentSong,
    playlist,
    isPlaying,
    volume,
    isMuted,
    progress,
    duration,
    currentTime,
    togglePlay,
    setVolume,
    toggleMute,
    seekTo,
    playNext,
    playPrevious,
    setCurrentSongIndex,
    audioState
  };

  return (
    <MusicPlayerContext.Provider value={value}>
      {children}
    </MusicPlayerContext.Provider>
  );
}