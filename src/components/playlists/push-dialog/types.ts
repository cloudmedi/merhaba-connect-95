import type { Device as BaseDevice } from "@/pages/Manager/Devices/hooks/types";

export type PushDialogDevice = Omit<BaseDevice, 'system_info' | 'branches'> & {
  branches?: {
    id?: string;
    name?: string;
    company_id?: string | null;
  } | null;
};

export interface DialogFooterProps {
  selectedCount: number;
  selectedTokens: string[];
  isSyncing: boolean;
  onCancel: () => void;
  onPush: () => Promise<void>;
}

export interface PushDialogProps {
  isOpen: boolean;
  onClose: () => void;
  playlistTitle: string;
  playlistId: string;
}