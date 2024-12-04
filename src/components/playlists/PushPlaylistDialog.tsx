import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PushPlaylistHeader } from "./push-dialog/PushPlaylistHeader";
import { SearchBar } from "./push-dialog/SearchBar";
import { DeviceItem } from "./push-dialog/DeviceItem";
import { DialogFooter } from "./push-dialog/DialogFooter";
import type { Device, DeviceCategory } from "@/pages/Manager/Devices/hooks/types";

interface PushPlaylistDialogProps {
  isOpen: boolean;
  onClose: () => void;
  playlistTitle: string;
}

export function PushPlaylistDialog({ isOpen, onClose, playlistTitle }: PushPlaylistDialogProps) {
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: devices = [], isLoading } = useQuery({
    queryKey: ['devices'],
    queryFn: async () => {
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (!userProfile?.company_id) return [];

      const { data, error } = await supabase
        .from('devices')
        .select(`
          *,
          branches (
            id,
            name
          )
        `)
        .eq('branches.company_id', userProfile.company_id);

      if (error) throw error;

      // Validate and transform the category field to ensure it matches DeviceCategory
      return data.map(device => ({
        ...device,
        category: validateDeviceCategory(device.category),
        status: device.status as Device['status']
      })) as Device[];
    },
  });

  // Helper function to validate device category
  const validateDeviceCategory = (category: string): DeviceCategory => {
    const validCategories: DeviceCategory[] = ['player', 'display', 'controller'];
    return validCategories.includes(category as DeviceCategory) 
      ? (category as DeviceCategory) 
      : 'player'; // Default to 'player' if invalid category
  };

  const filteredDevices = devices.filter(device =>
    device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    device.branches?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectAll = () => {
    if (selectedDevices.length === filteredDevices.length) {
      setSelectedDevices([]);
    } else {
      setSelectedDevices(filteredDevices.map(d => d.id));
    }
  };

  const handleToggleDevice = (deviceId: string) => {
    setSelectedDevices(prev => 
      prev.includes(deviceId) 
        ? prev.filter(id => id !== deviceId)
        : [...prev, deviceId]
    );
  };

  const handlePush = async () => {
    if (selectedDevices.length === 0) {
      toast.error("Lütfen en az bir cihaz seçin");
      return;
    }

    try {
      // Implement playlist push logic here
      toast.success(`"${playlistTitle}" playlist'i ${selectedDevices.length} cihaza gönderildi`);
      onClose();
      setSelectedDevices([]);
    } catch (error) {
      toast.error("Playlist gönderilirken bir hata oluştu");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <PushPlaylistHeader onClose={onClose} />

        <div className="mt-6">
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSelectAll={handleSelectAll}
            selectedCount={selectedDevices.length}
            totalCount={filteredDevices.length}
          />

          <ScrollArea className="h-[400px] rounded-md">
            <div className="space-y-2">
              {isLoading ? (
                <div className="text-center py-4 text-gray-500">Cihazlar yükleniyor...</div>
              ) : filteredDevices.length === 0 ? (
                <div className="text-center py-4 text-gray-500">Cihaz bulunamadı</div>
              ) : (
                filteredDevices.map((device) => (
                  <DeviceItem
                    key={device.id}
                    device={device}
                    isSelected={selectedDevices.includes(device.id)}
                    onToggle={handleToggleDevice}
                  />
                ))
              )}
            </div>
          </ScrollArea>

          <DialogFooter
            selectedCount={selectedDevices.length}
            onCancel={onClose}
            onPush={handlePush}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}