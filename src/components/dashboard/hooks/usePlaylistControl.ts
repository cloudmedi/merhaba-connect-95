import { useState } from "react";
import api from "@/lib/api";
import { toast } from "sonner";

export function usePlaylistControl() {
  const [currentPlaylist, setCurrentPlaylist] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayPlaylist = async (playlistId: string) => {
    try {
      const { data } = await api.get(`/playlists/${playlistId}`);
      setCurrentPlaylist(data);
      setIsPlaying(true);
    } catch (error) {
      console.error('Error fetching playlist:', error);
      toast.error('Failed to load playlist');
    }
  };

  const handlePlayStateChange = (playing: boolean) => {
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