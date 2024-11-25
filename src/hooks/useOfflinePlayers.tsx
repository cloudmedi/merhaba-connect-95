import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { OfflinePlayer, SyncHistory } from "@/types/offline-player";
import { toast } from "sonner";

export function useOfflinePlayers() {
  const queryClient = useQueryClient();

  const { data: offlinePlayers, isLoading } = useQuery({
    queryKey: ['offline-players'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('offline_players')
        .select(`
          *,
          devices (
            id,
            name,
            branch_id,
            status
          )
        `);

      if (error) throw error;
      return data as OfflinePlayer[];
    }
  });

  const { data: syncHistory } = useQuery({
    queryKey: ['sync-history'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('offline_sync_history')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return data as SyncHistory[];
    }
  });

  const registerPlayer = useMutation({
    mutationFn: async (deviceId: string) => {
      const { data, error } = await supabase
        .from('offline_players')
        .insert([
          {
            device_id: deviceId,
            sync_status: 'pending',
            settings: {
              autoSync: true,
              syncInterval: 30,
              maxStorageSize: 1024 * 1024 * 1024 // 1GB default
            }
          }
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offline-players'] });
      toast.success('Device registered as offline player');
    },
    onError: (error) => {
      toast.error('Failed to register device: ' + error.message);
    }
  });

  const updatePlayerSettings = useMutation({
    mutationFn: async ({ playerId, settings }: { playerId: string; settings: any }) => {
      const { data, error } = await supabase
        .from('offline_players')
        .update({ settings })
        .eq('id', playerId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['offline-players'] });
      toast.success('Player settings updated');
    },
    onError: (error) => {
      toast.error('Failed to update settings: ' + error.message);
    }
  });

  return {
    offlinePlayers,
    syncHistory,
    isLoading,
    registerPlayer,
    updatePlayerSettings
  };
}