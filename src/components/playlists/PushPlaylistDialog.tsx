import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Device, DeviceSystemInfo } from "@/pages/Manager/Devices/hooks/types";
import { DialogHeader } from "./push-dialog/DialogHeader";
import { SearchBar } from "./push-dialog/SearchBar";
import { DeviceList } from "./push-dialog/DeviceList";
import { GroupList } from "./push-dialog/GroupList";
import { DialogFooter } from "./push-dialog/DialogFooter";
import type { Group } from "./push-dialog/types";

interface PushPlaylistDialogProps {
  isOpen: boolean;
  onClose: () => void;
  playlistTitle: string;
}

export function PushPlaylistDialog({ isOpen, onClose, playlistTitle }: PushPlaylistDialogProps) {
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("devices");

  const validateDeviceCategory = (category: string): Device['category'] => {
    const validCategories = ['player', 'display', 'controller'] as const;
    return validCategories.includes(category as Device['category']) 
      ? category as Device['category']
      : 'player';
  };

  const validateDeviceStatus = (status: string): Device['status'] => {
    return status === 'online' ? 'online' : 'offline';
  };

  const validateSystemInfo = (info: any): DeviceSystemInfo => {
    if (typeof info === 'string') {
      try {
        return JSON.parse(info);
      } catch {
        return {};
      }
    }
    return info || {};
  };

  // Fetch devices
  const { data: devices = [], isLoading: isLoadingDevices } = useQuery({
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

      return data.map(device => ({
        ...device,
        category: validateDeviceCategory(device.category),
        status: validateDeviceStatus(device.status),
        system_info: validateSystemInfo(device.system_info)
      })) as Device[];
    },
  });

  // Fetch groups
  const { data: groups = [], isLoading: isLoadingGroups } = useQuery({
    queryKey: ['branch-groups'],
    queryFn: async () => {
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      if (!userProfile?.company_id) return [];

      const { data, error } = await supabase
        .from('branch_groups')
        .select(`
          *,
          branch_group_assignments (
            branches (
              id,
              name,
              devices (
                id,
                name,
                status
              )
            )
          )
        `)
        .eq('company_id', userProfile.company_id);

      if (error) throw error;

      // Transform the data to match the Group type
      return (data || []).map(group => ({
        ...group,
        branch_group_assignments: group.branch_group_assignments?.map(assignment => ({
          branches: {
            ...assignment.branches,
            devices: assignment.branches?.devices?.map(device => ({
              ...device,
              status: validateDeviceStatus(device.status)
            }))
          }
        }))
      })) as Group[];
    },
  });

  const filteredDevices = devices.filter(device =>
    device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    device.branches?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (group.description || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectAll = () => {
    if (activeTab === "devices") {
      if (selectedDevices.length === filteredDevices.length) {
        setSelectedDevices([]);
      } else {
        setSelectedDevices(filteredDevices.map(d => d.id));
      }
    }
  };

  const handleToggleDevice = (deviceId: string) => {
    setSelectedDevices(prev =>
      prev.includes(deviceId)
        ? prev.filter(id => id !== deviceId)
        : [...prev, deviceId]
    );
  };

  const handleSelectGroup = (groupId: string, isSelected: boolean) => {
    const group = groups.find(g => g.id === groupId);
    if (!group) return;

    const deviceIds = group.branch_group_assignments?.flatMap(
      assignment => assignment.branches?.devices?.map(d => d.id) || []
    ) || [];

    if (isSelected) {
      setSelectedDevices(prev => [...new Set([...prev, ...deviceIds])]);
    } else {
      setSelectedDevices(prev => prev.filter(id => !deviceIds.includes(id)));
    }
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
        <DialogHeader onClose={onClose} />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="devices">Cihazlar</TabsTrigger>
            <TabsTrigger value="groups">Gruplar</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="space-y-4">
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSelectAll={activeTab === "devices" ? handleSelectAll : undefined}
            selectedCount={selectedDevices.length}
            totalCount={filteredDevices.length}
          />

          {activeTab === "devices" ? (
            <DeviceList
              devices={filteredDevices}
              selectedDevices={selectedDevices}
              onToggleDevice={handleToggleDevice}
            />
          ) : (
            <GroupList
              groups={filteredGroups}
              selectedDevices={selectedDevices}
              onSelectGroup={handleSelectGroup}
            />
          )}

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