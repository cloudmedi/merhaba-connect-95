import { DeviceList } from "./DeviceList";
import { GroupList } from "./GroupList";
import { Device, Group } from "../types";

interface TabContentProps {
  activeTab: string;
  isLoading: boolean;
  devices: Device[];
  groups: Group[];
  selectedDevices: string[];
  onDevicesChange: (devices: string[]) => void;
}

export function TabContent({
  activeTab,
  isLoading,
  devices,
  groups,
  selectedDevices,
  onDevicesChange
}: TabContentProps) {
  if (isLoading) {
    return <div className="text-center py-4">Yükleniyor...</div>;
  }

  return activeTab === "devices" ? (
    <DeviceList
      devices={devices}
      selectedDevices={selectedDevices}
      onDevicesChange={onDevicesChange}
    />
  ) : (
    <GroupList
      groups={groups}
      selectedDevices={selectedDevices}
      onDevicesChange={onDevicesChange}
    />
  );
}