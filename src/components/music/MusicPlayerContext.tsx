import React, { createContext, useContext, useCallback, useMemo } from 'react';
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
  // ... Burada mevcut MusicPlayer'dan state yönetimini taşıyacağız
  
  const value = useMemo(() => ({
    currentSong: null,
    playlist: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    isMuted: false,
    togglePlay: () => {},
    nextTrack: () => {},
    previousTrack: () => {},
    seekTo: () => {},
    setVolume: () => {},
    toggleMute: () => {},
  }), []);

  return (
    <MusicPlayerContext.Provider value={value}>
      {children}
    </MusicPlayerContext.Provider>
  );
}