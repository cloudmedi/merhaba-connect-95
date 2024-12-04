import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface PlaylistWithSongs {
  id: string;
  title: string;
  artwork: string;
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
        setIsPlaying(!isPlaying);
        return;
      }

      // Fetch songs for the selected playlist
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
        title: playlist.name,
        artwork: playlist.artwork_url,
        songs: playlistSongs.map(ps => ({
          id: ps.songs.id,
          title: ps.songs.title,
          artist: ps.songs.artist || "Unknown Artist",
          duration: ps.songs.duration?.toString() || "0:00",
          file_url: ps.songs.file_url,
          bunny_id: ps.songs.bunny_id
        }))
      };

      setCurrentPlaylist(formattedPlaylist);
      setIsPlaying(true);
    } catch (error) {
      console.error('Error fetching playlist songs:', error);
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