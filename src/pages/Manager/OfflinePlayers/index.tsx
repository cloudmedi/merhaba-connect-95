import { useState } from "react";
import { useOfflinePlayers } from "@/hooks/useOfflinePlayers";
import { OfflinePlayerCard } from "@/components/devices/offline-player/OfflinePlayerCard";
import { OfflinePlayerSettings } from "@/components/devices/offline-player/OfflinePlayerSettings";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { OfflinePlayer } from "@/types/offline-player";

export default function OfflinePlayersPage() {
  const [selectedPlayer, setSelectedPlayer] = useState<OfflinePlayer | null>(null);
  const { offlinePlayers, isLoading, updatePlayerSettings } = useOfflinePlayers();

  const handleSync = async (playerId: string) => {
    toast.info("Syncing player...");
    // Sync logic will be implemented later
  };

  const handleSettingsOpen = (player: OfflinePlayer) => {
    setSelectedPlayer(player);
  };

  const handleSettingsSave = async (settings: any) => {
    if (!selectedPlayer) return;
    
    try {
      await updatePlayerSettings.mutateAsync({
        playerId: selectedPlayer.id,
        settings
      });
      setSelectedPlayer(null);
    } catch (error) {
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
        {offlinePlayers?.map((player) => (
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