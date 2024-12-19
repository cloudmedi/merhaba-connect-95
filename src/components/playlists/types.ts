export interface Manager {
  _id: string;
  id?: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

export interface PlaylistRowProps {
  playlist: any;
  onPlay: (playlist: any) => void;
  onEdit: (playlist: any) => void;
  onDelete: (id: string) => void;
  onStatusChange: () => void;
}