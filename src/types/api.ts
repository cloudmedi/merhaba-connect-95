export interface Song {
  id: string;
  title: string;
  artist?: string;
  album?: string;
  genre?: string[];
  duration: number;
  file_url: string;
  artwork_url?: string;
  bunny_id?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}