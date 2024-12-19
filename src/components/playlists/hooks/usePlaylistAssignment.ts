import { useState } from 'react';
import axios from '@/lib/axios';
import { toast } from 'sonner';
import { Manager } from '../types';

export function usePlaylistAssignment(playlistId: string) {
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);

  const handleAssignManagers = async (managers: Manager[], scheduledAt?: Date, expiresAt?: Date) => {
    try {
      if (!playlistId) {
        toast.error("Playlist ID bulunamadı");
        return;
      }

      console.log('Assigning managers:', {
        playlistId,
        managers,
        scheduledAt,
        expiresAt
      });

      const managerIds = managers.map(manager => manager._id);

      const response = await axios.post(`/admin/playlists/${playlistId}/assign-managers`, {
        managerIds,
        scheduledAt: scheduledAt?.toISOString(),
        expiresAt: expiresAt?.toISOString()
      });

      console.log('Assignment response:', response.data);

      if (response.data) {
        toast.success(`${managers.length} yönetici başarıyla atandı`);
        setIsAssignDialogOpen(false);
      }
    } catch (error: any) {
      console.error('Manager assignment error:', error);
      toast.error(error.response?.data?.error || "Yönetici atama işlemi başarısız oldu");
    }
  };

  return {
    isAssignDialogOpen,
    setIsAssignDialogOpen,
    handleAssignManagers
  };
}