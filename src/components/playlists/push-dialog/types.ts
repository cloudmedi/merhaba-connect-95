import type { Device } from "@/pages/Manager/Devices/hooks/types";

export interface PushDialogProps {
  isOpen: boolean;
  onClose: () => void;
  playlistTitle: string;
  playlistId: string;
}

export interface DialogFooterProps {
  selectedCount: number;
  selectedTokens: string[];
  isSyncing: boolean;
  onCancel: () => void;
  onPush: () => Promise<void>;
}

// Use the base Device type to ensure consistency
export type PushDialogDevice = Device;