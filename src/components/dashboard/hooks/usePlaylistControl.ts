import { useState, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AudioController } from '@/components/music/AudioController';

export interface PlaylistWithSongs {
  id: string;
  title: string;
  artwork_url: string;
  songs: Array<{
    id: string;
    title: string;
    artist: string;
    duration: string;
    file_url: string;
    bunny_id?: string;
  }>;
}

export function usePlaylistControl() {
  const [currentPlaylist, setCurrentPlaylist] = useState<PlaylistWithSongs | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioController] = useState(() => new AudioController());

  const handlePlayPlaylist = useCallback(async (playlist: any) => {
    try {
      console.log('handlePlayPlaylist called with:', {
        newPlaylistId: playlist.id,
        currentPlaylistId: currentPlaylist?.id,
        currentIsPlaying: isPlaying
      });

      // If clicking the currently playing playlist, toggle play/pause
      if (currentPlaylist?.id === playlist.id) {
        console.log('Toggling play state for current playlist');
        if (isPlaying) {
          audioController.pause();
          setIsPlaying(false);
        } else {
          const success = await audioController.play();
          setIsPlaying(success);
        }
        return;
      }

      // Stop current playback
      audioController.pause();
      setIsPlaying(false);
      
      let playlistToSet: PlaylistWithSongs;

      if (playlist.songs && playlist.songs.length > 0) {
        console.log('Using existing songs from playlist');
        playlistToSet = {
          id: playlist.id,
          title: playlist.title,
          artwork_url: playlist.artwork_url,
          songs: playlist.songs
        };
      } else {
        console.log('Fetching songs for playlist:', playlist.id);
        const { data: playlistSongs, error } = await supabase
          .from('playlist_songs')
          .select(`
            position,
            songs (
              id,
              title,
              artist,
              duration,
              file_url,
              bunny_id
            )
          `)
          .eq('playlist_id', playlist.id)
          .order('position');

        if (error) throw error;

        if (!playlistSongs || playlistSongs.length === 0) {
          toast.error("No songs found in this playlist");
          return;
        }

        playlistToSet = {
          id: playlist.id,
          title: playlist.title,
          artwork_url: playlist.artwork_url,
          songs: playlistSongs.map(ps => ({
            id: ps.songs.id,
            title: ps.songs.title,
            artist: ps.songs.artist || "Unknown Artist",
            duration: ps.songs.duration?.toString() || "0:00",
            file_url: ps.songs.file_url,
            bunny_id: ps.songs.bunny_id
          }))
        };
      }

      console.log('Setting new playlist and starting playback');
      setCurrentPlaylist(playlistToSet);

      // Set the audio source for the first song
      if (playlistToSet.songs[0]) {
        const songUrl = getAudioUrl(playlistToSet.songs[0]);
        audioController.setSource(songUrl);
        const success = await audioController.play();
        setIsPlaying(success);
      }
      
    } catch (error) {
      console.error('Error handling playlist:', error);
      toast.error("Failed to load playlist");
    }
  }, [currentPlaylist, isPlaying, audioController]);

  const handlePlayStateChange = useCallback((playing: boolean) => {
    console.log('Play state changed:', { newState: playing, currentState: isPlaying });
    if (playing) {
      audioController.play().then(success => setIsPlaying(success));
    } else {
      audioController.pause();
      setIsPlaying(false);
    }
  }, [audioController]);

  const handleClose = useCallback(() => {
    console.log('Closing player');
    audioController.cleanup();
    setCurrentPlaylist(null);
    setIsPlaying(false);
  }, [audioController]);

  const getAudioUrl = (song: any) => {
    if (!song.file_url) return '';
    if (song.file_url.startsWith('http')) return song.file_url;
    if (song.bunny_id) return `https://cloud-media.b-cdn.net/${song.bunny_id}`;
    return `https://cloud-media.b-cdn.net/${song.file_url}`;
  };

  return {
    currentPlaylist,
    isPlaying,
    handlePlayPlaylist,
    handlePlayStateChange,
    handleClose
  };
}