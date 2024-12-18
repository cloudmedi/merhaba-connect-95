export interface Mood {
  id?: string;
  _id?: string;
  name: string;
  description: string | null;
  icon: string | null;
  created_by: string | null;
  createdAt?: string;
  updatedAt?: string;
}