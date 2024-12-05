import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Song, Playlist } from './types';

interface MusicPlayerContextType {
  currentSong: Song | null;
  playlist: Playlist | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  togglePlay: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  seekTo: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
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
  const [currentSong, setCurrentSong] = useState<Song | null>(
    initialPlaylist?.songs?.[initialSongIndex] || null
  );
  const [playlist, setPlaylist] = useState<Playlist | null>(initialPlaylist || null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const nextTrack = useCallback(() => {
    // Implementation
  }, []);

  const previousTrack = useCallback(() => {
    // Implementation
  }, []);

  const seekTo = useCallback((time: number) => {
    setCurrentTime(time);
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  const value = {
    currentSong,
    playlist,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    togglePlay,
    nextTrack,
    previousTrack,
    seekTo,
    setVolume,
    toggleMute,
  };

  return (
    <MusicPlayerContext.Provider value={value}>
      {children}
    </MusicPlayerContext.Provider>
  );
}