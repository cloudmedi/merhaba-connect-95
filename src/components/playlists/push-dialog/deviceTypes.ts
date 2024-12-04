import type { Device as BaseDevice, DeviceSystemInfo as BaseDeviceSystemInfo } from "@/pages/Manager/Devices/hooks/types";

export interface PushDialogDevice extends Omit<BaseDevice, 'system_info'> {
  system_info: BaseDeviceSystemInfo;
  branches?: {
    id: string;
    name: string;
  } | null;
}

export interface GroupDevice {
  id: string;
  name: string;
  status: 'online' | 'offline';
}

export interface GroupBranch {
  id?: string;
  name?: string;
  devices?: GroupDevice[];
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  branch_group_assignments?: Array<{
    branches?: GroupBranch;
  }>;
}