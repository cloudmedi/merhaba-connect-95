import React from 'react';
import { Button } from "@/components/ui/button";
import type { Device } from "../hooks/types";
import { useOfflinePlayers } from "@/hooks/useOfflinePlayers";
import { toast } from "sonner";

export function DeviceListItem({ device }: { device: Device }) {
  const { registerPlayer } = useOfflinePlayers();

  const handleRegisterOfflinePlayer = async () => {
    try {
      await registerPlayer.mutateAsync(device.id);
      toast.success('Device registered as offline player');
    } catch (error) {
      toast.error('Failed to register device as offline player');
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg border border-gray-200">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">{device.name}</h3>
          <p className="text-sm text-gray-500 mt-1">{device.id}</p>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Status:</span>
            <span className="text-sm">{device.status}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Last Seen:</span>
            <span className="text-sm">{device.last_seen || 'Never'}</span>
          </div>
        </div>

        <Button 
          variant="outline" 
          className="w-full"
          onClick={handleRegisterOfflinePlayer}
        >
          Register as Offline Player
        </Button>
      </div>
    </div>
  );
}