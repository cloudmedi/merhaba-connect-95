export interface Playlist {
  _id: string;
  id?: string;
  name: string;
  description?: string;
  artworkUrl?: string;
  artwork_url?: string;
  created_at: string;
  updated_at: string;
  isPublic: boolean;
  is_public?: boolean;
  isHero?: boolean;
  company_id?: string;
  genre_id?: string;
  mood_id?: string;
  genre?: any;
  mood?: any;
  created_by?: string;
  categories?: any[];
  songs?: any[];
  assignedManagers?: any[];
  company?: {
    name: string;
  } | null;
  profiles?: Array<{
    first_name: string;
    last_name: string;
  }> | null;
}