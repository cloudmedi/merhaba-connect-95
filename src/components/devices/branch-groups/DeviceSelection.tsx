import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Device } from "@/pages/Manager/Devices/hooks/types";

interface DeviceSelectionProps {
  devices: Device[];
  groups: any[];
  selectedDevices: string[];
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  setSelectedDevices: (value: string[]) => void;
  onSelectGroup: (groupId: string, isSelected: boolean) => void;
  isLoading?: boolean;
}

export function DeviceSelection({ 
  devices, 
  groups,
  selectedDevices, 
  searchQuery, 
  setSearchQuery, 
  setSelectedDevices,
  onSelectGroup,
  isLoading = false
}: DeviceSelectionProps) {
  const [activeTab, setActiveTab] = useState("devices");

  const filteredDevices = devices.filter(device =>
    device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (device.branches?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
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

  const toggleDevice = (deviceId: string) => {
    setSelectedDevices(
      selectedDevices.includes(deviceId)
        ? selectedDevices.filter(id => id !== deviceId)
        : [...selectedDevices, deviceId]
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-[300px] w-full" />
      </div>
    );
  }

  return (
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

      <ScrollArea className="h-[300px] rounded-md border p-4">
        <div className="space-y-4">
          {activeTab === "devices" ? (
            filteredDevices.map((device) => (
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
                  <p className="font-medium text-sm">{device.name}</p>
                  {device.branches?.name && (
                    <p className="text-sm text-gray-500">{device.branches.name}</p>
                  )}
                  <span className={`text-xs ${device.status === 'online' ? 'text-green-500' : 'text-gray-400'}`}>
                    ● {device.status === 'online' ? 'Çevrimiçi' : 'Çevrimdışı'}
                  </span>
                </div>
              </div>
            ))
          ) : (
            filteredGroups.map((group) => {
              const groupDevices = group.branch_group_assignments?.flatMap(
                (assignment: any) => assignment.branches?.devices || []
              ) || [];
              const deviceIds = groupDevices.map((d: any) => d.id);
              const isFullySelected = deviceIds.length > 0 && deviceIds.every(id => selectedDevices.includes(id));
              const isPartiallySelected = deviceIds.some(id => selectedDevices.includes(id));

              return (
                <div
                  key={group.id}
                  className="flex items-start space-x-3 p-4 rounded-lg border hover:bg-accent cursor-pointer"
                  onClick={() => onSelectGroup(group.id, !isFullySelected)}
                >
                  <Checkbox
                    checked={isFullySelected}
                    className={isPartiallySelected && !isFullySelected ? "opacity-50" : ""}
                    onCheckedChange={() => onSelectGroup(group.id, !isFullySelected)}
                  />
                  <div>
                    <p className="font-medium text-sm">{group.name}</p>
                    <p className="text-xs text-gray-500">{groupDevices.length} cihaz</p>
                    {group.description && (
                      <p className="text-sm text-gray-500 mt-1">{group.description}</p>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
}