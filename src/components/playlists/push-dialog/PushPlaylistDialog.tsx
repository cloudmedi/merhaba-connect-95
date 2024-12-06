import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface PushPlaylistDialogProps {
  isOpen: boolean;
  onClose: () => void;
  playlistTitle: string;
  playlistId: string;
}

export function PushPlaylistDialog({ 
  isOpen, 
  onClose, 
  playlistTitle, 
  playlistId 
}: PushPlaylistDialogProps) {
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  const handlePush = async () => {
    if (selectedDevices.length === 0) {
      toast.error("Please select at least one device");
      return;
    }

    try {
      setIsSyncing(true);
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const wsUrl = `${supabaseUrl.replace('https://', 'wss://')}/functions/v1/sync-playlist`;
      
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log('WebSocket connection established');
        ws.send(JSON.stringify({
          type: 'sync_playlist',
          payload: {
            playlistId,
            deviceIds: selectedDevices
          }
        }));
      };

      ws.onmessage = (event) => {
        const response = JSON.parse(event.data);
        if (response.type === 'sync_complete') {
          toast.success(`Playlist "${playlistTitle}" synced successfully`);
          onClose();
        } else if (response.type === 'sync_error') {
          toast.error(`Error syncing playlist: ${response.error}`);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        toast.error('Failed to establish connection');
      };

      ws.onclose = () => {
        console.log('WebSocket connection closed');
        setIsSyncing(false);
      };
    } catch (error) {
      console.error('Error pushing playlist:', error);
      toast.error("Failed to sync playlist");
      setIsSyncing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Push Playlist</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              {selectedDevices.length} devices selected
            </p>
            <div className="space-x-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handlePush} disabled={isSyncing}>
                {isSyncing ? "Syncing..." : "Push to Devices"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}