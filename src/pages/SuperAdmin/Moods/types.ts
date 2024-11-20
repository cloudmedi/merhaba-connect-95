export interface Mood {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}