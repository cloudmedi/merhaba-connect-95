import { DeviceGroupDialog } from "./DeviceGroupDialog";

export interface DeviceGroup {
  id: string;
  name: string;
  description: string;
  deviceIds: string[];
}

export function DeviceGroupManagement({ onCreateGroup }: { onCreateGroup: (group: DeviceGroup) => void }) {
  return null;
}