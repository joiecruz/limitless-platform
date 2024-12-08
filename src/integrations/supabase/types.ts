// Base types
type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// Split into smaller type files for better organization
<lov-write file_path="src/integrations/supabase/types/database.ts">
import { Json } from '../types';
import { Tables } from './tables';
import { Functions } from './functions';

export type Database = {
  public: {
    Tables: Tables;
    Functions: Functions;
    Enums: {
      [_ in never]: never
    };
    CompositeTypes: {
      [_ in never]: never
    };
  };
};