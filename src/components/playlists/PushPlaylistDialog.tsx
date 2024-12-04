import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DeviceList } from "./push-dialog/DeviceList";
import { DeviceGroups } from "./push-dialog/DeviceGroups";

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

  const { data: devices, isLoading: isLoadingDevices } = useQuery({
    queryKey: ['devices'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      const { data: profile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', user.id)
        .single();

      if (!profile?.company_id) throw new Error('No company associated with user');

      const { data, error } = await supabase
        .from('devices')
        .select('*')
        .eq('branches.company_id', profile.company_id);

      if (error) throw error;
      return data;
    }
  });

  const handleDeviceToggle = (deviceId: string) => {
    setSelectedDevices(prev => {
      if (prev.includes(deviceId)) {
        return prev.filter(id => id !== deviceId);
      }
      return [...prev, deviceId];
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (devices) {
      if (checked) {
        setSelectedDevices(devices.map(d => d.id));
      } else {
        setSelectedDevices([]);
      }
    }
  };

  const handlePush = async () => {
    if (selectedDevices.length === 0) {
      toast.error("Please select at least one device");
      return;
    }

    try {
      // Create offline playlist entries for each selected device
      const { error } = await supabase
        .from('offline_playlists')
        .insert(
          selectedDevices.map(deviceId => ({
            device_id: deviceId,
            playlist_id: playlistId,
            sync_status: 'pending'
          }))
        );

      if (error) throw error;

      toast.success(`Playlist "${playlistTitle}" pushed to ${selectedDevices.length} devices`);
      onClose();
      setSelectedDevices([]);
    } catch (error) {
      console.error('Error pushing playlist:', error);
      toast.error("Failed to push playlist");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Push Playlist to Devices</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="devices">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="devices">Devices</TabsTrigger>
            <TabsTrigger value="groups">Groups</TabsTrigger>
          </TabsList>

          <TabsContent value="devices">
            <DeviceList
              devices={devices || []}
              selectedDevices={selectedDevices}
              onDeviceToggle={handleDeviceToggle}
              onSelectAll={handleSelectAll}
              isLoading={isLoadingDevices}
            />
          </TabsContent>

          <TabsContent value="groups">
            <DeviceGroups
              selectedDevices={selectedDevices}
              onDeviceToggle={handleDeviceToggle}
            />
          </TabsContent>
        </Tabs>

        <div className="flex justify-between items-center mt-4">
          <p className="text-sm text-gray-500">
            {selectedDevices.length} devices selected
          </p>
          <div className="space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handlePush}>
              Push to Devices
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}