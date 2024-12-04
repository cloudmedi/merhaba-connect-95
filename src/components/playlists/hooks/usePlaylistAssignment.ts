import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function usePlaylistAssignment(playlistId: string) {
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);

  const handleAssignManagers = async (managerIds: string[], scheduledAt?: Date, expiresAt?: Date) => {
    try {
      if (!playlistId) {
        toast.error("Please save the playlist first before assigning to managers");
        return;
      }

      // Önce mevcut atamaları temizle
      const { error: deleteError } = await supabase
        .from('playlist_assignments')
        .delete()
        .eq('playlist_id', playlistId);

      if (deleteError) throw deleteError;

      // Yeni atamaları ekle
      const assignments = managerIds.map(userId => ({
        user_id: userId,
        playlist_id: playlistId,
        scheduled_at: scheduledAt?.toISOString() || new Date().toISOString(),
        expires_at: expiresAt?.toISOString() || null,
        notification_sent: false
      }));

      const { error: insertError } = await supabase
        .from('playlist_assignments')
        .insert(assignments);

      if (insertError) throw insertError;

      // Playlist'in assigned_to alanını güncelle
      const { error: updateError } = await supabase
        .from('playlists')
        .update({ assigned_to: managerIds })
        .eq('id', playlistId);

      if (updateError) throw updateError;

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