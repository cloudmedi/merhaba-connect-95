import { Json } from './json';
import { DatabaseTables } from './tables';
import { DatabaseViews } from './views';
import { DatabaseFunctions } from './functions';
import { DatabaseEnums } from './enums';

export interface Database {
  public: {
    Tables: DatabaseTables;
    Views: DatabaseViews;
    Functions: DatabaseFunctions;
    Enums: DatabaseEnums;
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T];