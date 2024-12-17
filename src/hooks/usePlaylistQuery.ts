import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { playlistService } from '../services/api/playlistService';
import { toast } from 'sonner';
import type { IPlaylist, PlaylistCreateInput, PlaylistUpdateInput } from '../../../backend/src/types/playlist';

export const usePlaylistQuery = () => {
  const queryClient = useQueryClient();

  const playlists = useQuery({
    queryKey: ['playlists'],
    queryFn: playlistService.getAllPlaylists
  });

  const createPlaylist = useMutation({
    mutationFn: (data: PlaylistCreateInput) => playlistService.createPlaylist(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playlists'] });
      toast.success('Playlist created successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create playlist: ${error.message}`);
    }
  });

  const updatePlaylist = useMutation({
    mutationFn: ({ id, data }: { id: string; data: PlaylistUpdateInput }) => 
      playlistService.updatePlaylist(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playlists'] });
      toast.success('Playlist updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update playlist: ${error.message}`);
    }
  });

  const deletePlaylist = useMutation({
    mutationFn: playlistService.deletePlaylist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playlists'] });
      toast.success('Playlist deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete playlist: ${error.message}`);
    }
  });

  return {
    playlists,
    createPlaylist,
    updatePlaylist,
    deletePlaylist
  };
};