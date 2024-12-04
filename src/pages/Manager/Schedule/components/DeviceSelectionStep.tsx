import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Monitor, FolderOpen } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface DeviceSelectionStepProps {
  selectedDevices: string[];
  onDevicesChange: (devices: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export function DeviceSelectionStep({ 
  selectedDevices, 
  onDevicesChange,
  onNext,
  onBack 
}: DeviceSelectionStepProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("devices");

  const { data: devices = [], isLoading: isLoadingDevices } = useQuery({
    queryKey: ['devices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('devices')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data;
    }
  });

  const { data: groups = [], isLoading: isLoadingGroups } = useQuery({
    queryKey: ['branch-groups'],
    queryFn: async () => {
      const { data: groupsData, error: groupsError } = await supabase
        .from('branch_groups')
        .select(`
          id,
          name,
          description,
          branch_group_assignments (
            branch_id
          )
        `);
      
      if (groupsError) throw groupsError;

      // Şimdi her grup için cihazları alalım
      const groupsWithDevices = await Promise.all(groupsData.map(async (group) => {
        const branchIds = group.branch_group_assignments.map((a: any) => a.branch_id);
        
        const { data: devices, error: devicesError } = await supabase
          .from('devices')
          .select('id, name, status')
          .in('branch_id', branchIds);
        
        if (devicesError) throw devicesError;
        
        return {
          ...group,
          devices: devices || []
        };
      }));

      return groupsWithDevices;
    }
  });

  const filteredDevices = devices.filter(device => 
    device.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectAll = () => {
    if (activeTab === "devices") {
      if (selectedDevices.length === filteredDevices.length) {
        onDevicesChange([]);
      } else {
        onDevicesChange(filteredDevices.map(device => device.id));
      }
    }
  };

  const toggleDevice = (deviceId: string) => {
    if (selectedDevices.includes(deviceId)) {
      onDevicesChange(selectedDevices.filter(id => id !== deviceId));
    } else {
      onDevicesChange([...selectedDevices, deviceId]);
    }
  };

  const handleSelectGroup = (group: any) => {
    const deviceIds = group.devices.map((device: any) => device.id);
    const allSelected = deviceIds.every(id => selectedDevices.includes(id));
    
    if (allSelected) {
      onDevicesChange(selectedDevices.filter(id => !deviceIds.includes(id)));
    } else {
      const newSelection = [...new Set([...selectedDevices, ...deviceIds])];
      onDevicesChange(newSelection);
    }
  };

  if (isLoadingDevices || isLoadingGroups) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-[300px] w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Ara..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {activeTab === "devices" && (
          <Button 
            variant="link" 
            onClick={handleSelectAll}
            className="ml-4"
          >
            {selectedDevices.length === filteredDevices.length ? "Seçimi Kaldır" : "Tümünü Seç"}
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="devices">Cihazlar</TabsTrigger>
          <TabsTrigger value="groups">Gruplar</TabsTrigger>
        </TabsList>

        <TabsContent value="devices">
          <ScrollArea className="h-[300px]">
            <div className="grid grid-cols-2 gap-3">
              {filteredDevices.map((device) => (
                <div
                  key={device.id}
                  className="flex items-start space-x-3 p-4 rounded-lg border hover:bg-accent cursor-pointer"
                  onClick={() => toggleDevice(device.id)}
                >
                  <Checkbox
                    checked={selectedDevices.includes(device.id)}
                    onCheckedChange={() => toggleDevice(device.id)}
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <Monitor className="w-4 h-4 text-gray-500" />
                      <h4 className="text-sm font-medium">{device.name}</h4>
                    </div>
                    <p className="text-sm text-gray-500">
                      {device.status === 'online' ? 
                        <span className="text-green-600">● Online</span> : 
                        <span className="text-gray-400">● Offline</span>
                      }
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="groups">
          <ScrollArea className="h-[300px]">
            <div className="space-y-3">
              {filteredGroups.map((group) => {
                const deviceIds = group.devices.map((device: any) => device.id);
                const allSelected = deviceIds.every(id => selectedDevices.includes(id));
                const someSelected = deviceIds.some(id => selectedDevices.includes(id));

                return (
                  <div
                    key={group.id}
                    className="flex items-start space-x-3 p-4 rounded-lg border hover:bg-accent cursor-pointer"
                    onClick={() => handleSelectGroup(group)}
                  >
                    <Checkbox
                      checked={allSelected}
                      className={someSelected && !allSelected ? "opacity-50" : ""}
                      onCheckedChange={() => handleSelectGroup(group)}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <FolderOpen className="w-4 h-4 text-gray-500" />
                        <h4 className="text-sm font-medium">{group.name}</h4>
                      </div>
                      <p className="text-sm text-gray-500">
                        {group.devices.length} cihaz
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Geri
        </Button>
        <Button 
          onClick={onNext}
          disabled={selectedDevices.length === 0}
          className="bg-[#6E59A5] hover:bg-[#5a478a] text-white"
        >
          İleri
        </Button>
      </div>
    </div>
  );
}