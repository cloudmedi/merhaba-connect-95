import { Json } from './json';
import { DatabaseTables } from './tables';
import { DatabaseViews } from './views';
import { DatabaseFunctions } from './functions';
import { DatabaseEnums } from './enums';

export type Database = {
  public: {
    Tables: DatabaseTables
    Views: DatabaseViews
    Functions: DatabaseFunctions
    Enums: DatabaseEnums
    CompositeTypes: {
      [_ in never]: never
    }
  }
}