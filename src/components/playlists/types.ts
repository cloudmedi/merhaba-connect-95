export interface Manager {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role?: string;
}