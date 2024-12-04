import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import type { Device, DeviceCategory } from "@/pages/Manager/Devices/hooks/types";

interface PushPlaylistDialogProps {
  isOpen: boolean;
  onClose: () => void;
  playlistTitle: string;
}

export function PushPlaylistDialog({ isOpen, onClose, playlistTitle }: PushPlaylistDialogProps) {
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("devices");

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
        status: device.status as Device['status']
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
      return data || [];
    },
  });

  const validateDeviceCategory = (category: string): DeviceCategory => {
    const validCategories: DeviceCategory[] = ['player', 'display', 'controller'];
    return validCategories.includes(category as DeviceCategory) 
      ? (category as DeviceCategory) 
      : 'player';
  };

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

  const handleSelectGroup = (group: any) => {
    const deviceIds = group.branch_group_assignments?.flatMap(
      (assignment: any) => assignment.branches?.devices?.map((d: any) => d.id) || []
    ) || [];
    
    const allSelected = deviceIds.length > 0 && deviceIds.every(id => selectedDevices.includes(id));
    
    if (allSelected) {
      setSelectedDevices(prev => prev.filter(id => !deviceIds.includes(id)));
    } else {
      setSelectedDevices(prev => [...new Set([...prev, ...deviceIds])]);
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
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Push Playlist</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>×</Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="devices">Cihazlar</TabsTrigger>
            <TabsTrigger value="groups">Gruplar</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Cihaz ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            {activeTab === "devices" && (
              <Button 
                variant="outline" 
                onClick={handleSelectAll}
                className="whitespace-nowrap"
              >
                {selectedDevices.length === filteredDevices.length ? "Seçimi Kaldır" : "Tümünü Seç"}
              </Button>
            )}
          </div>

          <ScrollArea className="h-[400px] rounded-md border p-4">
            {activeTab === "devices" ? (
              <div className="space-y-2">
                {isLoadingDevices ? (
                  <div className="text-center py-4 text-gray-500">Cihazlar yükleniyor...</div>
                ) : filteredDevices.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">Cihaz bulunamadı</div>
                ) : (
                  filteredDevices.map((device) => (
                    <div
                      key={device.id}
                      className="flex items-start space-x-3 p-4 rounded-lg border hover:bg-accent/50 cursor-pointer"
                      onClick={() => {
                        setSelectedDevices(prev => 
                          prev.includes(device.id) 
                            ? prev.filter(id => id !== device.id)
                            : [...prev, device.id]
                        );
                      }}
                    >
                      <Checkbox
                        checked={selectedDevices.includes(device.id)}
                        onCheckedChange={() => {
                          setSelectedDevices(prev => 
                            prev.includes(device.id) 
                              ? prev.filter(id => id !== device.id)
                              : [...prev, device.id]
                          );
                        }}
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{device.name}</p>
                          <span className={`text-sm ${device.status === 'online' ? 'text-green-500' : 'text-gray-400'}`}>
                            {device.status === 'online' ? 'Çevrimiçi' : 'Çevrimdışı'}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <span>{device.category}</span>
                          {device.last_seen && (
                            <>
                              <span className="mx-2">•</span>
                              <span>Son görülme: yaklaşık 1 saat önce</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="space-y-2">
                {isLoadingGroups ? (
                  <div className="text-center py-4 text-gray-500">Gruplar yükleniyor...</div>
                ) : filteredGroups.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">Grup bulunamadı</div>
                ) : (
                  filteredGroups.map((group) => {
                    const deviceIds = group.branch_group_assignments?.flatMap(
                      (assignment: any) => assignment.branches?.devices?.map((d: any) => d.id) || []
                    ) || [];
                    const allSelected = deviceIds.length > 0 && deviceIds.every(id => selectedDevices.includes(id));
                    const someSelected = deviceIds.some(id => selectedDevices.includes(id));

                    return (
                      <div
                        key={group.id}
                        className="flex items-start space-x-3 p-4 rounded-lg border hover:bg-accent/50 cursor-pointer"
                        onClick={() => handleSelectGroup(group)}
                      >
                        <Checkbox
                          checked={allSelected}
                          className={someSelected && !allSelected ? "opacity-50" : ""}
                          onCheckedChange={() => handleSelectGroup(group)}
                        />
                        <div>
                          <p className="font-medium">{group.name}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            {deviceIds.length} cihaz
                          </p>
                          {group.description && (
                            <p className="text-sm text-gray-500 mt-1">{group.description}</p>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </ScrollArea>

          <div className="flex items-center justify-between pt-4 border-t">
            <p className="text-sm text-gray-500">
              {selectedDevices.length} cihaz seçildi
            </p>
            <div className="space-x-2">
              <Button variant="outline" onClick={onClose}>
                İptal
              </Button>
              <Button onClick={handlePush} disabled={selectedDevices.length === 0}>
                Cihazlara Gönder
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}