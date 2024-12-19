export interface Playlist {
  _id: string;
  name: string;
  description?: string;
  artwork_url?: string;
  is_public?: boolean;
  isHero?: boolean;
  genre?: any;
  mood?: any;
  categories?: any[];
  songs?: any[];
  assignedManagers?: any[];
  created_at: string;
  updated_at: string;
  company?: {
    name: string;
  } | null;
  profiles?: Array<{
    first_name: string;
    last_name: string;
  }> | null;
}