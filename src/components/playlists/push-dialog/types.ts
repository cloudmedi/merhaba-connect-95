export interface PushDialogDevice {
  id: string;
  name: string;
  status: string;
  category?: string;
  last_seen?: string;
  branches?: {
    id: string;
    name: string;
  };
}

export interface PushDialogProps {
  isOpen: boolean;
  onClose: () => void;
  playlistTitle: string;
  playlistId: string;
}