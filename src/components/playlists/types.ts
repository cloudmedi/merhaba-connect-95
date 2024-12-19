export interface Manager {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role?: string;
}

export interface PlaylistRowProps {
  playlist: any;
  onPlay: (playlist: any) => void;
  onEdit: (playlist: any) => void;
  onDelete: (id: string) => void;
  onStatusChange: () => void;
}