import { useState } from "react";
import { Search, Monitor, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import type { Device } from "@/pages/Manager/Devices/hooks/types";

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

      const { data } = await supabase
        .from('devices')
        .select(`
          *,
          branches (
            id,
            name
          )
        `)
        .eq('branches.company_id', userProfile.company_id);

      return (data || []) as Device[];
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

      const { data } = await supabase
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

      return data || [];
    },
  });

  const filteredDevices = devices.filter(device =>
    device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (device.branches?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectAll = () => {
    if (activeTab === "devices") {
      if (selectedDevices.length === filteredDevices.length) {
        onDevicesChange([]);
      } else {
        onDevicesChange(filteredDevices.map(d => d.id));
      }
    }
  };

  const toggleDevice = (deviceId: string) => {
    onDevicesChange(
      selectedDevices.includes(deviceId)
        ? selectedDevices.filter(id => id !== deviceId)
        : [...selectedDevices, deviceId]
    );
  };

  const handleSelectGroup = (group: any) => {
    const deviceIds = group.branch_group_assignments?.flatMap(
      (assignment: any) => assignment.branches?.devices?.map((d: any) => d.id) || []
    ) || [];
    
    const allSelected = deviceIds.every(id => selectedDevices.includes(id));
    
    if (allSelected) {
      onDevicesChange(selectedDevices.filter(id => !deviceIds.includes(id)));
    } else {
      const newDevices = [...new Set([...selectedDevices, ...deviceIds])];
      onDevicesChange(newDevices);
    }
  };

  if (isLoadingDevices || isLoadingGroups) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Cihaz ve Grup Seçimi</h2>
        <p className="text-sm text-gray-500">
          {selectedDevices.length} cihaz seçildi
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="devices" className="flex items-center gap-2">
            <Monitor className="w-4 h-4" />
            Cihazlar
          </TabsTrigger>
          <TabsTrigger value="groups" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Gruplar
          </TabsTrigger>
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

      <ScrollArea className="h-[400px]">
        <div className="grid grid-cols-2 gap-4">
          {activeTab === "devices" ? (
            filteredDevices.map((device) => (
              <Card
                key={device.id}
                className={`p-4 cursor-pointer transition-colors hover:bg-accent ${
                  selectedDevices.includes(device.id) ? "border-primary" : ""
                }`}
                onClick={() => toggleDevice(device.id)}
              >
                <div className="flex items-start space-x-3">
                  <Checkbox
                    checked={selectedDevices.includes(device.id)}
                    onCheckedChange={() => toggleDevice(device.id)}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Monitor className="w-4 h-4 text-gray-500" />
                      <p className="font-medium">{device.name}</p>
                    </div>
                    {device.branches?.name && (
                      <p className="text-sm text-gray-500 mt-1">{device.branches.name}</p>
                    )}
                    <span className={`text-xs mt-2 flex items-center gap-1 ${
                      device.status === 'online' ? 'text-green-500' : 'text-gray-400'
                    }`}>
                      ● {device.status === 'online' ? 'Çevrimiçi' : 'Çevrimdışı'}
                    </span>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            filteredGroups.map((group) => {
              const deviceIds = group.branch_group_assignments?.flatMap(
                (assignment: any) => assignment.branches?.devices?.map((d: any) => d.id) || []
              ) || [];
              const allSelected = deviceIds.length > 0 && deviceIds.every(id => selectedDevices.includes(id));
              const someSelected = deviceIds.some(id => selectedDevices.includes(id));

              return (
                <Card
                  key={group.id}
                  className={`p-4 cursor-pointer transition-colors hover:bg-accent ${
                    allSelected ? "border-primary" : someSelected ? "border-primary/50" : ""
                  }`}
                  onClick={() => handleSelectGroup(group)}
                >
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      checked={allSelected}
                      className={someSelected && !allSelected ? "opacity-50" : ""}
                      onCheckedChange={() => handleSelectGroup(group)}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        <p className="font-medium">{group.name}</p>
                      </div>
                      {group.description && (
                        <p className="text-sm text-gray-500 mt-1">{group.description}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-2">
                        {deviceIds.length} cihaz
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </ScrollArea>

      <div className="flex justify-between pt-4 border-t">
        <Button variant="outline" onClick={onBack}>
          Geri
        </Button>
        <Button onClick={onNext} disabled={selectedDevices.length === 0}>
          İleri
        </Button>
      </div>
    </div>
  );
}