import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, X } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";

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
      return data;
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
              devices (*)
            )
          )
        `)
        .eq('company_id', userProfile.company_id);

      if (error) throw error;
      return data;
    },
  });

  const filteredDevices = devices.filter(device =>
    device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    device.branches?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
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
    const groupDevices = group.branch_group_assignments
      .flatMap((assignment: any) => assignment.branches?.devices || [])
      .map((device: any) => device.id);

    const allSelected = groupDevices.every(id => selectedDevices.includes(id));

    if (allSelected) {
      setSelectedDevices(prev => prev.filter(id => !groupDevices.includes(id)));
    } else {
      setSelectedDevices(prev => [...new Set([...prev, ...groupDevices])]);
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
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-xl">Push Playlist</DialogTitle>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onClose}
            className="h-6 w-6 rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="devices">Cihazlar</TabsTrigger>
              <TabsTrigger value="groups">Gruplar</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder={activeTab === "devices" ? "Cihaz ara..." : "Grup ara..."}
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
              isLoadingDevices ? (
                <div className="text-center py-4 text-gray-500">Cihazlar yükleniyor...</div>
              ) : filteredDevices.length === 0 ? (
                <div className="text-center py-4 text-gray-500">Cihaz bulunamadı</div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {filteredDevices.map((device) => (
                    <div
                      key={device.id}
                      className="flex items-start space-x-3 p-4 rounded-lg border hover:bg-accent cursor-pointer"
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
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-sm">{device.name}</p>
                          <Badge 
                            variant={device.status === 'online' ? 'success' : 'secondary'}
                            className="ml-2"
                          >
                            {device.status === 'online' ? 'Çevrimiçi' : 'Çevrimdışı'}
                          </Badge>
                        </div>
                        <div className="flex items-center text-xs text-gray-500 space-x-2">
                          {device.branches?.name && (
                            <>
                              <span>{device.branches.name}</span>
                              <span>•</span>
                            </>
                          )}
                          <span>{device.category}</span>
                          {device.last_seen && (
                            <>
                              <span>•</span>
                              <span>
                                Son görülme: {formatDistanceToNow(new Date(device.last_seen), { addSuffix: true, locale: tr })}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              isLoadingGroups ? (
                <div className="text-center py-4 text-gray-500">Gruplar yükleniyor...</div>
              ) : filteredGroups.length === 0 ? (
                <div className="text-center py-4 text-gray-500">Grup bulunamadı</div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {filteredGroups.map((group) => {
                    const groupDevices = group.branch_group_assignments
                      .flatMap((assignment: any) => assignment.branches?.devices || []);
                    const deviceIds = groupDevices.map((d: any) => d.id);
                    const isFullySelected = deviceIds.length > 0 && deviceIds.every(id => selectedDevices.includes(id));
                    const isPartiallySelected = deviceIds.some(id => selectedDevices.includes(id));

                    return (
                      <div
                        key={group.id}
                        className="flex items-start space-x-3 p-4 rounded-lg border hover:bg-accent cursor-pointer"
                        onClick={() => handleSelectGroup(group)}
                      >
                        <Checkbox
                          checked={isFullySelected}
                          className={isPartiallySelected && !isFullySelected ? "opacity-50" : ""}
                          onCheckedChange={() => handleSelectGroup(group)}
                        />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{group.name}</p>
                          <p className="text-xs text-gray-500">{deviceIds.length} cihaz</p>
                          {group.description && (
                            <p className="text-sm text-gray-500 mt-1">{group.description}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            )}
          </ScrollArea>

          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              {selectedDevices.length} cihaz seçildi
            </p>
            <div className="space-x-2">
              <Button variant="outline" onClick={onClose}>
                İptal
              </Button>
              <Button 
                onClick={handlePush}
                disabled={selectedDevices.length === 0}
                className="bg-[#1A1F2C] text-white hover:bg-[#2A2F3C]"
              >
                Cihazlara Gönder
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}