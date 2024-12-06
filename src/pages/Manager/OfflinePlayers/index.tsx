import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { OfflinePlayerCard } from "@/components/devices/offline-player/OfflinePlayerCard";
import { OfflinePlayerSettings } from "@/components/devices/offline-player/OfflinePlayerSettings";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { OfflinePlayer } from "@/types/offline-player";
import type { Device, DeviceCategory } from "@/pages/Manager/Devices/hooks/types";

export default function OfflinePlayersPage() {
  const [selectedPlayer, setSelectedPlayer] = useState<OfflinePlayer | null>(null);
  
  const { data: devices, isLoading } = useQuery({
    queryKey: ['offline-devices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('devices')
        .select('*, branches(*)');
      
      if (error) throw error;

      return (data || []).map((device: any): OfflinePlayer => {
        const systemInfo = typeof device.system_info === 'string' 
          ? JSON.parse(device.system_info) 
          : device.system_info || {};

        const category = validateDeviceCategory(device.category);

        return {
          id: device.id,
          name: device.name,
          branch_id: device.branch_id,
          category,
          status: device.status || 'offline',
          ip_address: device.ip_address,
          system_info: device.system_info,
          schedule: device.schedule,
          last_seen: device.last_seen,
          token: device.token,
          location: device.location,
          location_id: device.location_id,
          created_at: device.created_at,
          updated_at: device.updated_at,
          device_id: device.id,
          last_sync_at: device.last_seen || new Date().toISOString(),
          sync_status: device.status === 'online' ? 'completed' : 'pending',
          version: systemInfo?.version || 'Unknown',
          settings: {
            autoSync: true,
            syncInterval: 30,
            maxStorageSize: 1000,
            ...(systemInfo?.settings || {})
          },
          devices: device.branches ? {
            id: device.id,
            name: device.name,
            branch_id: device.branch_id || '',
            status: device.status || 'offline'
          } : undefined
        };
      });
    }
  });

  const validateDeviceCategory = (category: string): DeviceCategory => {
    const validCategories: DeviceCategory[] = ['player', 'display', 'controller'];
    return validCategories.includes(category as DeviceCategory) 
      ? (category as DeviceCategory) 
      : 'player';
  };

  const handleSync = async (playerId: string) => {
    toast.info("Syncing player...");
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const wsUrl = `${supabaseUrl.replace('https://', 'wss://')}/functions/v1/sync-playlist`;
      
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        ws.send(JSON.stringify({
          type: 'sync_device',
          payload: { deviceId: playerId }
        }));
      };

      ws.onmessage = (event) => {
        const response = JSON.parse(event.data);
        if (response.type === 'sync_complete') {
          toast.success("Sync completed successfully");
        } else if (response.type === 'sync_error') {
          toast.error(`Sync failed: ${response.error}`);
        }
      };

      ws.onerror = () => {
        toast.error("Failed to establish connection");
      };
    } catch (error) {
      console.error('Sync error:', error);
      toast.error("Failed to sync player");
    }
  };

  const handleSettingsOpen = (player: OfflinePlayer) => {
    setSelectedPlayer(player);
  };

  const handleSettingsSave = async (settings: any) => {
    if (!selectedPlayer) return;
    
    try {
      const { error } = await supabase
        .from('devices')
        .update({
          system_info: {
            ...selectedPlayer.system_info,
            settings
          }
        })
        .eq('id', selectedPlayer.id);
        
      if (error) throw error;
      
      toast.success("Settings updated successfully");
      setSelectedPlayer(null);
    } catch (error) {
      console.error('Settings update error:', error);
      toast.error("Failed to update settings");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Offline Players</h1>
        <Button variant="outline">Register New Player</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {devices?.map((player) => (
          <OfflinePlayerCard
            key={player.id}
            player={player}
            onSync={handleSync}
            onSettings={handleSettingsOpen}
          />
        ))}
      </div>

      {selectedPlayer && (
        <OfflinePlayerSettings
          open={!!selectedPlayer}
          onOpenChange={() => setSelectedPlayer(null)}
          player={selectedPlayer}
          onSave={handleSettingsSave}
        />
      )}
    </div>
  );
}