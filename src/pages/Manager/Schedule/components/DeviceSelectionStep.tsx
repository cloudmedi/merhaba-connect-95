import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useDeviceSelection } from "./device-selection/useDeviceSelection";
import { SearchBar } from "./device-selection/SearchBar";
import { DeviceList } from "./device-selection/DeviceList";
import { GroupList } from "./device-selection/GroupList";

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
  const { devices, groups, isLoadingDevices, isLoadingGroups } = useDeviceSelection();

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
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="devices">Cihazlar</TabsTrigger>
          <TabsTrigger value="groups">Gruplar</TabsTrigger>
        </TabsList>

        <div className="mt-4">
          <SearchBar 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            showSelectAll={activeTab === "devices"}
            onSelectAll={handleSelectAll}
            selectAllText={selectedDevices.length === filteredDevices.length ? "Seçimi Kaldır" : "Tümünü Seç"}
          />
        </div>

        <TabsContent value="devices">
          <DeviceList 
            devices={filteredDevices}
            selectedDevices={selectedDevices}
            onToggleDevice={toggleDevice}
          />
        </TabsContent>

        <TabsContent value="groups">
          <GroupList 
            groups={filteredGroups}
            selectedDevices={selectedDevices}
            onSelectGroup={handleSelectGroup}
          />
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