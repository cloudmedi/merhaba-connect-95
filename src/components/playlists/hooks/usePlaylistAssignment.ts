import { useState } from 'react';
import axios from '@/lib/axios';
import { toast } from 'sonner';

export function usePlaylistAssignment(playlistId: string) {
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);

  const handleAssignManagers = async (managerIds: string[], scheduledAt?: Date, expiresAt?: Date) => {
    try {
      if (!playlistId) {
        toast.error("Please save the playlist first before assigning to managers");
        return;
      }

      await axios.post(`/admin/playlists/${playlistId}/assign-managers`, {
        managerIds,
        scheduledAt: scheduledAt?.toISOString(),
        expiresAt: expiresAt?.toISOString()
      });

      toast.success(`Playlist assigned to ${managerIds.length} managers`);
      setIsAssignDialogOpen(false);
    } catch (error: any) {
      console.error('Error assigning playlist:', error);
      toast.error(error.message || "Failed to assign playlist");
    }
  };

  return {
    isAssignDialogOpen,
    setIsAssignDialogOpen,
    handleAssignManagers
  };
}