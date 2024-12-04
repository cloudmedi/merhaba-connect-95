import { useState } from "react";
import { SearchBar } from "./device-selection/SearchBar";
import { TabNavigation } from "./device-selection/TabNavigation";
import { TabContent } from "./device-selection/TabContent";
import { NavigationButtons } from "./device-selection/NavigationButtons";
import { useDeviceSelection } from "./device-selection/useDeviceSelection";

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

  const handleSelectGroup = (group: any, isSelected: boolean) => {
    const deviceIds = group.devices.map((device: any) => device.id);
    let newSelectedDevices = [...selectedDevices];
    
    if (isSelected) {
      deviceIds.forEach(id => {
        if (!newSelectedDevices.includes(id)) {
          newSelectedDevices.push(id);
        }
      });
    } else {
      newSelectedDevices = newSelectedDevices.filter(id => !deviceIds.includes(id));
    }
    
    onDevicesChange(newSelectedDevices);
  };

  return (
    <div className="space-y-6">
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="mt-4">
        <SearchBar 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          showSelectAll={activeTab === "devices"}
          onSelectAll={handleSelectAll}
          selectAllText={selectedDevices.length === filteredDevices.length ? "Seçimi Kaldır" : "Tümünü Seç"}
        />
      </div>

      <TabContent 
        activeTab={activeTab}
        isLoading={isLoadingDevices || isLoadingGroups}
        devices={filteredDevices}
        groups={filteredGroups}
        selectedDevices={selectedDevices}
        onToggleDevice={toggleDevice}
        onSelectGroup={handleSelectGroup}
      />

      <NavigationButtons 
        onBack={onBack}
        onNext={onNext}
        isNextDisabled={selectedDevices.length === 0}
      />
    </div>
  );
}