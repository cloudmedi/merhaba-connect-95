export interface Manager {
  _id: string;
  id?: string; // Geriye dönük uyumluluk için
  email: string;
  firstName?: string;
  lastName?: string;
  first_name?: string; // Geriye dönük uyumluluk için
  last_name?: string; // Geriye dönük uyumluluk için
}

export interface PlaylistRowProps {
  playlist: any;
  onPlay: (playlist: any) => void;
  onEdit: (playlist: any) => void;
  onDelete: (id: string) => void;
  onStatusChange: () => void;
}