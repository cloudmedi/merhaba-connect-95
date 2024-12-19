export interface Playlist {
  _id: string;
  name: string;
  description?: string;
  isPublic: boolean;
  isHero: boolean;
  artworkUrl?: string;
  songs?: Array<{
    songId: string;
    position: number;
  }>;
  categories?: any[];
  genre?: any;
  mood?: any;
  assignedManagers?: string[];
  playCount: number;
  createdAt: string;
  updatedAt: string;
  company?: {
    name: string;
  } | null;
  profiles?: Array<{
    first_name: string;
    last_name: string;
  }> | null;
}