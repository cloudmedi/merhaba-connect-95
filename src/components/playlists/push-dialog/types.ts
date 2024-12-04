import { Device, DeviceSystemInfo } from "@/pages/Manager/Devices/hooks/types";

export interface Group {
  id: string;
  name: string;
  description?: string;
  branch_group_assignments?: Array<{
    branches?: {
      id?: string;
      name?: string;
      devices?: Array<{
        id: string;
        name: string;
        status: 'online' | 'offline';
      }>;
    };
  }>;
}

export interface DialogHeaderProps {
  onClose: () => void;
}

export interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSelectAll?: () => void;
  selectedCount: number;
  totalCount: number;
}

export interface DeviceListProps {
  devices: Device[];
  selectedDevices: string[];
  onToggleDevice: (deviceId: string) => void;
}

export interface GroupListProps {
  groups: Group[];
  selectedDevices: string[];
  onSelectGroup: (groupId: string, isSelected: boolean) => void;
}

export interface DialogFooterProps {
  selectedCount: number;
  onCancel: () => void;
  onPush: () => void;
}