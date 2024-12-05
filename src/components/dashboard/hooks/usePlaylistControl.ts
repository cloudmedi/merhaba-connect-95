import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

  const handlePlayPlaylist = async (playlist: any) => {
    try {
      // If clicking the currently playing playlist, only toggle play state
      if (currentPlaylist?.id === playlist.id) {
        console.log('Toggling play state for current playlist', { isPlaying });
        setIsPlaying(!isPlaying);
        return;
      }

      // If songs are already included in the playlist object, use them
      if (playlist.songs && playlist.songs.length > 0) {
        console.log('Using existing songs from playlist');
        setCurrentPlaylist({
          id: playlist.id,
          title: playlist.title,
          artwork_url: playlist.artwork_url,
          songs: playlist.songs
        });
        setIsPlaying(true);
        return;
      }

      // Otherwise, fetch songs for the selected playlist
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

      const formattedPlaylist = {
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

      console.log('Setting new playlist:', formattedPlaylist);
      setCurrentPlaylist(formattedPlaylist);
      setIsPlaying(true);
    } catch (error) {
      console.error('Error handling playlist:', error);
      toast.error("Failed to load playlist");
    }
  };

  const handlePlayStateChange = (playing: boolean) => {
    console.log('Play state changed:', playing);
    setIsPlaying(playing);
  };

  const handleClose = () => {
    setCurrentPlaylist(null);
    setIsPlaying(false);
  };

  return {
    currentPlaylist,
    isPlaying,
    handlePlayPlaylist,
    handlePlayStateChange,
    handleClose
  };
}
