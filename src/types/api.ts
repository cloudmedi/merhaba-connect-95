export interface Playlist {
  id: string;
  name: string;
  description?: string;
  artwork_url?: string;
  created_at: string;
  updated_at: string;
  is_public: boolean;
  company_id?: string;
  genre_id?: string;
  mood_id?: string;
  created_by?: string;
  company?: {
    name: string;
  } | null;
  profiles?: Array<{
    first_name: string;
    last_name: string;
  }> | null;
}
