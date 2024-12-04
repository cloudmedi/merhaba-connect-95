import { Skeleton } from "@/components/ui/skeleton";
import { DeviceList } from "./DeviceList";
import { GroupList } from "./GroupList";

interface TabContentProps {
  activeTab: string;
  isLoading: boolean;
  devices: any[];
  groups: any[];
  selectedDevices: string[];
  onToggleDevice: (deviceId: string) => void;
  onSelectGroup: (group: any, isSelected: boolean) => void;
}

export function TabContent({
  activeTab,
  isLoading,
  devices,
  groups,
  selectedDevices,
  onToggleDevice,
  onSelectGroup,
}: TabContentProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-[300px] w-full" />
      </div>
    );
  }

  return (
    <>
      {activeTab === "devices" ? (
        <DeviceList 
          devices={devices}
          selectedDevices={selectedDevices}
          onToggleDevice={onToggleDevice}
        />
      ) : (
        <GroupList 
          groups={groups}
          selectedDevices={selectedDevices}
          onSelectGroup={onSelectGroup}
        />
      )}
    </>
  );
}