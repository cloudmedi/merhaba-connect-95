import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { OfflinePlayerCard } from "@/components/devices/offline-player/OfflinePlayerCard";
import { OfflinePlayerSettings } from "@/components/devices/offline-player/OfflinePlayerSettings";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { OfflinePlayer } from "@/types/offline-player";

export default function OfflinePlayersPage() {
  const [selectedPlayer, setSelectedPlayer] = useState<OfflinePlayer | null>(null);
  const { data: devices, isLoading } = useQuery({
    queryKey: ['offline-devices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('devices')
        .select('*')
        .eq('category', 'offline_player');
      
      if (error) throw error;
      return data;
    }
  });

  const handleSync = async (playerId: string) => {
    toast.info("Syncing player...");
    try {
      const result = await window.electronAPI.syncPlaylist({
        deviceId: playerId
      });
      
      if (result.success) {
        toast.success("Sync completed successfully");
      } else {
        toast.error("Sync failed");
      }
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
        .update(settings)
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

      <OfflinePlayerSettings
        open={!!selectedPlayer}
        onOpenChange={() => setSelectedPlayer(null)}
        player={selectedPlayer!}
        onSave={handleSettingsSave}
      />
    </div>
  );
}